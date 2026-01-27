"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { leadsService } from "@/services/api.service";

interface DashboardStats {
    currentBalance: number;
    targetBalance: number;
    activeLeads: number;
    inAudit: number;
    signedDeals: number;
    monthlyGrowth: number;
}

export default function DashboardPage() {
    const [leadUrl, setLeadUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        currentBalance: 0,
        targetBalance: 15000,
        activeLeads: 0,
        inAudit: 0,
        signedDeals: 0,
        monthlyGrowth: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // @ts-expect-error - getStats is newly added
                const data = await leadsService.getStats() as unknown as DashboardStats;
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    const progressPercent = Math.round((stats.currentBalance / stats.targetBalance) * 100);

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadUrl.trim()) return;

        setIsSubmitting(true);
        try {
            await leadsService.create(leadUrl);
            setLeadUrl("");
            alert("Lead déposé avec succès ! Analyse en cours...");
        } catch (error) {
            console.error(error);
            alert("Erreur lors du dépôt du lead.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-20">
                {/* Lead Drop Section */}
                <section className="flex flex-col gap-8 items-center w-full max-w-2xl mx-auto">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight">
                            Dépôt de Lead
                        </h1>
                        <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
                            Système prêt pour saisie
                        </p>
                    </div>

                    {/* Lead Input */}
                    <form
                        onSubmit={handleLeadSubmit}
                        className="w-full relative mt-4 group"
                    >
                        <div className="relative flex w-full items-end">
                            <div className="absolute left-0 bottom-4 text-gray-300 group-hover:text-gray-600 transition-colors duration-300">
                                <span className="material-symbols-outlined font-light text-xl">
                                    link
                                </span>
                            </div>
                            <input
                                type="text"
                                value={leadUrl}
                                onChange={(e) => setLeadUrl(e.target.value)}
                                placeholder="URL Cible / Nom de l'entreprise"
                                className="lindy-input flex-1 bg-transparent border-b border-gray-200 hover:border-gray-300 focus:border-black text-black placeholder:text-gray-300 placeholder:font-light h-14 pl-8 pr-12 focus:ring-0 text-lg font-light transition-all duration-300 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="absolute right-0 bottom-3 text-gray-400 hover:text-black transition-colors duration-300 p-1 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="material-symbols-outlined font-light text-xl animate-spin">
                                        progress_activity
                                    </span>
                                ) : (
                                    <span className="material-symbols-outlined font-light text-xl">
                                        arrow_forward
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Stats Section */}
                <section className="w-full pt-10 border-t border-gray-50 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
                    {/* Quick Access */}
                    <div className="md:col-span-3 flex flex-col justify-center items-start border-r border-gray-50 pr-8">
                        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                            Accès Rapide
                        </h3>
                        <a href="https://the-war-room-tawny.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full">
                            {/* Removed border as requested */}
                            <button className="w-full py-3 px-4 hover:border-black text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-all duration-300 flex items-center justify-between group bg-white">
                                <span>Salle de Guerre</span>
                                <span className="material-symbols-outlined text-sm text-gray-300 group-hover:text-black transition-colors">
                                    security
                                </span>
                            </button>
                        </a>
                    </div>

                    {/* Commission Tracker */}
                    <div className="md:col-span-9 space-y-5">
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                Suivi des Commissions
                            </h3>
                            <div className="text-right flex items-baseline gap-2">
                                <span className="text-2xl font-serif text-black font-normal">
                                    {stats.currentBalance.toLocaleString("fr-FR")} $
                                </span>
                                <span className="text-xs font-light text-gray-400">
                                    / {stats.targetBalance.toLocaleString("fr-FR")} $
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-px bg-gray-100 mt-2">
                            <div
                                className="absolute left-0 top-0 h-px bg-black transition-all duration-1000 ease-out w-(--progress)"
                                style={{ "--progress": `${progressPercent}%` } as React.CSSProperties}
                            />
                            <div
                                className="absolute top-0 -mt-[3px] h-1.5 w-1.5 rounded-full bg-black left-(--progress)"
                                style={{ "--progress": `${progressPercent}%` } as React.CSSProperties}
                            />
                        </div>
                    </div>
                </section>

                {/* Quick Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 border border-gray-100 hover:border-black transition-colors cursor-pointer">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Leads Actifs
                        </p>
                        <p className="text-3xl font-serif text-black">{stats.activeLeads}</p>
                    </div>
                    <div className="p-6 border border-gray-100 hover:border-black transition-colors cursor-pointer">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            En Audit
                        </p>
                        <p className="text-3xl font-serif text-black">{stats.inAudit}</p>
                    </div>
                    <div className="p-6 border border-gray-100 hover:border-black transition-colors cursor-pointer">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Deals Signés
                        </p>
                        <p className="text-3xl font-serif text-black">{stats.signedDeals}</p>
                    </div>
                    <div className="p-6 border border-gray-100 hover:border-black transition-colors cursor-pointer">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Ce Mois
                        </p>
                        <p className="text-3xl font-serif text-black">+{stats.monthlyGrowth}%</p>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="flex flex-wrap gap-4">
                    <Link href="/profile">
                        {/* Removed border variant to match "erase containers" request */}
                        <Button variant="ghost" size="default" className="border-0 hover:bg-gray-50">
                            <span className="material-symbols-outlined text-sm">
                                account_balance_wallet
                            </span>
                            <span>Profil & Paiements</span>
                        </Button>
                    </Link>
                    <Link href="/transfer">
                        <Button variant="ghost" size="default" className="border-0 hover:bg-gray-50">
                            <span className="material-symbols-outlined text-sm">
                                send
                            </span>
                            <span>Demander un Virement</span>
                        </Button>
                    </Link>
                    <Link href="/resources">
                        <Button variant="ghost" size="default" className="border-0 hover:bg-gray-50">
                            <span className="material-symbols-outlined text-sm">
                                folder_open
                            </span>
                            <span>Ressources</span>
                        </Button>
                    </Link>
                </section>
            </main >
        </div >
    );
}
