"use client";

import React from "react";

export default function NotificationsPage() {
    return (
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-20">
            <div className="mb-16">
                <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight mb-4">
                    Configuration des Notifications
                </h1>
                <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.25em]">
                    Paramètres de Communication Stratégique
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                <section className="space-y-10">
                    <div className="border-b border-black/5 pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-black">Canaux de Communication</h2>
                    </div>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="text-sm font-serif text-black mb-1">Email Stratégique</p>
                                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">Réception des analyses de marché et rapports de performance directement dans votre boîte mail.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input defaultChecked type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="text-sm font-serif text-black mb-1">Push Mobile</p>
                                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">Notifications instantanées pour les événements nécessitant une action immédiate.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                    </div>
                    <div className="pt-10 space-y-6">
                        <div className="border-b border-black/5 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-black">Fréquence</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input defaultChecked className="h-4 w-4 border-black text-black focus:ring-0" name="frequency" type="radio" />
                                <span className="text-sm font-serif text-black">Instantané</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input className="h-4 w-4 border-black text-black focus:ring-0" name="frequency" type="radio" />
                                <span className="text-sm font-serif text-black">Résumé Quotidien</span>
                            </label>
                        </div>
                    </div>
                </section>
                <section className="space-y-10">
                    <div className="border-b border-black/5 pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-black">Alertes Critiques</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 border border-gray-100 hover:border-black transition-colors duration-300">
                            <input defaultChecked className="h-4 w-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5" id="opt1" type="checkbox" />
                            <label className="cursor-pointer" htmlFor="opt1">
                                <p className="text-sm font-serif text-black">Nouvelle Opportunité de Marché</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Impact élevé • Immédiat</p>
                            </label>
                        </div>
                        <div className="flex items-start gap-4 p-4 border border-gray-100 hover:border-black transition-colors duration-300">
                            <input defaultChecked className="h-4 w-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5" id="opt2" type="checkbox" />
                            <label className="cursor-pointer" htmlFor="opt2">
                                <p className="text-sm font-serif text-black">Rapport de Salle de Guerre prêt</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Analyse hebdomadaire • PDF</p>
                            </label>
                        </div>
                        <div className="flex items-start gap-4 p-4 border border-gray-100 hover:border-black transition-colors duration-300">
                            <input className="h-4 w-4 border-black text-black focus:ring-0 rounded-none cursor-pointer mt-0.5" id="opt3" type="checkbox" />
                            <label className="cursor-pointer" htmlFor="opt3">
                                <p className="text-sm font-serif text-black">Validation de Commission</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Financier • Cycle mensuel</p>
                            </label>
                        </div>
                    </div>
                </section>
            </div>
            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-3 text-gray-400">
                    <span className="material-symbols-outlined text-sm font-light">info</span>
                    <p className="text-[10px] uppercase tracking-[0.2em]">Les changements sont appliqués sous 5 minutes</p>
                </div>
                <button className="w-full md:w-auto bg-black text-white py-5 px-12 text-[10px] font-semibold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-4">
                    <span>Enregistrer les préférences</span>
                    <span className="material-symbols-outlined text-lg font-light">done_all</span>
                </button>
            </div>
        </main>
    );
}
