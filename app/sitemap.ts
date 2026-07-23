import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { SITE_URL } from "@/lib/site-config";

const DOMAIN = SITE_URL;

// Routes that exist under app/ but shouldn't be publicly indexed.
const EXCLUDED_ROUTES = new Set<string>(["/test"]);

const PAGE_FILENAMES = new Set(["page.tsx", "page.jsx", "page.js"]);

function findPageFiles(dir: string, pages: string[] = []): string[] {
  for (const item of fs.readdirSync(dir)) {
    if (item.startsWith(".") || item === "node_modules") continue;
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      findPageFiles(itemPath, pages);
    } else if (PAGE_FILENAMES.has(item)) {
      pages.push(itemPath);
    }
  }
  return pages;
}

function toRoute(pageFile: string, appDir: string): string {
  const relativeDir = path.dirname(path.relative(appDir, pageFile));
  if (relativeDir === ".") return "/";
  return `/${relativeDir.replace(/\\/g, "/")}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "app");
  const lastModified = new Date();

  const routes = findPageFiles(appDir)
    .map((file) => toRoute(file, appDir))
    .filter((route) => !route.includes("[") && !route.includes("]"))
    .filter((route) => !route.startsWith("/api") && !EXCLUDED_ROUTES.has(route));

  return routes.map((route) => {
    const depth = route === "/" ? 0 : route.split("/").filter(Boolean).length;
    return {
      url: route === "/" ? DOMAIN : `${DOMAIN}${route}`,
      lastModified,
      changeFrequency: "monthly",
      priority: depth === 0 ? 1.0 : depth === 1 ? 0.9 : 0.8,
    };
  });
}
