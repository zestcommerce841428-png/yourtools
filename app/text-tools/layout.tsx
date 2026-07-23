import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Text Tools that works instantly to make you prodictive",
    description:
        "Free Text tools from yourtools from word counter to case converter and growing, we want to put all text tools here that you need",
    alternates: {
        canonical: "/text-tools",
    },
};

export default function TextToolsPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full">
            {children}
        </div>
    )
}