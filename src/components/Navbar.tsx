"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?featured=1", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ivory/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex flex-col leading-none focus-ring">
          <span className="font-display text-xl tracking-wide text-maroon md:text-2xl">
            तोरणद्वार
          </span>
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold-dark">
            ItraWala
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-body text-sm uppercase tracking-wider text-ink/80 transition hover:text-maroon focus-ring"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link href="/account" aria-label="Account" className="hidden text-ink/80 hover:text-maroon md:block focus-ring">
            <User size={20} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-ink/80 hover:text-maroon focus-ring">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-maroon text-[11px] font-semibold text-ivory">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="text-ink md:hidden focus-ring"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-gold/20 bg-ivory md:hidden">
          <ul className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-2 font-body text-sm uppercase tracking-wider text-ink/80 hover:text-maroon"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/account" className="block py-2 font-body text-sm uppercase tracking-wider text-ink/80 hover:text-maroon">
                Account
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
