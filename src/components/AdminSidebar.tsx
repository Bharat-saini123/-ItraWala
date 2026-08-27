"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Mail, Star, ArrowLeft } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-gold/20 bg-maroon p-4 md:h-screen md:w-60 md:border-b-0 md:border-r md:p-5">
      <div className="mb-4 px-2">
        <p className="font-display text-lg text-gold-light">तोरणद्वार</p>
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-ivory/60">Admin Panel</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 font-body text-sm transition ${
                active ? "bg-gold text-maroon-dark font-semibold" : "text-ivory/75 hover:bg-ivory/10"
              }`}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2.5 font-body text-sm text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
      >
        <ArrowLeft size={16} /> Back to store
      </Link>
    </aside>
  );
}
