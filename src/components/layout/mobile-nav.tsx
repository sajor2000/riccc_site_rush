"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config";
import { NAV_ITEMS } from "@/lib/constants";
import { useState } from "react";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-rush-dark-green hover:bg-rush-surface-container-high">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-rush-surface text-rush-dark-green border-rush-outline-variant"
      >
        <SheetTitle className="text-rush-dark-green">
          {siteConfig.name}
        </SheetTitle>
        <nav className="flex flex-col gap-1 mt-6">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-md text-base transition-colors ${
                  isActive
                    ? "bg-rush-surface-container-high font-semibold text-rush-dark-green"
                    : "text-rush-on-surface-variant hover:bg-rush-surface-container hover:text-rush-dark-green"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 bg-rush-dark-green text-white px-4 py-3 rounded-md text-base font-medium text-center"
          >
            Collaborate
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
