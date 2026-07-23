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
  // Type-checking and linting run separately (npm run ts-err / npm run lint).
  // Skipping them in `next build` avoids a redundant full-repo pass across
  // 1,931 pages on every deploy, since they're already verified elsewhere.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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
