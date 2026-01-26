"use client";

import React from "react";
import { useLayout } from "@/context/layout-context";

export default function SettingsPage() {
    const { viewMode, toggleViewMode } = useLayout();

    return (
        <main className="max-w-3xl mx-auto px-6 pt-8 pb-24">
            <header className="mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight mb-4">
                    Paramètres Système
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Configuration du Portail Partenaire</p>
            </header>

            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Apparence</h2>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Mode de Navigation</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">
                                {viewMode === "sidebar" ? "Barre latérale classique" : "Dock flottant (Expérimental)"}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={viewMode === "dock"}
                                onChange={toggleViewMode}
                            />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>

            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Sécurité</h2>
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Mot de passe</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Dernière modification il y a 3 mois</p>
                        </div>
                        <button className="text-[10px] font-semibold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-all">
                            Modifier
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Authentification à deux facteurs (2FA)</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Sécurité renforcée de votre compte</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>
            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Notifications</h2>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Rapports d'activité par email</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Résumé hebdomadaire des transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Notifications Push</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Alertes système en temps réel</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>
            <section className="mb-24">
                <h2 className="text-xl font-serif italic mb-8">Préférences de Paiement</h2>
                <div className="bg-gray-50 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Détails Bancaires (IBAN)</label>
                            <p className="text-sm font-serif tracking-wide border-b border-gray-200 pb-2">FR76 1234 5678 9012 3456 7890 123</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Code BIC / SWIFT</label>
                            <p className="text-sm font-serif tracking-wide border-b border-gray-200 pb-2">UPRI FR 2X XXX</p>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm font-light">verified_user</span>
                        <p className="text-[9px] uppercase tracking-widest">Coordonnées vérifiées par le Node</p>
                    </div>
                </div>
            </section>
            <div className="flex flex-col items-center gap-8">
                <button className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-3">
                    <span>Sauvegarder les modifications</span>
                </button>
                <button className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                    Réinitialiser par défaut
                </button>
            </div>
        </main>
    );
}
