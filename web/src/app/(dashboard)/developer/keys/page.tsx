"use client";

import { Header } from "@/components/layout";
import { Card, Button, Input } from "@/components/ui";

export default function ApiKeysPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-serif text-black">Gestion des Clés API</h1>
                    <Button>Générer une Nouvelle Clé</Button>
                </div>

                <Card title="Clés Actives">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold">Prod Key 1</h3>
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Active</span>
                                </div>
                                <p className="font-mono text-xs text-gray-500">sk_live_...x8d9</p>
                                <p className="text-xs text-gray-400">Créée le 12 Jan 2026</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Révoquer</Button>
                                <Button variant="outline" size="sm">Rotater</Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100 opacity-60">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold line-through">Dev Key Old</h3>
                                    <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Révoquée</span>
                                </div>
                                <p className="font-mono text-xs text-gray-500">sk_test_...992a</p>
                                <p className="text-xs text-gray-400">Créée le 05 Jan 2025</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}
