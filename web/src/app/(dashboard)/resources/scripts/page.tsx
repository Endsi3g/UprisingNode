"use client";

import React from "react";

export default function SalesScriptsPage() {
    return (
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-medium">Retour aux Angles d'Attaque</p>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight">
                        Scripts de Vente Stratégiques
                    </h1>
                    <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
                        Basé sur l'Angle d'Or : <span className="text-black">Optimisation de l'Infrastructure B2B</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="border border-black px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Télécharger PDF</button>
                </div>
            </div>
            <div className="space-y-24">
                <section className="space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Script d'Approche Directe</h2>
                        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium hover:text-gray-500 transition-colors">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            Copier le script
                        </button>
                    </div>
                    <div className="border-l border-black pl-8 py-2">
                        <p className="font-serif text-lg md:text-xl leading-relaxed text-text-main italic">
                            "Bonjour [Prénom], je vous contacte suite à votre récente expansion sur le marché européen. Nous avons analysé vos structures actuelles et identifié une latence critique dans vos flux transactionnels. Uprising Node permet de réduire ce délai de 40% sans restructuration lourde. Seriez-vous ouvert à une discussion de 10 minutes sur l'impact de cette optimisation sur votre marge nette ?"
                        </p>
                    </div>
                    <div className="flex gap-6 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">timer</span> Durée : 45s</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">target</span> Cible : CTO / Head of Ops</span>
                    </div>
                </section>
                <section className="space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Traitement des Objections</h2>
                        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium hover:text-gray-500 transition-colors">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            Copier le script
                        </button>
                    </div>
                    <div className="space-y-12">
                        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 pt-1">Objection : Coût d'intégration</p>
                            <div className="border-l border-black pl-8 py-2">
                                <p className="font-serif text-lg leading-relaxed text-text-main">
                                    "Je comprends parfaitement. C'est précisément pour cela que nous avons conçu un protocole 'Zero-Friction'. Contrairement aux solutions traditionnelles, nous nous greffons sur votre API existante. Le ROI est généralement atteint dès le 45ème jour d'exploitation."
                                </p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 pt-1">Objection : Solution en place</p>
                            <div className="border-l border-black pl-8 py-2">
                                <p className="font-serif text-lg leading-relaxed text-text-main">
                                    "Excellente nouvelle, cela signifie que vous avez déjà conscience de l'enjeu. Uprising Node ne remplace pas votre système actuel, il en décuple la puissance de calcul sur les segments critiques. C'est un complément tactique, pas une substitution."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Pitch de Closing</h2>
                        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium hover:text-gray-500 transition-colors">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            Copier le script
                        </button>
                    </div>
                    <div className="script-block bg-gray-50/50 -mx-4 px-12 py-10 border-l-2 border-black">
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-black">
                            "Au vu de nos échanges, la question n'est plus de savoir si l'infrastructure doit évoluer, mais quand vous souhaitez capturer les gains d'efficacité. Je vous propose de valider le protocole d'engagement aujourd'hui pour une mise en service sous 72 heures. Sommes-nous d'accord pour avancer sur cette base ?"
                        </p>
                    </div>
                    <div className="pt-4">
                        <div className="flex items-center gap-3 text-gray-400">
                            <span className="material-symbols-outlined text-lg">info</span>
                            <p className="text-[10px] uppercase tracking-widest leading-relaxed">Note tactique : Maintenir un silence de 5 secondes après cette question pour laisser le prospect valider mentalement.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
