"use client";

import * as React from "react"
import { ChevronRight, File, Folder, BarChart2, Shield, Settings } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Using Lindy-style data structure
const data = {
  user: {
    name: "K. Miller",
    email: "k.miller@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tableau de Bord",
      url: "/dashboard",
      icon: BarChart2,
      isActive: true,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboard",
        },
        {
          title: "Simulateur Gains",
          url: "/earnings/simulate",
        },
        {
          title: "Analytique",
          url: "/analytics",
        },
      ],
    },
    {
      title: "Opérations",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Salle de Guerre",
          url: "https://the-war-room-tawny.vercel.app/",
        },
        {
          title: "Dépôt de Lead",
          url: "/dashboard",
        },
        {
          title: "Pipeline",
          url: "/pipeline",
        }
      ]
    },
    {
      title: "Ressources",
      url: "/resources",
      icon: File,
      items: [
        {
          title: "Dossier Stratégique",
          url: "/resources/report",
        },
        {
          title: "Scripts de Vente",
          url: "/resources/scripts",
        },
        {
          title: "Documentation",
          url: "/resources",
        },
        {
          title: "Support",
          url: "/support",
        },
      ],
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Général",
          url: "/settings",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Profil",
          url: "/profile",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-white border-r border-gray-100">
      <SidebarHeader className="p-6 bg-white border-b border-gray-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl font-light">hub</span>
          <span className="font-serif italic text-lg">Uprising Node</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 px-4 py-4">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <SidebarMenuItem key={index}>
                <Collapsible defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuButton asChild className="hover:bg-gray-50 text-gray-600 hover:text-black">
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon size={16} strokeWidth={1.5} />}
                        <span className="text-sm font-bold tracking-wide">{item.title}</span>
                      </div>
                      <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-300" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-gray-100 ml-4 pl-4 py-1">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} className="text-xs text-gray-500 hover:text-black hover:bg-transparent py-1 block transition-colors">
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
