"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { leadsService, transactionsService } from "@/services/api.service";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description: string | null;
    createdAt: string;
}

interface DashboardStats {
    currentBalance: number;
    targetBalance: number;
    activeLeads: number;
    inAudit: number;
    signedDeals: number;
    monthlyGrowth: number;
}

export default function EarningsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, transactionsData] = await Promise.all([
                    leadsService.getStats() as Promise<DashboardStats>,
                    transactionsService.getAll()
                ]);
                setStats(statsData);
                setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            } catch (error) {
                console.error("Failed to fetch data", error);
                // Fallback / Mock data if API fails or returns empty (for demo purposes)
                setStats({
                    currentBalance: 12450,
                    targetBalance: 15000,
                    activeLeads: 7,
                    inAudit: 3,
                    signedDeals: 12,
                    monthlyGrowth: 18
                });
                setTransactions([
                    {
                        id: "1",
                        amount: 4500,
                        type: "CREDIT",
                        status: "COMPLETED",
                        description: "Cyberdyne Systems - Clôture",
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: "2",
                        amount: -2800,
                        type: "DEBIT",
                        status: "COMPLETED",
                        description: "Virement Sortant",
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date).toUpperCase();
    };

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).replace('US', '');
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <Header userName="K. Miller" userRole="Partenaire" />

            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-16">

                {/* Status Section */}
                <section className="flex flex-col items-center justify-center text-center gap-2 animate-fade-in">
                    <div className="inline-flex items-center justify-center px-3 py-1 border border-gray-200 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[16px] mr-2 text-black">verified</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">Statut Vérifié</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight mb-2">Partenaire Platine</h1>
                    <p className="text-gray-400 font-sans text-xs font-light max-w-md mx-auto">
                        Accès prioritaire aux leads et taux de commission préférentiel.
                    </p>
                </section>

                {/* Balance Section */}
                <section className="w-full bg-gray-50/50 border border-gray-100 p-8 md:p-12 text-center rounded-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Solde Disponible</p>
                    <div className="flex items-baseline justify-center gap-2 mb-10">
                        <span className="text-6xl md:text-7xl font-serif font-light text-black">
                            {stats ? stats.currentBalance.toLocaleString('fr-FR') : "..."}
                        </span>
                        <span className="text-2xl font-light text-gray-400 align-top mt-2">$</span>
                    </div>
                    <Link href="/transfer">
                        <button className="btn-lindy relative overflow-hidden group bg-black text-white px-8 py-4 min-w-[200px] text-xs font-medium uppercase tracking-[0.15em] hover:bg-gray-900 transition-all duration-300">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Retirer les Fonds
                                <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </span>
                        </button>
                    </Link>
                    <p className="text-[10px] text-gray-400 mt-6 font-light">
                        Dernier virement : 15 Nov 2023 • Traitement sous 24h
                    </p>
                </section>

                {/* Transactions Section */}
                <section className="flex flex-col gap-8">
                    <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-xl font-serif font-normal text-black italic">Historique des Transactions</h3>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">Tout Voir</button>
                    </div>
                    <div className="flex flex-col w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[9px] font-bold uppercase text-gray-300 tracking-[0.15em] border-b border-gray-50">
                            <div className="col-span-3 md:col-span-2">Date</div>
                            <div className="col-span-6 md:col-span-7">Détails du Lead / Référence</div>
                            <div className="col-span-3 md:col-span-3 text-right">Montant</div>
                        </div>

                        {/* Transactions List */}
                        {isLoading ? (
                             <div className="py-8 text-center text-gray-400 text-xs">Chargement...</div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx.id} className="group relative bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors duration-300 cursor-default">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-6 items-center">
                                        <div className="col-span-3 md:col-span-2 text-xs text-gray-500 font-mono">
                                            {formatDate(tx.createdAt)}
                                        </div>
                                        <div className="col-span-6 md:col-span-7 flex flex-col justify-center">
                                            <p className="font-medium text-black text-sm tracking-wide">{tx.description || tx.type}</p>
                                            <p className="text-[10px] text-gray-400 font-light mt-0.5">{tx.type} - {tx.status}</p>
                                        </div>
                                        <div className="col-span-3 md:col-span-3 text-right flex items-center justify-end gap-3">
                                            <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-black' : 'text-gray-500'}`}>
                                                {tx.amount > 0 ? '+' : ''} {formatAmount(tx.amount)}
                                            </span>
                                            <span className="material-symbols-outlined text-gray-200 text-lg group-hover:text-black transition-colors">
                                                {tx.amount > 0 ? 'receipt_long' : 'arrow_outward'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {!isLoading && transactions.length === 0 && (
                             <div className="py-8 text-center text-gray-400 text-xs">Aucune transaction récente.</div>
                        )}
                    </div>

                    <div className="flex justify-center pt-8">
                        <button className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all flex flex-col items-center gap-2 group">
                            <span className="group-hover:translate-y-0.5 transition-transform duration-300">Archives Précédentes</span>
                            <span className="material-symbols-outlined text-base font-light opacity-50">expand_more</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
