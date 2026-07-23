// Single source of truth for brand name and canonical site URL.
// Set NEXT_PUBLIC_SITE_URL in your environment once you have a real domain —
// every other file should import from here instead of hardcoding either value.
export const SITE_NAME = "YourTools";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
