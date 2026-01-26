"use client";

import Link from "next/link";

export default function DiscoveryPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <header className="w-full bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-50">
                <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 text-black">
                        <div className="text-black opacity-80">
                            <span className="material-symbols-outlined text-2xl font-light">hub</span>
                        </div>
                        <h2 className="text-base font-medium tracking-wide font-serif text-black italic">Uprising Node</h2>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Connecté</span>
                        </div>
                        <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
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
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col justify-between h-full">
                <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
                    <div className="text-center space-y-6 mb-20 md:mb-28 fade-in-up">
                        <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.3em] font-medium">Découverte</p>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal text-black tracking-tight leading-tight">
                            L'Architecture de<br />
                            <span className="italic">Votre Succès</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 border-t border-gray-100 pt-16 md:pt-20">
                        <div className="flex flex-col items-start space-y-6 group fade-in-up delay-100">
                            <div className="text-black group-hover:scale-105 transition-transform duration-500 origin-left">
                                <span className="material-symbols-outlined text-4xl md:text-5xl font-thin">psychology</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-serif text-black">Intelligence IA</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                                    Nos algorithmes neuronaux analysent en temps réel les fluctuations pour optimiser chaque décision stratégique.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start space-y-6 group fade-in-up delay-200">
                            <div className="text-black group-hover:scale-105 transition-transform duration-500 origin-left">
                                <span className="material-symbols-outlined text-4xl md:text-5xl font-thin">all_inclusive</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-serif text-black">Pipeline Transparent</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                                    Une visibilité cristalline sur l'ensemble de votre chaîne de valeur, éliminant toute zone d'ombre opérationnelle.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start space-y-6 group fade-in-up delay-300">
                            <div className="text-black group-hover:scale-105 transition-transform duration-500 origin-left">
                                <span className="material-symbols-outlined text-4xl md:text-5xl font-thin">trending_up</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-serif text-black">Gains Accélérés</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                                    Un effet de levier technologique conçu pour multiplier exponentiellement votre potentiel de revenus passifs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-5xl mx-auto mt-20 md:mt-32 fade-in-up delay-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="w-full md:max-w-md flex flex-col gap-3">
                            <div className="h-[1px] w-full bg-gray-100 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-black w-2/3 transition-all duration-1000 ease-out"></div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-400 font-medium">
                                <span>Étape 02</span>
                                <span>03</span>
                            </div>
                        </div>
                        <Link href="/onboarding/pipeline">
                            <button className="group relative overflow-hidden bg-black text-white px-10 py-4 md:py-5 min-w-[200px] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-900 shadow-sm hover:shadow-lg">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] relative z-10">Suivant</span>
                                <span className="material-symbols-outlined text-base relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                                    arrow_forward
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
            <style jsx global>{`
        .fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fade-in-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
