"use client";

import Link from "next/link";

export default function QuotaSuccessPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 transition-all duration-300">
                <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 text-black">
                        <div className="text-black opacity-80">
                            <span className="material-symbols-outlined text-2xl font-light">hub</span>
                        </div>
                        <h2 className="text-base font-medium tracking-wide font-serif text-black italic">Uprising Node</h2>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">En ligne</span>
                        </div>
                        <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-widest mb-0.5">Opérateur</p>
                                <p className="text-sm font-medium leading-none text-black font-serif">K. Miller</p>
                            </div>
                            <div
                                className="bg-center bg-no-repeat bg-cover grayscale opacity-90 size-8 rounded-full border border-gray-100 ring-2 ring-white"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMflAqpGYir9XOgJftZNEspNP4YhL4rOPhdqw0jK_aScxv1hEB3L_lzTmM9Yhh7p9Bx-zR8FPI8BGHUHUllrAJDb-KhtUBsqU-ow4gz1n2Xk6fA8mW9g47-WRYmuNS0QAW_9o-jagO5g5z8bKdLzEnz2LlxLpmlbixX3D_b0WsSTorkGrwc3J7RGALpmKOBVUrUK7iA48qG0b4tWxQnQOXK_S9JVfjK6tVa4xwe4PR4q82uVCiUq2Ob5fW4_0YZ9Smp0LT32pSxHGh")',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] py-12">
                <div className="mb-10 relative group">
                    <div className="absolute inset-0 bg-gray-50 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                    <div className="relative w-20 h-20 border border-black rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-black font-light">check</span>
                    </div>
                </div>
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-tight leading-tight">
                        Quota Augmenté<br />
                        avec Succès
                    </h1>
                    <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.25em]">Mise à jour effectuée</p>
                </div>
                <div className="w-full relative py-10 border-t border-b border-gray-100 flex flex-col gap-8 mb-16">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black"></div>
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Nouvelle Limite</p>
                        <p className="text-3xl font-serif text-black">
                            1 500 000
                            <span className="text-sm font-sans font-light text-gray-400 ml-1 align-middle">Appels/mois</span>
                        </p>
                    </div>
                    <div className="w-12 h-px bg-gray-100 mx-auto"></div>
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Statut</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                            <span className="text-xs font-medium text-black">Actif Immédiatement</span>
                        </div>
                    </div>
                </div>
                <Link href="/developer">
                    <button className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
                        <span className="material-symbols-outlined text-base font-light rotate-180 group-hover:-translate-x-1 transition-transform duration-300">
                            arrow_right_alt
                        </span>
                        <span>Retour à l'Infrastructure</span>
                    </button>
                </Link>
            </main>
        </div>
    );
}
