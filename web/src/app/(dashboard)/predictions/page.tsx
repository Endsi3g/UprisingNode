"use client";

import React from "react";
import { Header } from "@/components/layout";
import { DataCard, StatusBadge, ActionButton } from "@/components/uprising";
import { toast } from "sonner";
import { TrendingUp, Target, BrainCircuit, Sparkles } from "lucide-react";

export default function PredictionsPage() {
  const handleGenerateReport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Génération de l'analyse en cours...",
      success: "Rapport généré avec succès",
      error: "Erreur lors de la génération",
    });
  };

  return (
    <main className="flex flex-col h-full bg-white font-sans text-text-main pb-20">
      <Header
        title="Prédictions & IA"
        subtitle="Analyse prédictive et recommandations stratégiques"
      />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        {/* Top Section: Analysis Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Forecast */}
          <div className="p-6 rounded-none border border-black/10 flex flex-col justify-between h-48 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Projection M+1
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-4xl font-serif font-bold">15 400 €</span>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge text="succès" variant="success" />
                <span className="text-sm text-gray-600">+12% vs actuel</span>
              </div>
            </div>
          </div>

          {/* Conversion Probability */}
          <div className="p-6 rounded-none border border-black/10 flex flex-col justify-between h-48 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Probabilité Conversion
              </span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-4xl font-serif font-bold">68%</span>
              <p className="text-sm text-gray-600 mt-2">
                Score de qualité des leads élevé
              </p>
            </div>
            {/* Simple progress bar mock */}
            <div className="w-full h-1 bg-gray-200 mt-2">
              <div className="h-full bg-blue-600 w-[68%]"></div>
            </div>
          </div>

          {/* Market Trend */}
          <div className="p-6 rounded-none border border-black/10 flex flex-col justify-between h-48 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Tendance Marché
              </span>
              <BrainCircuit className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold">
                Haussier / Tech
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Demande forte sur le secteur SaaS B2B
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-black/5 w-full"></div>

        {/* Strategic Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-serif italic">
              Recommandations Stratégiques
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCard label="Focus Secteur" value="Ciblez les ESN régionales" />
            <DataCard
              label="Action Prioritaire"
              value="Relancez le Lead #124"
            />
            <div className="p-6 border border-black/10 flex flex-col gap-4">
              <h4 className="font-serif text-lg">
                Suggestion d&apos;Amélioration
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                L&apos;analyse de vos derniers échanges suggère que vous devriez
                insister davantage sur le ROI à court terme lors de vos
                présentations.
                <br />
                <br />
                <span className="font-medium text-black">Conseil :</span>{" "}
                Utilisez le template &quot;ROI Calculator&quot; disponible dans
                les ressources.
              </p>
              <ActionButton>Voir le template</ActionButton>
            </div>
            <div className="p-6 border border-black/10 flex flex-col gap-4 bg-black text-white">
              <h4 className="font-serif text-lg text-white">
                Objectif Hebdomadaire
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Pour atteindre votre prévision de 15k€, vous devez générer 3
                nouveaux leads qualifiés cette semaine.
              </p>
              <div className="mt-auto pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                <span>Progression : 1 / 3</span>
                <span className="uppercase tracking-widest opacity-70">
                  En cours
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-200 text-sm hover:bg-gray-50 transition-colors uppercase tracking-widest">
            Exporter les données
          </button>
          <button
            onClick={handleGenerateReport}
            className="px-6 py-3 bg-black text-white text-sm hover:bg-gray-900 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Générer un nouveau rapport
          </button>
        </div>
      </div>
    </main>
  );
}
