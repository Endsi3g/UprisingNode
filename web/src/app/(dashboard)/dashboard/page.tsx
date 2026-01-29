"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/uprising/page-header";
import { DataCard } from "@/components/uprising/data-card";
import { StatusBadge } from "@/components/uprising/status-badge";
import { dashboardService } from "@/services/api.service";

interface DashboardStats {
  accumulatedGains: number;
  potentialGains: number;
  activePipeline: Lead[];
}

interface Lead {
  id: string;
  company: string;
  status: "analysis" | "pending" | "approved";
  submittedAt: string;
  riskScore?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    accumulatedGains: 0,
    potentialGains: 1450,
    activePipeline: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use dashboardService to fetch real data structure
        // For now, mapping the response to match the UI if needed
        // But simplified:
        /* 
                   const data = await dashboardService.getStats();
                   setStats(data);
                */
        // Actually, the API definition I made returns { accumulatedGains, potentialGains, activePipeline }
        // which matches the new DashboardStats interface perfectly.
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-12 py-16 space-y-20">
      {/* Page Header */}
      <header className="flex justify-between items-end">
        <PageHeader
          title="Dashboard"
          subtitle="Bienvenue dans le réseau Uprising"
        />
        <div className="flex items-center gap-12 border-l border-gray-100 pl-12">
          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-widest mb-1">
              Status du Compte
            </p>
            <p className="text-xs font-medium text-black uppercase tracking-wider">
              Actif / Vérifié
            </p>
          </div>
        </div>
      </header>

      {/* Commission Tracking */}
      <section className="space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Suivi des Commissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-gray-100 py-8">
          <DataCard
            label="Gains Accumulés"
            value={`${stats.accumulatedGains.toFixed(2)} $`}
            variant="default"
            className="text-gray-300"
          />
          <div className="space-y-1 border-l border-gray-100 pl-8">
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-black uppercase tracking-widest font-semibold">
                Gains Potentiels
              </p>
              <span className="material-symbols-outlined text-[14px] text-gray-300">
                info
              </span>
            </div>
            <p className="text-4xl font-serif text-black">
              {stats.potentialGains.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              $
            </p>
            <p className="text-[10px] text-gray-400 italic font-light">
              Basé sur les opportunités actives
            </p>
          </div>
        </div>
      </section>

      {/* Active Pipeline */}
      <section className="space-y-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Pipeline Actif ({stats.activePipeline.length})
          </h3>
          <button className="text-[10px] uppercase tracking-widest text-black hover:opacity-60 transition-opacity border-b border-black/20 pb-0.5">
            Voir tout
          </button>
        </div>

        {stats.activePipeline.length > 0 ? (
          stats.activePipeline.map((lead) => (
            <div
              key={lead.id}
              className="group relative bg-white border border-gray-100 hover:border-black transition-colors duration-500 overflow-hidden"
            >
              <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-10">
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                      Entreprise
                    </p>
                    <h4 className="text-2xl font-serif text-black">
                      {lead.company}
                    </h4>
                  </div>
                  <div className="h-10 w-px bg-gray-100"></div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center">
                      État
                    </p>
                    <span className="inline-block px-3 py-1 bg-black text-white text-[9px] font-semibold tracking-widest uppercase">
                      Analyse
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                      Salle de Guerre
                    </p>
                    <button className="flex items-center gap-2 text-gray-300 cursor-not-allowed group-hover:text-gray-400 transition-colors">
                      <span className="material-symbols-outlined text-sm font-light">
                        hourglass_empty
                      </span>
                      <span className="text-[10px] uppercase tracking-widest">
                        Bientôt disponible
                      </span>
                    </button>
                  </div>
                  <button className="size-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined font-light">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50/50 px-8 py-3 flex items-center gap-8 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-gray-400">
                    schedule
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                    Soumis {lead.submittedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-gray-400">
                    shield
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                    Score de risque : {lead.riskScore}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-gray-100 bg-gray-50/30">
            <p className="text-sm text-gray-400">
              Aucun lead actif pour le moment
            </p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10">
        <Link href="/pipeline" className="space-y-4 group cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-500">
            <span className="material-symbols-outlined font-light">add</span>
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-serif font-medium">Nouveau Lead</h5>
            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
              Soumettez une nouvelle opportunité stratégique à notre équipe.
            </p>
          </div>
        </Link>
        <Link href="/resources" className="space-y-4 group cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-500">
            <span className="material-symbols-outlined font-light">
              auto_stories
            </span>
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-serif font-medium">Formation Lindy</h5>
            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
              Consultez nos standards de qualité pour maximiser vos gains.
            </p>
          </div>
        </Link>
        <Link href="/messages" className="space-y-4 group cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-500">
            <span className="material-symbols-outlined font-light">
              chat_bubble_outline
            </span>
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-serif font-medium">
              Assistance Directe
            </h5>
            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
              Contactez votre chargé de compte dédié pour toute question.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
