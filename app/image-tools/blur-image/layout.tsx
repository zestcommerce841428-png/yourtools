import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Blur Tool - Blur Images Online ",
  description:
    "Free online image blur tool to blur photos instantly. Perfect for privacy, focus effects, or artistic purposes. No registration required.",
  keywords: [
    "image blur tool",
    "blur images online",
    "photo blur",
    "image editing",
    "privacy blur",
    "online image editor",
    "free image tool",
  ],
  authors: [{ name: "YourTools" }],
  creator: "YourTools",
  publisher: "YourTools",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Free Image Blur Tool - Blur Images Online ",
    description:
      "Free online image blur tool to blur photos instantly. Perfect for privacy, focus effects, or artistic purposes. No registration required.",
    url: "/image-tools/blur-image",
    siteName: "YourTools",
    images: [
      {
        url: "/og-image-blur-tool.jpg",
        width: 1200,
        height: 630,
        alt: "YourTools Image Blur Tool",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Blur Tool - Blur Images Online ",
    description:
      "Free online image blur tool to blur photos instantly. Perfect for privacy, focus effects, or artistic purposes. No registration required.",
    images: ["/og-image-blur-tool.jpg"],
  },
  alternates: {
    canonical: "/image-tools/blur-image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
};

export default function BlurImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
