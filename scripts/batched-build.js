#!/usr/bin/env node
/**
 * Splits the app's ~1,931 page.tsx routes into smaller batches and runs
 * `next build --debug-build-paths=...` once per batch, each as a fresh
 * process, so peak memory stays bounded instead of growing across the
 * whole 1,931-page build. Merges the resulting .next outputs into one
 * combined .next directory afterward.
 *
 * Env vars:
 *   BATCH_SIZE     pages per batch (default 120)
 *   BATCH_HEAP_MB  NODE_OPTIONS max-old-space-size per batch (default 4096)
 *   MAX_PAGES      limit total pages considered (for quick local testing)
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

const ROOT = process.cwd();
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "120", 10);
const HEAP_MB = process.env.BATCH_HEAP_MB || "4096";
const BATCHES_DIR = path.join(ROOT, ".next-batches");
const FINAL_DIST = path.join(ROOT, ".next");
const PAGE_FILENAMES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

function walkPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPages(full, out);
    } else if (PAGE_FILENAMES.has(entry.name)) {
      out.push(path.relative(ROOT, full).split(path.sep).join("/"));
    }
  }
  return out;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  // Node's recursive fs.rmSync can race on the WSL <-> Windows drive mount
  // (ENOTEMPTY from directory-listing inconsistency mid-delete). Shelling out
  // to native rm -rf is more robust there; retry once on transient failure.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      execSync(`rm -rf ${JSON.stringify(p)}`);
      return;
    } catch (err) {
      if (attempt === 2) throw err;
    }
  }
}

// Merges a single src node (file OR directory) into dest, recursing for
// directories. Handled generically at every level - src can be a plain
// file even at the top of a merge call (e.g. server/app/_global-error.html
// sits as a file directly alongside route directories), so the file/dir
// branch can't be hoisted only into the loop body one level up.
//
// strict=true is for output that's genuinely per-page (real tool routes
// under server/app/<tool>/): a same-filename collision there would mean
// two different pages landed on the same path, an actual bug worth failing
// loudly on.
//
// strict=false is for anything framework-generated that Next re-emits in
// every batch regardless of --debug-build-paths (error pages, 404/500
// fallbacks, shared chunks, build manifests) - discovered empirically to
// differ in superficial ways (internal reference IDs, etc.) while being
// functionally identical every time. First batch wins, no comparison
// needed - not worth strict-checking since it's never been a real bug.
function mergeEntry(src, dest, strict) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      mergeEntry(path.join(src, entry.name), path.join(dest, entry.name), strict);
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    if (!strict) return; // first batch wins
    if (fs.readFileSync(src).equals(fs.readFileSync(dest))) return;
    throw new Error(
      `Merge conflict: ${dest} differs between batches (same filename, different content)`,
    );
  }
  fs.copyFileSync(src, dest);
}

function copyDirMerge(src, dest, strict) {
  if (!fs.existsSync(src)) return;
  mergeEntry(src, dest, strict);
}

// server/app/<name>/... (and server/app/<name>.html etc, which are files,
// not dirs) : real tool pages get strict per-page merging; framework-
// injected routes (leading underscore, e.g. _not-found, _global-error)
// get permissive merging.
function copyServerAppMerge(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    const isFrameworkRoute = entry.name.startsWith("_");
    mergeEntry(s, d, !isFrameworkRoute);
  }
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function mergeBatches(n) {
  rimraf(FINAL_DIST);
  fs.mkdirSync(FINAL_DIST, { recursive: true });

  const batchDirs = Array.from({ length: n }, (_, i) =>
    path.join(BATCHES_DIR, `batch-${i}`),
  );
  const first = batchDirs[0];

  const sharedTopLevel = [
    "BUILD_ID",
    "package.json",
    "required-server-files.js",
    "required-server-files.json",
    "next-minimal-server.js.nft.json",
    "next-server.js.nft.json",
    "images-manifest.json",
    "export-marker.json",
    "server/functions-config-manifest.json",
    "server/interception-route-rewrite-manifest.js",
    "server/middleware-build-manifest.js",
    "server/middleware-manifest.json",
    "server/middleware-react-loadable-manifest.js",
    "server/next-font-manifest.js",
    "server/next-font-manifest.json",
    "server/webpack-runtime.js",
    "server/pages-manifest.json",
    // This app registers no React Server Actions (empty node/edge maps in
    // every batch tested) so the per-build random encryption key is harmless
    // to just take from one batch. If server actions are ever added, this
    // needs to become a real per-batch union instead.
    "server/server-reference-manifest.js",
    "server/server-reference-manifest.json",
  ];
  for (const rel of sharedTopLevel) {
    const s = path.join(first, rel);
    const d = path.join(FINAL_DIST, rel);
    if (!fs.existsSync(s)) continue;
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.cpSync(s, d, { recursive: true });
  }

  const permissiveDirs = ["static", "server/pages", "server/chunks"];
  for (const dir of batchDirs) {
    for (const rel of permissiveDirs) {
      copyDirMerge(path.join(dir, rel), path.join(FINAL_DIST, rel), false);
    }
    copyServerAppMerge(path.join(dir, "server/app"), path.join(FINAL_DIST, "server/app"));
  }

  const flatManifests = ["server/app-paths-manifest.json", "app-path-routes-manifest.json"];
  for (const rel of flatManifests) {
    const merged = {};
    for (const dir of batchDirs) {
      const p = path.join(dir, rel);
      if (!fs.existsSync(p)) continue;
      Object.assign(merged, readJSON(p));
    }
    const d = path.join(FINAL_DIST, rel);
    fs.mkdirSync(path.dirname(d), { recursive: true });
    writeJSON(d, merged);
  }

  {
    const merged = readJSON(path.join(first, "build-manifest.json"));
    merged.pages = merged.pages || {};
    for (const dir of batchDirs) {
      const p = path.join(dir, "build-manifest.json");
      if (!fs.existsSync(p)) continue;
      Object.assign(merged.pages, readJSON(p).pages || {});
    }
    writeJSON(path.join(FINAL_DIST, "build-manifest.json"), merged);
  }

  {
    const p0 = path.join(first, "react-loadable-manifest.json");
    if (fs.existsSync(p0)) {
      const merged = {};
      for (const dir of batchDirs) {
        const p = path.join(dir, "react-loadable-manifest.json");
        if (!fs.existsSync(p)) continue;
        Object.assign(merged, readJSON(p));
      }
      writeJSON(path.join(FINAL_DIST, "react-loadable-manifest.json"), merged);
    }
  }

  {
    const merged = readJSON(path.join(first, "prerender-manifest.json"));
    merged.routes = merged.routes || {};
    merged.dynamicRoutes = merged.dynamicRoutes || {};
    for (const dir of batchDirs) {
      const p = path.join(dir, "prerender-manifest.json");
      if (!fs.existsSync(p)) continue;
      const b = readJSON(p);
      Object.assign(merged.routes, b.routes || {});
      Object.assign(merged.dynamicRoutes, b.dynamicRoutes || {});
    }
    writeJSON(path.join(FINAL_DIST, "prerender-manifest.json"), merged);
  }

  {
    const merged = readJSON(path.join(first, "routes-manifest.json"));
    const staticByPage = new Map();
    for (const dir of batchDirs) {
      const p = path.join(dir, "routes-manifest.json");
      if (!fs.existsSync(p)) continue;
      for (const route of readJSON(p).staticRoutes || []) {
        staticByPage.set(route.page, route);
      }
    }
    merged.staticRoutes = Array.from(staticByPage.values());
    writeJSON(path.join(FINAL_DIST, "routes-manifest.json"), merged);
  }
}

async function main() {
  const buildId = process.env.BATCH_BUILD_ID || crypto.randomBytes(8).toString("hex");
  console.log(`[batched-build] Using build ID: ${buildId}`);

  let allPages = walkPages(path.join(ROOT, "app"));
  if (process.env.MAX_PAGES) {
    allPages = allPages.slice(0, parseInt(process.env.MAX_PAGES, 10));
  }
  console.log(`[batched-build] Found ${allPages.length} page files`);

  const batches = chunk(allPages, BATCH_SIZE);
  console.log(
    `[batched-build] Split into ${batches.length} batches of up to ${BATCH_SIZE} pages`,
  );

  rimraf(BATCHES_DIR);
  fs.mkdirSync(BATCHES_DIR, { recursive: true });

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n[batched-build] === Batch ${i + 1}/${batches.length} (${batch.length} pages) ===`);
    rimraf(FINAL_DIST);
    const pathsArg = batch.join(",");
    execSync(`npx next build --webpack --debug-build-paths="${pathsArg}"`, {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_OPTIONS: `--max-old-space-size=${HEAP_MB}`,
        BATCH_BUILD_ID: buildId,
      },
    });
    const batchDest = path.join(BATCHES_DIR, `batch-${i}`);
    fs.renameSync(FINAL_DIST, batchDest);
    console.log(`[batched-build] Batch ${i + 1} done -> ${batchDest}`);
  }

  console.log(`\n[batched-build] Merging ${batches.length} batches into ${FINAL_DIST} ...`);
  mergeBatches(batches.length);
  console.log(`[batched-build] Merge complete.`);
}

main().catch((err) => {
  console.error("[batched-build] FAILED:", err);
  process.exit(1);
});
