"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/config";
import { NAV_ITEMS } from "@/lib/constants";

const MobileNav = dynamic(
  () => import("./mobile-nav").then((m) => m.MobileNav),
  {
    ssr: false,
    loading: () => (
      <button
        className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-rush-dark-green"
        aria-label="Open menu"
      >
        <span className="block h-6 w-6" />
      </button>
    ),
  }
);

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rush-surface/80 backdrop-blur-xl shadow-card">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto px-6 lg:px-8 h-16">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/riccc-logo-transparent.webp"
            alt={`${siteConfig.name} logo`}
            width={36}
            height={36}
            sizes="36px"
            className="rounded-sm object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-tighter text-rush-dark-green">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-rush-dark-green font-semibold border-b-2 border-rush-teal pb-1"
                    : "text-rush-on-surface-variant hover:text-rush-dark-green"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-rush-dark-green text-white px-5 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Collaborate
          </Link>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
