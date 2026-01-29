"use client";

import React from "react";

export default function ReportPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col">
      <div className="mb-12 md:mb-20 space-y-4">
        <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.3em]">
          Livrable Stratégique • Rapport Final
        </p>
        <h1 className="text-4xl md:text-6xl font-serif font-normal text-black tracking-tight max-w-2xl leading-[1.1]">
          Dossier Stratégique Complet
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-8 space-y-12">
          <div className="relative bg-neutral-50 p-8 md:p-16 border border-gray-100">
            <div className="pdf-preview-stack relative aspect-[4/3] flex items-center justify-center perspective-1000">
              <div className="pdf-page absolute w-[55%] aspect-[1/1.41] bg-white translate-x-12 translate-y-6 rotate-3 z-10 flex flex-col p-6 overflow-hidden border border-gray-100 shadow-md">
                <div className="w-1/2 h-2 bg-gray-100 mb-2"></div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-gray-50"></div>
                  <div className="w-full h-1 bg-gray-50"></div>
                  <div className="w-2/3 h-1 bg-gray-50"></div>
                </div>
              </div>
              <div className="pdf-page absolute w-[55%] aspect-[1/1.41] bg-white -translate-x-6 translate-y-2 -rotate-2 z-20 flex flex-col p-6 overflow-hidden border border-gray-100 shadow-md">
                <div className="flex justify-between mb-8">
                  <div className="w-8 h-8 border border-black flex items-center justify-center text-[8px] font-serif italic">
                    UN
                  </div>
                  <div className="w-12 h-1 bg-gray-100"></div>
                </div>
                <div className="h-4 w-3/4 bg-gray-100 mb-4"></div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-gray-50"></div>
                  <div className="w-full h-2 bg-gray-50"></div>
                  <div className="w-full h-2 bg-gray-50"></div>
                  <div className="w-5/6 h-2 bg-gray-50"></div>
                </div>
              </div>
              <div className="pdf-page absolute w-[55%] aspect-[1/1.41] bg-white shadow-2xl z-30 flex flex-col items-center justify-center p-8 text-center border-t-4 border-black">
                <span className="material-symbols-outlined text-3xl font-light mb-6 opacity-30">
                  shield_lock
                </span>
                <h3 className="font-serif text-xl mb-2 italic">
                  Uprising Node
                </h3>
                <div className="w-8 h-px bg-gray-200 mb-6"></div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-black mb-1">
                  Rapport d'Audit &amp; Vente
                </p>
                <p className="text-[8px] text-gray-400 font-mono">
                  ID: 2024-STRAT-092
                </p>
                <div className="mt-auto pt-8">
                  <p className="text-[7px] text-gray-300 uppercase tracking-tighter">
                    Confidentiel • Strictement Privé
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-gray-400">
                  description
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">
                  Rapport d'Audit de Sécurité
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-200 self-center"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-gray-400">
                  history_edu
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">
                  Scripts de Vente Stratégiques
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 sticky top-32 space-y-10">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">
              Contenu du Dossier
            </h4>
            <nav className="space-y-8">
              <div className="group">
                <p className="text-xs font-serif italic text-gray-400 mb-1">
                  Section I
                </p>
                <h5 className="text-lg font-serif text-black group-hover:pl-2 transition-all duration-300">
                  Analyse de Surface
                </h5>
                <p className="text-sm text-gray-400 mt-2 font-light leading-relaxed">
                  Exposition numérique complète et vulnérabilités
                  infrastructurelles identifiées.
                </p>
              </div>
              <div className="group">
                <p className="text-xs font-serif italic text-gray-400 mb-1">
                  Section II
                </p>
                <h5 className="text-lg font-serif text-black group-hover:pl-2 transition-all duration-300">
                  Angles d'Attaque
                </h5>
                <p className="text-sm text-gray-400 mt-2 font-light leading-relaxed">
                  Vecteurs de persuasion psychologique et leviers de négociation
                  spécifiques.
                </p>
              </div>
              <div className="group">
                <p className="text-xs font-serif italic text-gray-400 mb-1">
                  Section III
                </p>
                <h5 className="text-lg font-serif text-black group-hover:pl-2 transition-all duration-300">
                  Scripts de Closing
                </h5>
                <p className="text-sm text-gray-400 mt-2 font-light leading-relaxed">
                  Modèles de dialogue optimisés pour la conversion et la
                  rétention partenaire.
                </p>
              </div>
            </nav>
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
              <span>Format : PDF (A4)</span>
              <span>Poids : 4.2 MB</span>
            </div>
            <button className="w-full bg-black text-white py-6 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-4 group">
              <span>Télécharger le Dossier PDF</span>
              <span className="material-symbols-outlined text-lg font-light group-hover:translate-y-0.5 transition-transform duration-300">
                download
              </span>
            </button>
            <div className="flex items-center justify-center gap-3 py-4 border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-lg text-gray-400 font-light">
                verified_user
              </span>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-none">
                Intégrité des données certifiée
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
