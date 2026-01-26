"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api.service";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.login(email, password);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Échec de la connexion. Vérifiez vos identifiants à défaut (test@example.com / password123)");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            {/* Header */}
            <header className="w-full bg-white/90 backdrop-blur-sm fixed top-0 z-40">
                <div className="px-6 md:px-12 py-8 flex items-center justify-center md:justify-start max-w-5xl mx-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-4 text-black cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div className="text-black opacity-80">
                            <span className="material-symbols-outlined text-2xl font-light">
                                hub
                            </span>
                        </div>
                        <h2 className="text-base font-medium tracking-wide font-serif text-black italic">
                            Uprising Node
                        </h2>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center py-24 md:py-32">
                {/* Title Section */}
                <div className="text-center space-y-6 mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight">
                        Connexion au Node
                    </h1>
                    <div className="w-16 h-px bg-black/10 mx-auto" />
                    <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.25em]">
                        Portail Partenaire B2B
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Email Field */}
                    <div className="space-y-2 group">
                        <label
                            htmlFor="email"
                            className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-3 text-lg font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between items-end">
                            <label
                                htmlFor="password"
                                className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                            >
                                Mot de passe
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-3 text-lg font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
                        />
                        <div className="flex justify-end pt-1">
                            <Link
                                href="#"
                                className="text-[10px] text-gray-400 hover:text-black transition-colors font-medium tracking-wide"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 space-y-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group disabled:opacity-70"
                        >
                            <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
                            {!isLoading && (
                                <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
                                    arrow_forward
                                </span>
                            )}
                        </button>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 text-gray-300">
                            <span className="material-symbols-outlined text-sm font-light">
                                lock
                            </span>
                            <p className="text-[9px] uppercase tracking-widest">
                                Sécurisé SSL
                            </p>
                        </div>
                    </div>
                </form>

                {/* Signup Link */}
                <div className="mt-16 pt-8 border-t border-gray-50 text-center">
                    <Link href="/onboarding/architecture" className="inline-flex flex-col items-center gap-2 group">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">
                            Pas encore membre ?
                        </span>
                        <span className="text-sm font-serif text-black border-b border-gray-200 group-hover:border-black pb-0.5 transition-all">
                            Devenir Partenaire
                        </span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none hidden md:block">
                <p className="text-[9px] text-gray-200 uppercase tracking-widest">
                    Uprising Node System v2.4
                </p>
            </footer>
        </div>
    );
}
