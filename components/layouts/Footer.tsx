import Link from "next/link";
import { Twitter, Wrench, ArrowUpRight, ChevronRight } from "lucide-react";
import footerLinks from "@/json-assets/footer-tool-links.json";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative bg-muted/30 text-foreground overflow-hidden transition-colors duration-300">
      {/* Subtle grid texture overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <div className="relative container mx-auto px-6 pt-16 pb-8">
        {/* Hero row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-black text-xl tracking-tight text-foreground">
                YourTools
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              A carefully curated collection of tools for everyday tasks. Free,
              fast, and always available.
            </p>
            <Link
              href="https://x.com/yourtools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 group"
            >
              <Twitter className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Follow us</span>
              <ArrowUpRight
                className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Large decorative number */}
          <div
            className="hidden lg:block text-[10rem] font-black leading-none text-muted select-none tracking-tighter"
            aria-hidden="true"
          >
            1000
          </div>
        </div>

        {/* Nav + Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Quick Links */}
          <nav aria-label="Site navigation">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <span
                      aria-hidden="true"
                      className="block w-3 h-px bg-border group-hover:w-5 group-hover:bg-primary transition-all duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tool categories */}
          {footerLinks.map((category) => {
            const remaining = category.totalCount - category.tools.length;
            return (
              <nav key={category.categoryHref} aria-label={`${category.categoryName} links`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
                  {category.categoryName}
                </p>
                <ul className="space-y-2.5">
                  {category.tools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        <span
                          aria-hidden="true"
                          className="block w-3 h-px bg-border group-hover:w-5 group-hover:bg-primary transition-all duration-200"
                        />
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  {remaining > 0 && (
                    <li>
                      <Link
                        href={category.categoryHref}
                        className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
                      >
                        View all {category.totalCount}
                        <ChevronRight
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} YourTools. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built with care · Everything Free · No tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
