"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    Home as IconHome,
    Settings as IconSettings,
    Files as IconFiles,
    Shield as IconShield,
    BarChart3 as IconChartBar
} from "lucide-react";

// Optimization: Define links outside component to prevent recreation on every render
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

export function FloatingNavbar() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <FloatingDock
                mobileClassName="translate-y-20"
                items={links}
            />
        </div>
    );
}
