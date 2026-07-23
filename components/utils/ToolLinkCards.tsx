"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

interface Tool {
  name: string;
  description?: string;
  href: string;
}

interface ToolLinkCardsProps {
  tools: Tool[];
}

const ToolLinkCards: React.FC<ToolLinkCardsProps> = ({ tools }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }
    const query = searchQuery.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query),
    );
  }, [tools, searchQuery]);

  const showSearch = tools.length > 5;

  return (
    <section className="w-full">
      {showSearch && (
        <div className="mb-6 max-w-md">
          <div className="space-y-1.5">
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="tool-search"
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card/80 dark:bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card/80 dark:bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
              {tool.name}
            </h3>
            {tool.description && (
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                {tool.description}
              </p>
            )}
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
              Open tool
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      {filteredTools.length === 0 && searchQuery && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No tools found for &ldquo;{searchQuery}&rdquo;
        </p>
      )}
    </section>
  );
};

export default ToolLinkCards;
