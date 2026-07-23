import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "microphone=(), payment=(), usb=(), midi=(), magnetometer=(), gyroscope=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  turbopack: {}, // Empty turbopack config to silence Next.js 16 warning
  // Type-checking runs separately (npm run ts-err). Skipping it in `next build`
  // avoids a redundant full-repo pass across 1,931 pages on every deploy.
  // (Next.js 16 decoupled ESLint from `next build` entirely, so there's no
  // equivalent `eslint` build option anymore - use `next lint` / npm run lint.)
  typescript: { ignoreBuildErrors: true },
  // Force fully sequential static generation (1 worker instead of parallel
  // workers each holding their own copy of the render context) to cut peak
  // build memory on the constrained 8GB build machine, at the cost of a
  // slower build.
  experimental: {
    cpus: 1,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/workers/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle web workers
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };

      // Handle worker files
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      });
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });

      // Exclude TypeScript files in workers directory from being processed by Next.js
      const tsRule = config.module.rules.find(
        (rule: any) => rule.test && rule.test.toString().includes("ts"),
      );
      if (tsRule && tsRule.exclude) {
        if (Array.isArray(tsRule.exclude)) {
          tsRule.exclude.push(/public\/workers/);
        } else {
          tsRule.exclude = [tsRule.exclude, /public\/workers/];
        }
      } else if (tsRule) {
        tsRule.exclude = /public\/workers/;
      }
    }

    return config;
  },
};

export default nextConfig;
