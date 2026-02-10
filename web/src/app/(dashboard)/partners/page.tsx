"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { usersService } from "@/services/api.service";

interface Partner {
  id: number;
  name: string;
  expertise: string;
  tier: "platinum" | "gold" | "silver";
  dealsThisMonth: number;
  totalEarnings: number;
  avatar: string;
  location: string;
}

const tierColors = {
  platinum: "bg-gray-900 text-white",
  gold: "bg-amber-100 text-amber-700",
  silver: "bg-gray-100 text-gray-600",
};

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPartners, setTotalPartners] = useState(0);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const response = await usersService.getPartners({
          page,
          limit: 10,
          search: debouncedSearch,
        });

        if (response.data && response.meta) {
          setPartners(response.data);
          setTotalPages(response.meta.totalPages);
          setTotalPartners(response.meta.total);
        } else if (Array.isArray(response)) {
          // Fallback
          setPartners(response);
          setTotalPartners(response.length);
        }
      } catch (error) {
        console.error("Failed to fetch partners", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [page, debouncedSearch]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-12">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-tight">
              Répertoire Partenaires
            </h1>
            <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
              Réseau d&apos;Élite • {totalPartners} Membres
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 material-symbols-outlined text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 focus:border-black text-sm placeholder:text-gray-300 focus:ring-0 outline-none transition-all duration-300"
            />
          </div>
        </section>

        {/* Leaderboard Stats */}
        <section className="grid grid-cols-3 gap-4">
          <div className="p-6 border border-gray-100 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Top Performer
            </p>
            <p className="text-lg font-serif text-black">A. Dubois</p>
            <p className="text-[10px] text-gray-400 mt-1">8 deals ce mois</p>
          </div>
          <div className="p-6 border border-gray-100 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Total Réseau
            </p>
            <p className="text-lg font-serif text-black">372 000 $</p>
            <p className="text-[10px] text-gray-400 mt-1">Ce trimestre</p>
          </div>
          <div className="p-6 border border-gray-100 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Croissance
            </p>
            <p className="text-lg font-serif text-green-600">+23%</p>
            <p className="text-[10px] text-gray-400 mt-1">vs Q3 2024</p>
          </div>
        </section>

        {/* Partners List */}
        <section className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400">Chargement...</p>
            </div>
          ) : partners.length > 0 ? (
            partners.map((partner, index) => (
              <div
                key={partner.id}
                className="p-6 border border-gray-100 hover:border-black transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="text-2xl font-serif text-gray-200 w-8 text-center">
                    {(page - 1) * 10 + index + 1}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full bg-gray-100 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all bg-[image:var(--avatar)]"
                    style={
                      {
                        "--avatar": `url(${partner.avatar})`,
                      } as React.CSSProperties
                    }
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-serif text-black group-hover:underline underline-offset-4">
                        {partner.name}
                      </h3>
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                          tierColors[partner.tier]
                        }`}
                      >
                        {partner.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-400">
                        {partner.expertise}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {partner.location}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-lg font-serif text-black">
                      {partner.totalEarnings.toLocaleString("fr-FR")} $
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {partner.dealsThisMonth} deals ce mois
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-gray-200 mb-4">
                group_off
              </span>
              <p className="text-sm text-gray-400">Aucun partenaire trouvé.</p>
            </div>
          )}
        </section>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-500">
              Page {page} sur {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
