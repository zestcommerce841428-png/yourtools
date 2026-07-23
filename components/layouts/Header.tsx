"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { DarkLightModeToggler } from "../utils/DarkLightModesToggler";
import { FavouriteToggle } from "../utils/FavouriteToggle";
import UniversalSearch from "../utils/universal-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavCategory = { name: string; href: string };

export default function Header({ categories }: { categories: NavCategory[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between w-full px-4 gap-4">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold hidden sm:inline">
              YourTools
            </span>
            <span className="text-xl font-semibold sm:hidden">YT</span>
          </div>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 flex-1"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/explore-all-tools">Explore All Tools</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Categories
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-[70vh] w-[560px] overflow-y-auto p-2"
            >
              <div className="grid grid-cols-2 gap-x-2">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.href} asChild>
                    <Link href={category.href}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <UniversalSearch />
          <FavouriteToggle />
          <DarkLightModeToggler />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5 sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Primary"
                className="flex flex-col gap-1 px-4 pb-4 overflow-y-auto"
              >
                <SheetClose asChild>
                  <Link
                    href="/explore-all-tools"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Explore All Tools
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/about"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    About
                  </Link>
                </SheetClose>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </p>
                {categories.map((category) => (
                  <SheetClose key={category.href} asChild>
                    <Link
                      href={category.href}
                      className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      {category.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
