import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Video Converter – Convert MP4, WebM, MKV, MOV & More",
  description:
    "Convert video and audio files instantly in your browser — no uploads, no software, completely free. Supports MP4, WebM, MKV, MOV, MP3, WAV and more.",
  authors: [{ name: "YourTools" }],
  creator: "YourTools",
  publisher: "YourTools",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/video-tools/video-format-converter",
    siteName: "YourTools",
    title: "Free Online Video Converter – Convert MP4, WebM, MKV, MOV & More",
    description:
      "Convert video and audio files instantly in your browser — no uploads, no software, completely free. Supports MP4, WebM, MKV, MOV, MP3, WAV and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Video Converter – Convert MP4, WebM, MKV, MOV & More",
    description:
      "Convert video and audio files instantly in your browser — no uploads, no software, completely free. Supports MP4, WebM, MKV, MOV, MP3, WAV and more.",
  },
  alternates: {
    canonical: "/video-tools/video-format-converter",
  },
};

export default function VideoFormatConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
