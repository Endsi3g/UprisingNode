"use client";

import { Header } from "@/components/layout";

interface Prediction {
    id: number;
    company: string;
    industry: string;
    score: number;
    trend: "up" | "down" | "stable";
    outlook: string;
    signals: string[];
    lastUpdated: string;
}

const predictions: Prediction[] = [
    {
        id: 1,
        company: "TechVision Corp",
        industry: "SaaS / B2B",
        score: 94,
        trend: "up",
        outlook: "Très favorable",
        signals: ["Levée de fonds récente", "Expansion équipe", "Recrutement agressif"],
        lastUpdated: "Il y a 2 heures",
    },
    {
        id: 2,
        company: "DataFlow Industries",
        industry: "Data Analytics",
        score: 87,
        trend: "up",
        outlook: "Favorable",
        signals: ["Nouveau contrat entreprise", "Croissance LinkedIn +45%"],
        lastUpdated: "Il y a 6 heures",
    },
    {
        id: 3,
        company: "CloudScale Solutions",
        industry: "Infrastructure",
        score: 72,
        trend: "stable",
        outlook: "Neutre",
        signals: ["Stabilité des effectifs", "Pas de signaux forts"],
        lastUpdated: "Il y a 1 jour",
    },
    {
        id: 4,
        company: "FinanceHub",
        industry: "FinTech",
        score: 81,
        trend: "down",
        outlook: "À surveiller",
        signals: ["Réduction d'effectifs", "Pivot produit en cours"],
        lastUpdated: "Il y a 3 heures",
    },
];

export default function PredictionsPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-12">
                {/* Page Header */}
                <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-tight">
                            Prédictions & Opportunités
                        </h1>
                        <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
                            Intelligence IA • Analyse en temps réel
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-medium uppercase tracking-widest">
                            Modèle actif
                        </span>
                    </div>
                </section>

                {/* Heat Map Overview */}
                <section className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[94, 87, 72, 81, 65, 88, 91, 78, 84, 69, 76, 93].map((score, i) => (
                        <div
                            key={i}
                            className="aspect-square flex items-center justify-center text-xs font-mono transition-all duration-300 cursor-pointer hover:scale-105 bg-(--bg) text-(--text)"
                            style={{
                                "--bg": `rgba(0, 0, 0, ${score / 100 * 0.8})`,
                                "--text": score > 60 ? "white" : "black",
                            } as React.CSSProperties}
                        >
                            {score}
                        </div>
                    ))}
                </section>

                {/* Predictions List */}
                <section className="space-y-6">
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Top Opportunités
                    </h2>

                    <div className="space-y-4">
                        {predictions.map((pred) => (
                            <div
                                key={pred.id}
                                className="p-6 border border-gray-100 hover:border-black transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    {/* Left: Company Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-serif text-black group-hover:underline underline-offset-4">
                                                {pred.company}
                                            </h3>
                                            <span className="text-[9px] uppercase tracking-widest text-gray-400 px-2 py-0.5 bg-gray-50">
                                                {pred.industry}
                                            </span>
                                        </div>

                                        {/* Signals */}
                                        <div className="flex flex-wrap gap-2">
                                            {pred.signals.map((signal, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-gray-500"
                                                >
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    {signal}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-[10px] text-gray-300 uppercase tracking-wider">
                                            {pred.lastUpdated}
                                        </p>
                                    </div>

                                    {/* Right: Score */}
                                    <div className="text-right space-y-2">
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="material-symbols-outlined text-lg">
                                                {pred.trend === "up"
                                                    ? "trending_up"
                                                    : pred.trend === "down"
                                                        ? "trending_down"
                                                        : "trending_flat"}
                                            </span>
                                            <span className="text-4xl font-serif text-black">
                                                {pred.score}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${pred.score >= 85
                                                ? "bg-green-50 text-green-600"
                                                : pred.score >= 70
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-gray-50 text-gray-500"
                                                }`}
                                        >
                                            {pred.outlook}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Insights */}
                <section className="pt-8 border-t border-gray-50 space-y-6">
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Analyse IA du Marché
                    </h2>

                    <div className="p-6 bg-gray-50/50 border border-gray-100">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-lg text-gray-400">
                                psychology
                            </span>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 leading-relaxed font-light">
                                    « Le secteur SaaS B2B montre des signaux de reprise significatifs ce trimestre.
                                    Les entreprises ayant récemment levé des fonds présentent un score de réceptivité
                                    3x supérieur à la moyenne. Focus recommandé sur les segments Data Analytics
                                    et Infrastructure Cloud. »
                                </p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                    Modèle: GPT-4o • Confiance: 89% • Mis à jour il y a 15 min
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
