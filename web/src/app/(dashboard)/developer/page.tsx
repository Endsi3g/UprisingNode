"use client";

import Link from "next/link";
import { Header } from "@/components/layout";
import { DataCard, Card, Button } from "@/components/ui";

export default function DeveloperDashboardPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-serif text-black">Hub Développeur</h1>
                    <Button asChild>
                        <Link href="/developer/docs">Documentation API</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DataCard title="Requêtes (24h)" value="1,240" trend="+12%" trendUp={true} />
                    <DataCard title="Latence Moyenne" value="45ms" trend="-2ms" trendUp={true} />
                    <DataCard title="Taux d'Erreur" value="0.02%" trend="Stable" trendUp={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="État du Système">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-medium">API Core</span>
                                </div>
                                <span className="text-green-700 text-xs uppercase font-bold">Opérationnel</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-medium">Real-Time Events</span>
                                </div>
                                <span className="text-green-700 text-xs uppercase font-bold">Opérationnel</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <span className="font-medium">Webhooks (Legacy)</span>
                                </div>
                                <span className="text-yellow-700 text-xs uppercase font-bold">Maintenance</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Derniers Logs">
                        <div className="font-mono text-xs space-y-2 text-gray-600">
                            <div className="flex gap-2">
                                <span className="text-gray-400">10:42:01</span>
                                <span className="text-black font-bold">POST</span>
                                <span>/v1/leads</span>
                                <span className="text-green-600">201 Created</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-gray-400">10:41:55</span>
                                <span className="text-black font-bold">GET</span>
                                <span>/v1/users/me</span>
                                <span className="text-green-600">200 OK</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-gray-400">10:38:12</span>
                                <span className="text-black font-bold">POST</span>
                                <span>/v1/webhooks</span>
                                <span className="text-red-500">400 Bad Request</span>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100 text-center">
                                <Link href="/developer/logs" className="text-black hover:underline">Voir tous les logs</Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}


