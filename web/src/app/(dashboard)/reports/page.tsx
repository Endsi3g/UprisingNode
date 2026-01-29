"use client";

import React from "react";
import { Header } from "@/components/layout";
import { ActionButton } from "@/components/uprising";
import {
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react";

const HISTORY = [
  {
    id: 1,
    date: "20 - 26 Janvier 2024",
    revenue: 4500,
    highlight: "Meilleure semaine Q1",
  },
  {
    id: 2,
    date: "13 - 19 Janvier 2024",
    revenue: 2800,
    highlight: "3 nouveaux clients",
  },
  { id: 3, date: "06 - 12 Janvier 2024", revenue: 3100, highlight: "" },
];

export default function ReportsPage() {
  return (
    <main className="flex flex-col h-full bg-white font-sans text-text-main pb-20">
      <Header
        title="Rapports Hebdomadaires"
        subtitle="Analyse détaillée de vos performances et revenus"
      />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        {/* Current Week Summary */}
        <section className="bg-gray-50 p-8 border border-black/5">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs uppercase tracking-widest mb-3">
                <Calendar className="w-3 h-3" />
                <span>Semaine en cours</span>
              </div>
              <h2 className="text-3xl font-serif">Aperçu Performance</h2>
            </div>
            <ActionButton>
              <Download className="w-4 h-4 mr-2 inline" /> Télécharger PDF
            </ActionButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Revenus Générés
              </span>
              <p className="text-4xl font-serif font-bold">1 450 €</p>
              <span className="text-xs text-emerald-600 font-medium">
                +12% vs semaine dernière
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Commissions en attente
              </span>
              <p className="text-4xl font-serif font-bold">850 €</p>
              <span className="text-xs text-gray-400">2 deals en closing</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Taux de Conversion
              </span>
              <p className="text-4xl font-serif font-bold">24%</p>
              <span className="text-xs text-emerald-600 font-medium">
                +2.5 pts
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 h-fit rounded-full">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Top Performance</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Vos emails de relance on un taux d&apos;ouverture de 65% cette
                  semaine. C&apos;est 15% de plus que la moyenne des
                  partenaires.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 h-fit rounded-full">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">
                  Opportunité Manquée
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Le lead &quot;Tech Solutions SA&quot; n&apos;a pas été
                  contacté depuis plus de 7 jours. Risque de churn estimé à 40%.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-black/5 w-full"></div>

        {/* History */}
        <section>
          <h3 className="text-xl font-serif italic mb-6">
            Historique des Rapports
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {HISTORY.map((report) => (
              <div
                key={report.id}
                className="group flex items-center justify-between p-6 border border-black/10 hover:border-black/30 transition-all bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 text-gray-500 rounded-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Rapport Hebdomadaire</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                      {report.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:gap-16">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Revenus
                    </p>
                    <p className="font-mono font-medium">{report.revenue} €</p>
                  </div>
                  {report.highlight && (
                    <span className="hidden md:inline-flex px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-widest rounded-full">
                      {report.highlight}
                    </span>
                  )}
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
