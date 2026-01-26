"use client";

import { Header } from "@/components/layout";
import { Card, Button } from "@/components/ui";

export default function QuotasPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
                <h1 className="text-3xl font-serif text-black">Quotas & Limites</h1>

                <Card title="Utilisation Actuelle" className="p-8">
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-sm font-medium">Analyses IA Profondes</h3>
                                <span className="text-lg font-bold">12 / 20</span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black w-[60%]" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Renouvellement le 01/02/2026</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-sm font-medium">Exports PDF</h3>
                                <span className="text-lg font-bold">45 / 50</span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[90%]" />
                            </div>
                            <p className="text-xs text-orange-600 mt-1">Attention : Limite proche</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-sm font-medium">Requêtes API</h3>
                                <span className="text-lg font-bold">1,240 / 10,000</span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[12%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <Button size="lg" className="w-full max-w-xs">
                            Demander une Augmentation
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
