"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CompletePage() {
    const router = useRouter();

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-5xl mx-auto">
                    <Link href="/" className="flex items-center gap-4 text-black decoration-0 cursor-pointer">
                        <div className="text-black opacity-80">
                            <span className="material-symbols-outlined text-2xl font-light">hub</span>
                        </div>
                        <h2 className="text-base font-medium tracking-wide font-serif text-black italic">Uprising Node</h2>
                    </Link>
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
                            <div className="bg-center bg-no-repeat bg-cover grayscale opacity-90 size-8 rounded-full border border-gray-100 ring-2 ring-white" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMflAqpGYir9XOgJftZNEspNP4YhL4rOPhdqw0jK_aScxv1hEB3L_lzTmM9Yhh7p9Bx-zR8FPI8BGHUHUllrAJDb-KhtUBsqU-ow4gz1n2Xk6fA8mW9g47-WRYmuNS0QAW_9o-jagO5g5z8bKdLzEnz2LlxLpmlbixX3D_b0WsSTorkGrwc3J7RGALpmKOBVUrUK7iA48qG0b4tWxQnQOXK_S9JVfjK6tVa4xwe4PR4q82uVCiUq2Ob5fW4_0YZ9Smp0LT32pSxHGh")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center gap-16 min-h-[70vh]">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif font-normal text-black tracking-tight leading-[1.1]">
                        Prêt à Dominer<br />le Marché ?
                    </h1>
                    <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
                        Configuration Terminée
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-6">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="h-5 w-5 border border-black bg-black flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-sm text-white font-bold">check</span>
                            </div>
                            <span className="text-lg font-serif text-black group-hover:text-gray-600 transition-colors">Profil complété</span>
                        </div>
                        <div className="w-full h-px bg-gray-50"></div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="h-5 w-5 border border-black bg-black flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-sm text-white font-bold">check</span>
                            </div>
                            <span className="text-lg font-serif text-black group-hover:text-gray-600 transition-colors">Notifications activées</span>
                        </div>
                        <div className="w-full h-px bg-gray-50"></div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="h-5 w-5 border border-black bg-black flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-sm text-white font-bold">check</span>
                            </div>
                            <span className="text-lg font-serif text-black group-hover:text-gray-600 transition-colors">Accès sécurisé</span>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <Link href="/dashboard" className="w-full">
                        <button className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group border border-transparent hover:border-black/10">
                            <span>Accéder à mon Node</span>
                            <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                        </button>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-gray-400 opacity-60">
                        <span className="material-symbols-outlined text-sm font-light">verified_user</span>
                        <p className="text-[9px] uppercase tracking-widest">Environnement chiffré de bout en bout</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
