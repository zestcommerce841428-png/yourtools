import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore All Math Tools | your-domain.com",
    description: "Various Categories of math tools all in one place",
    alternates: {
        canonical: "/math-tools",
    }
};


export default function MathToolsPageLayout({ children }: { children: React.ReactNode }) {
    return children;
}
