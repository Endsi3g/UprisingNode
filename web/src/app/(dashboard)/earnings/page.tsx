"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/uprising/page-header";
import { DataCard } from "@/components/uprising/data-card";
import { dashboardService } from "@/services/api.service";

interface Commission {
    id: string;
    company: string;
    type: "closing" | "referral" | "bonus";
    amount: number;
    date: string;
    status: "paid" | "pending" | "processing";
}

interface CommissionsData {
    totalEarnings: number;
    pendingEarnings: number;
    thisMonth: number;
    avgPerDeal: number;
    history: Commission[];
}

export default function EarningsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("all");
    const [data, setData] = useState<CommissionsData>({
        totalEarnings: 0,
        pendingEarnings: 0,
        thisMonth: 0,
        avgPerDeal: 0,
        history: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dashboardService.getCommissions() as unknown as CommissionsData;
                setData(response);
            } catch (error) {
                console.error("Failed to fetch commissions", error);
            }
        };
        fetchData();
    }, []);

    const stats = {
        totalEarnings: data.totalEarnings,
        pendingEarnings: data.pendingEarnings,
        thisMonth: data.thisMonth,
        avgPerDeal: data.avgPerDeal,
    };

    const commissions = data.history;

    const getStatusColor = (status: Commission["status"]) => {
        switch (status) {
            case "paid":
                return "text-black";
            case "processing":
                return "text-gray-500";
            case "pending":
                return "text-gray-400";
        }
    };

    const getStatusLabel = (status: Commission["status"]) => {
        switch (status) {
            case "paid":
                return "Payé";
            case "processing":
                return "En cours";
            case "pending":
                return "En attente";
        }
    };

    const getTypeLabel = (type: Commission["type"]) => {
        switch (type) {
            case "closing":
                return "Closing";
            case "referral":
                return "Parrainage";
            case "bonus":
                return "Bonus";
        }
    };

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto px-12 py-16 space-y-16">
            {/* Header */}
            <header className="flex justify-between items-end">
                <PageHeader
                    title="Commissions"
                    subtitle="Historique et suivi de vos gains"
                />
                <Link
                    href="/transfer"
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm font-light">
                        send
                    </span>
                    Demander un virement
                </Link>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8 border-y border-gray-100 py-8">
                <DataCard
                    label="Total Gagné"
                    value={`${stats.totalEarnings.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $`}
                />
                <div className="space-y-1 border-l border-gray-100 pl-8">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                        En Attente
                    </p>
                    <p className="text-3xl font-serif text-black">
                        {stats.pendingEarnings.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
                    </p>
                </div>
                <div className="space-y-1 border-l border-gray-100 pl-8">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                        Ce Mois
                    </p>
                    <p className="text-3xl font-serif text-black">
                        {stats.thisMonth.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
                    </p>
                </div>
                <div className="space-y-1 border-l border-gray-100 pl-8">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                        Moyenne / Deal
                    </p>
                    <p className="text-3xl font-serif text-black">
                        {stats.avgPerDeal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
                    </p>
                </div>
            </section>

            {/* Commission History */}
            <section className="space-y-8">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Historique des Commissions
                    </h3>
                    <div className="flex gap-4">
                        {["all", "paid", "pending"].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`text-[10px] uppercase tracking-widest px-3 py-1 transition-all ${selectedPeriod === period
                                    ? "bg-black text-white"
                                    : "text-gray-400 hover:text-black"
                                    }`}
                            >
                                {period === "all" ? "Tout" : period === "paid" ? "Payé" : "En attente"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Commission List */}
                <div className="divide-y divide-gray-50">
                    {commissions
                        .filter((c) => selectedPeriod === "all" || c.status === selectedPeriod)
                        .map((commission) => (
                            <div
                                key={commission.id}
                                className="flex items-center justify-between py-6 group hover:bg-gray-50/50 -mx-4 px-4 transition-colors"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <span className="material-symbols-outlined text-gray-400 font-light">
                                            {commission.type === "closing" ? "handshake" :
                                                commission.type === "referral" ? "group_add" : "emoji_events"}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-serif text-black">
                                            {commission.company}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] uppercase tracking-widest text-gray-400">
                                                {getTypeLabel(commission.type)}
                                            </span>
                                            <span className="text-gray-200">•</span>
                                            <span className="text-[9px] uppercase tracking-widest text-gray-400">
                                                {new Date(commission.date).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className={`text-[9px] uppercase tracking-widest ${getStatusColor(commission.status)}`}>
                                        {getStatusLabel(commission.status)}
                                    </span>
                                    <p className="text-xl font-serif text-black min-w-[100px] text-right">
                                        +{commission.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                <Link
                    href="/earnings/simulate"
                    className="flex items-center gap-4 p-6 border border-gray-100 hover:border-black transition-colors group"
                >
                    <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined font-light">
                            calculate
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-sm font-serif font-medium">Simulateur de Gains</h5>
                        <p className="text-[10px] text-gray-400 font-light">
                            Estimez vos revenus potentiels
                        </p>
                    </div>
                </Link>
                <Link
                    href="/profile"
                    className="flex items-center gap-4 p-6 border border-gray-100 hover:border-black transition-colors group"
                >
                    <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined font-light">
                            account_balance
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-sm font-serif font-medium">Informations Bancaires</h5>
                        <p className="text-[10px] text-gray-400 font-light">
                            Gérez vos coordonnées de paiement
                        </p>
                    </div>
                </Link>
            </section>
        </div>
    );
}
