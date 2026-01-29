"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { resourcesService } from "@/services/api.service";

type ResourceCategory =
  | "all"
  | "scripts"
  | "strategies"
  | "marketing"
  | "legal";

interface Resource {
  id: number;
  title: string;
  category: ResourceCategory;
  type: string;
  size: string;
  updated: string;
  description: string;
}

const categories = [
  { id: "all" as const, label: "Tous", icon: "apps" },
  { id: "scripts" as const, label: "Scripts", icon: "description" },
  { id: "strategies" as const, label: "Stratégies", icon: "psychology" },
  { id: "marketing" as const, label: "Marketing", icon: "campaign" },
  { id: "legal" as const, label: "Légal", icon: "gavel" },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await resourcesService.getAll();
        // Map API data to UI structure if needed, or assume DTO matches
        // For now assuming API returns compatible structure but mapping just in case
        const mappedData = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category as ResourceCategory,
          type: r.type,
          size: r.size || "Unknown",
          updated: new Date(r.updatedAt).toLocaleDateString("fr-FR", {
            relativeTimeFormat: "auto",
          } as any), // Simple formatted date
          description: r.description,
        }));
        setResources(mappedData);
      } catch (error) {
        console.error("Failed to load resources", error);
        // toast.error("Erreur lors du chargement des ressources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      activeCategory === "all" || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-12">
        {/* Page Header */}
        <section className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-tight">
            Ressources & Assets
          </h1>
          <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
            Bibliothèque de Supports
          </p>
        </section>

        {/* Search & Filter */}
        <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 material-symbols-outlined text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-200 focus:border-black text-sm placeholder:text-gray-300 focus:ring-0 outline-none transition-all duration-300"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-black text-white"
                    : "text-gray-400 hover:text-black hover:bg-gray-50"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Resources Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="p-6 border border-gray-100 hover:border-black transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold bg-gray-100 text-gray-600">
                      {resource.type}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {resource.size}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-serif text-black group-hover:underline underline-offset-4 truncate">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 font-light line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Updated */}
                  <p className="text-[10px] text-gray-300 uppercase tracking-wider">
                    {resource.updated}
                  </p>
                </div>

                {/* Download Icon */}
                <button className="p-2 text-gray-300 hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    download
                  </span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-gray-200 mb-4">
              folder_off
            </span>
            <p className="text-sm text-gray-400">
              Aucun document trouvé pour cette recherche.
            </p>
          </div>
        )}

        {/* Upload Button */}
        <section className="pt-8 border-t border-gray-50">
          <Link href="#">
            <button className="flex items-center gap-3 text-gray-400 hover:text-black transition-colors group">
              <span className="material-symbols-outlined text-lg">
                cloud_upload
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest">
                Proposer un document
              </span>
              <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                arrow_forward
              </span>
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
