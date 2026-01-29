"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Ressources",
    href: "/resources",
    icon: "folder_open",
  },
  {
    title: "Partenaires",
    href: "/partners",
    icon: "handshake",
  },
  {
    title: "Commissions",
    href: "/earnings",
    icon: "payments",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-100 flex flex-col fixed h-full bg-white z-50">
      {/* Logo */}
      <div className="px-8 py-10 flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl font-light">
          hub
        </span>
        <h2 className="text-base font-medium tracking-wide font-serif italic">
          Uprising Node
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link flex items-center gap-4 px-4 py-3 text-sm font-medium border-l-2 transition-all",
                isActive
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black hover:border-gray-200",
              )}
            >
              <span className="material-symbols-outlined font-light text-xl">
                {item.icon}
              </span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-8 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat bg-cover grayscale size-8 rounded-full border border-gray-100"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWMHu3cdC7YzS7ePUZB3zUzeU2mFFCUmWXNdHiCHh_Z6PRJ_80Ytb-tIwWMtp1C0VI3aulxvMFbg3oT_ixe_a_vkrooCwvnu8hg19VvC-tqiA5i3AQ1UBsrBP0-N6QHtzDapkPN21UmDlFgq1SUK1ndRi7MH5K8mfdeCQhxO-EEqhtOqnNx5vfSZc_6w8HyrBDYJP79lSn2cecmXKNOObzVhkfDHquPYMiz7QzwkKzhGvvjAdH4JQ714k7fcOw2tnhUB9ewuanvfUa")`,
            }}
          ></div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest leading-none mb-1">
              K. Miller
            </p>
            <p className="text-[9px] text-gray-400 truncate">
              kmiller@uprising.node
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
