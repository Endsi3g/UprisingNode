"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";

export default function TransferPage() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const availableBalance = 12450;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setIsSubmitting(true);

        // TODO: Submit to API
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased">
                <Header userName="K. Miller" userRole="Opérateur" />
                <main className="flex-1 w-full max-w-md mx-auto px-6 py-24 flex flex-col items-center justify-center gap-8 text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-serif font-normal text-black">
                            Demande Envoyée
                        </h1>
                        <p className="text-gray-400 text-sm font-light">
                            Votre demande de virement de{" "}
                            <span className="text-black font-medium">
                                {parseFloat(amount).toLocaleString("fr-FR")} $
                            </span>{" "}
                            est en cours de traitement.
                        </p>
                    </div>
                    <div className="pt-8 space-y-3">
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                            Délai estimé : 24-48h ouvrées
                        </p>
                        <Link href="/profile">
                            <Button variant="outline">
                                <span>Voir l&apos;historique</span>
                                <span className="material-symbols-outlined text-sm">
                                    east
                                </span>
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 w-full max-w-lg mx-auto px-6 py-16 md:py-24 flex flex-col gap-12">
                {/* Back Link */}
                <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group w-fit"
                >
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                        arrow_back
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-medium">
                        Retour
                    </span>
                </Link>

                {/* Header */}
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-tight">
                        Demande de Virement
                    </h1>
                    <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.2em]">
                        Retrait vers votre compte bancaire
                    </p>
                </div>

                {/* Available Balance */}
                <div className="p-6 border border-gray-100 bg-gray-50/50">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Solde Disponible
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif text-black tracking-tight">
                            {availableBalance.toLocaleString("fr-FR")}
                        </span>
                        <span className="text-lg text-gray-400 font-light">$</span>
                    </div>
                </div>

                {/* Transfer Form */}
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Amount Input */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Montant à retirer
                        </label>
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl text-gray-300">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="100"
                                max={availableBalance}
                                step="0.01"
                                required
                                className="flex-1 bg-transparent border-0 border-b border-gray-200 hover:border-gray-300 focus:border-black p-0 py-3 text-4xl font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Minimum : 100 $ • Maximum : {availableBalance.toLocaleString("fr-FR")} $
                        </p>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex gap-3">
                        {[1000, 2500, 5000].map((quickAmount) => (
                            <button
                                key={quickAmount}
                                type="button"
                                onClick={() => setAmount(quickAmount.toString())}
                                className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-all duration-200 border ${amount === quickAmount.toString()
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                                    }`}
                            >
                                {quickAmount.toLocaleString("fr-FR")} $
                            </button>
                        ))}
                    </div>

                    {/* Bank Info */}
                    <div className="p-4 border border-gray-100 space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-sm">
                                account_balance
                            </span>
                            <span className="text-[10px] uppercase tracking-widest font-medium">
                                Compte Destinataire
                            </span>
                        </div>
                        <p className="text-sm font-serif text-black">
                            Chase Bank •••• 4521
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 space-y-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full group"
                            loading={isSubmitting}
                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                        >
                            <span>Confirmer le Virement</span>
                            <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
                                send
                            </span>
                        </Button>

                        {/* Security Notice */}
                        <div className="flex items-center justify-center gap-2 text-gray-300">
                            <span className="material-symbols-outlined text-sm font-light">
                                verified_user
                            </span>
                            <p className="text-[9px] uppercase tracking-widest">
                                Transaction Sécurisée AES-256
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
