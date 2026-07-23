import { Layers } from "lucide-react";
import ToolLinkCards from "@/components/utils/ToolLinkCards";

interface ToolLink {
  name: string;
  description: string;
  href: string;
}

interface CategoryToolsLandingPageProps {
  title: string;
  description: string;
  tools: ToolLink[];
}

export default function CategoryToolsLandingPage({
  title,
  description,
  tools,
}: CategoryToolsLandingPageProps) {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10">
          <div
            aria-hidden="true"
            className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Layers className="h-7 w-7 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tools Directory
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {tools.length} tool{tools.length === 1 ? "" : "s"} available
          </p>
        </header>

        <section aria-label={`${title} links`} className="border-t border-border pt-8">
          <ToolLinkCards tools={tools} />
        </section>
      </section>
    </main>
  );
}
