"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/layout";

export default function EarningsSimulatorPage() {
  const [leadsVolume, setLeadsVolume] = useState(142);
  const [dealValue, setDealValue] = useState(4250);

  // Constants
  const COMMISSION_RATE = 0.25;
  const CONVERSION_MULTIPLIER = 3.2; // AI Leverage from description
  const BASE_CONVERSION_RATE = 0.05; // Assumed base rate 5%

  // Calculation
  const estimatedRevenue = Math.round(
    leadsVolume *
      BASE_CONVERSION_RATE *
      CONVERSION_MULTIPLIER *
      dealValue *
      COMMISSION_RATE,
  );

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      {/* Replaced full header with Dashboard Header component for consistency, assuming user logged in */}
      <Header userName="K. Miller" userRole="Partenaire" />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight">
            Simulateur de Gains Node
          </h1>
          <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
            Projection de Revenus Mensuels
          </p>
        </div>
        <div className="w-full space-y-16 pt-8">
          <div className="space-y-6 group">
            <div className="flex justify-between items-end">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Volume de Leads Mensuels
              </label>
              <span className="font-serif text-3xl md:text-4xl text-black">
                {leadsVolume}
              </span>
            </div>
            <div className="relative w-full h-6 flex items-center">
              <input
                className="w-full bg-transparent z-10 slider-thumb"
                max="500"
                min="0"
                type="range"
                value={leadsVolume}
                onChange={(e) => setLeadsVolume(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-300 font-mono uppercase tracking-wider">
              <span>0</span>
              <span>250</span>
              <span>500+</span>
            </div>
          </div>
          <div className="space-y-6 group">
            <div className="flex justify-between items-end">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Valuation Moyenne par Deal
              </label>
              <span className="font-serif text-3xl md:text-4xl text-black">
                {dealValue.toLocaleString("fr-FR")} €
              </span>
            </div>
            <div className="relative w-full h-6 flex items-center">
              <input
                className="w-full bg-transparent z-10 slider-thumb"
                max="20000"
                min="500"
                step="50"
                type="range"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-300 font-mono uppercase tracking-wider">
              <span>500 €</span>
              <span>10 k€</span>
              <span>20 k€</span>
            </div>
          </div>
        </div>
        <div className="border-t border-b border-gray-100 py-12 md:py-16 text-center space-y-6 bg-white relative">
          <div className="absolute inset-0 bg-gray-50/30 -z-10 transform skew-y-1"></div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
            Vos Revenus Estimés
          </p>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-5xl md:text-7xl font-serif text-black tracking-tight">
              {estimatedRevenue.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </h2>
            <span className="text-xl md:text-2xl text-gray-400 font-serif italic font-light">
              / mois
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 pt-4">
          <div className="space-y-3 p-6 border border-gray-50 hover:border-gray-100 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-lg font-light text-gray-400">
                pie_chart
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-black">
                Commission de 25%
              </h3>
            </div>
            <div className="h-px w-8 bg-black mb-4"></div>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Application du modèle de partage de revenus standard sur la
              totalité du volume d'affaires généré par votre Node.
            </p>
          </div>
          <div className="space-y-3 p-6 border border-gray-50 hover:border-gray-100 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-lg font-light text-gray-400">
                auto_awesome
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-black">
                Effet de Levier IA
              </h3>
            </div>
            <div className="h-px w-8 bg-black mb-4"></div>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              L'algorithme de matching optimise la qualification des leads,
              augmentant le taux de conversion moyen de 3.2x par rapport au
              marché.
            </p>
          </div>
        </div>
        <div className="flex justify-center pt-8">
          <Link href="/dashboard">
            <button className="bg-black text-white py-4 px-10 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md group flex items-center gap-4">
              <span>Lancer le Node</span>
              <span className="material-symbols-outlined text-base font-light group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </Link>
        </div>
      </main>
      <style jsx global>{`
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -9.5px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          border: 2px solid #000000;
          transition: transform 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 1px;
          cursor: pointer;
          background: #000000;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
