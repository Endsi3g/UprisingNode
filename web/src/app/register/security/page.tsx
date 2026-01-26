"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
    const router = useRouter();

    const handleFinalize = () => {
        router.push("/register/complete");
    };

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
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Inscription Partenaire</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
                <div className="text-center space-y-4">
                    <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mb-2">
                        Étape 2 sur 2
                    </p>
                    <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight">
                        Sécurisez votre Node
                    </h1>
                    <p className="text-gray-500 font-sans text-xs font-light max-w-md mx-auto pt-2">
                        Veuillez définir un mot de passe robuste pour protéger l'accès à votre espace partenaire et valider les accords juridiques.
                    </p>
                </div>

                <div className="w-full space-y-12 mt-4">
                    <div className="space-y-8">
                        <div className="group">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors mb-2">
                                Définir un mot de passe
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-black p-0 pb-3 text-xl font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
                                    placeholder="••••••••••••"
                                />
                                <span className="material-symbols-outlined absolute right-0 text-gray-300 font-light text-lg">lock</span>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-black p-0 pb-3 text-xl font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
                                    placeholder="••••••••••••"
                                />
                                <span className="material-symbols-outlined absolute right-0 text-gray-300 font-light text-lg">lock_reset</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-4 group cursor-pointer">
                            <div className="relative flex items-center pt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 rounded-sm border-gray-300 text-black focus:ring-black cursor-pointer transition-all"
                                />
                            </div>
                            <div className="text-sm font-light text-gray-600 leading-relaxed select-none group-hover:text-black transition-colors">
                                J'accepte les <span className="underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-all">conditions de confidentialité</span> et les <span className="underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-all">accords de partenariat</span> liés à l'exploitation du Node.
                            </div>
                        </label>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-50">
                        <button
                            onClick={handleFinalize}
                            className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
                        >
                            <span>Finaliser l'inscription</span>
                            <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                        </button>
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-sm font-light">verified_user</span>
                            <p className="text-[9px] uppercase tracking-widest">Données chiffrées • Conformité RGPD</p>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                input[type="checkbox"]:checked {
                    background-color: black;
                    border-color: black;
                    color: white;
                    background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxFNI9oVdoT1BvZp5Ux1aU5ueXjBXew29X8PKD14sF7scXIIM6l8OYC0DXIFz9J8RHtuuyWhUf-7anHEmHFg_lC82PiKzAIdonaSjS3iIg8FZ7w-mbEe3Hg7ofheSi4mbbOAmJT1IBcXQWXPXJurGt2edZ6-4ekBa3DhvBxVNJGUb6l6r2X7yHd2Lecdsb66BsyQyM9FHL26gAYeuLHwXbmEGsDt4bsGnOtVGYboIg4C-JbGA6t9ABOrMy2Cdg_J7TcEk5gNaE5NmQ")
                }
                input[type="checkbox"]:focus {
                    box-shadow: 0 0 0 2px #f3f4f6, 0 0 0 4px black;
                    outline: 2px solid transparent;
                    outline-offset: 2px
                }
            `}</style>
        </div>
    );
}
