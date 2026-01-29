"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout";
import { resourcesService } from "@/services/api.service";

export default function ResourceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await resourcesService.getOne(id);
        setResource({
          ...data,
          updated: new Date(data.updatedAt).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          }),
        });
      } catch (error) {
        console.error("Failed to load resource", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
        <Header userName="K. Miller" userRole="Opérateur" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </main>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
        <Header userName="K. Miller" userRole="Opérateur" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">Document introuvable.</p>
          <Link
            href="/resources"
            className="text-[10px] uppercase tracking-widest underline"
          >
            Retour aux ressources
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-12">
        {/* Back Link */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors group self-start"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="text-[10px] uppercase tracking-widest">Retour</span>
        </Link>

        {/* Content */}
        <article className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2 py-1 text-[9px] uppercase tracking-widest font-semibold bg-gray-100 text-gray-600">
                  {resource.type}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {resource.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight leading-tight">
                {resource.title}
              </h1>
              <p className="text-sm text-gray-400 font-light">
                Dernière mise à jour : {resource.updated}
              </p>
            </header>

            <div className="prose prose-sm prose-gray max-w-none font-light">
              <h3 className="text-lg font-serif font-normal text-black mb-4">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {resource.description}
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-8">
            <div className="p-6 border border-gray-100 bg-gray-50/50 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Fichier
                </p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400">
                    description
                  </span>
                  <span className="text-sm font-medium">{resource.size}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Télécharger
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
