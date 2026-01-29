"use client";

import React, { useState, useEffect } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Github as IconBrandGithub,
  Twitter as IconBrandX,
  Repeat as IconExchange,
  Home as IconHome,
  Plus as IconNewSection,
  Terminal as IconTerminal2,
  Settings as IconSettings,
  Files as IconFiles,
  Shield as IconShield,
  BarChart3 as IconChartBar,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingNavbar() {
  // We can filter links based on auth state if needed, but for now we map the main navigation
  const links = [
    {
      title: "Tableau de Bord",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },
    {
      title: "Simulateur",
      icon: (
        <IconChartBar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/earnings/simulate",
    },
    {
      title: "Salle de Guerre",
      icon: (
        <IconShield className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://the-war-room-tawny.vercel.app/",
    },
    {
      title: "Ressources & Scripts",
      icon: (
        <IconFiles className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/resources",
    },
    {
      title: "Paramètres",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/settings",
    },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  );
}
