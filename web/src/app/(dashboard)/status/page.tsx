"use client";

import React from "react";
import { Header } from "@/components/layout";
import { MetricDisplay, StatusBadge } from "@/components/uprising";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { Server, Database, Shield, Activity, CheckCircle, AlertTriangle } from "lucide-react";

const data = [
    { time: '00:00', latency: 45 },
    { time: '04:00', latency: 42 },
    { time: '08:00', latency: 55 },
    { time: '12:00', latency: 85 },
    { time: '16:00', latency: 60 },
    { time: '20:00', latency: 48 },
    { time: '24:00', latency: 45 },
];

const services = [
    { name: 'Authentication API', status: 'operational', icon: Shield },
    { name: 'Database Clusters', status: 'operational', icon: Database },
    { name: 'Lead Processor', status: 'operational', icon: Activity },
    { name: 'Payment Gateway', status: 'degraded', icon: Server },
];

export default function StatusPage() {
    return (
        <main className="flex flex-col h-full bg-white font-sans text-text-main pb-20">
            <Header
                title="État du Système"
                subtitle="Moniteur de performance et disponibilité en temps réel"
            />

            <div className="px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">

                {/* Top Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border border-black/10 flex flex-col justify-between h-40">
                        <span className="text-sm font-medium uppercase tracking-widest text-gray-500">Disponibilité (30j)</span>
                        <div className="flex items-end gap-4">
                            <span className="text-5xl font-serif font-bold text-emerald-600">99.98%</span>
                            <span className="text-sm text-gray-400 mb-2">Objectif: 99.9%</span>
                        </div>
                    </div>

                    <MetricDisplay
                        label="Latence Moyenne"
                        value="45ms"
                        trend="-5ms vs hier"
                        trendDirection="up" // Up is good for performance improvement context usually, or use Neutral styling if preferred. Let's stick to standard components.
                    />

                    <MetricDisplay
                        label="Taux d'Erreur"
                        value="0.02%"
                        trend="Stable"
                        trendDirection="neutral"
                    />
                </section>

                <div className="h-px bg-black/5 w-full"></div>

                {/* Latency Chart */}
                <section className="h-96 w-full border border-black/10 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-serif">Latence API (24h)</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs uppercase tracking-widest text-gray-500">Temps réel</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#999' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#999' }}
                            />
                            <Tooltip
                                contentStyle={{ background: '#000', border: 'none', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="latency"
                                stroke="#000"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorLatency)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </section>

                <div className="h-px bg-black/5 w-full"></div>

                {/* System Services Status */}
                <section>
                    <h3 className="text-xl font-serif italic mb-6">Services Principaux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service) => (
                            <div key={service.name} className="p-4 border border-black/10 flex items-center gap-4">
                                <div className={`p-2 rounded-full ${service.status === 'operational' ? 'bg-emerald-100 text-emerald-600' :
                                        service.status === 'degraded' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    <service.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{service.name}</p>
                                    <p className={`text-[10px] uppercase tracking-widest mt-1 ${service.status === 'operational' ? 'text-emerald-600' :
                                            service.status === 'degraded' ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                        {service.status === 'operational' ? 'Opérationnel' :
                                            service.status === 'degraded' ? 'Dégradé' : 'Panne'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Incident History - Empty State for now */}
                <section className="bg-gray-50 p-6 border border-black/5 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Aucun incident significatif signalé au cours des 30 derniers jours.</p>
                </section>

            </div>
        </main>
    );
}
