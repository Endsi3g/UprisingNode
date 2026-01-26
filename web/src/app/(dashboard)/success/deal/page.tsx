"use client";

import { Button } from "@/components/ui";
import Link from "next/link";

export default function DealSuccessPage() {
    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white font-sans p-6 text-center">

            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                <span className="material-symbols-outlined text-8xl text-green-500 relative z-10">verified</span>
            </div>

            <h1 className="text-5xl font-serif mb-4 tracking-tight">Deal Signé.</h1>

            <p className="text-gray-400 max-w-md mx-auto mb-12 text-lg font-light">
                Félicitations. La commission de <span className="text-white font-bold">12,450 €</span> a été validée et créditée sur votre solde en attente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button as="a" href="/dashboard" className="bg-white text-black hover:bg-gray-200 w-full justify-center">
                    Retour au Dashboard
                </Button>
                <Button as="a" href="/transfer" variant="outline" className="border-gray-700 text-white hover:bg-gray-900 w-full justify-center">
                    Demander un Virement
                </Button>
            </div>

            <p className="fixed bottom-8 text-xs text-gray-600 uppercase tracking-widest">
                Transaction ID: #TX-9982-A
            </p>
        </div>
    );
}
