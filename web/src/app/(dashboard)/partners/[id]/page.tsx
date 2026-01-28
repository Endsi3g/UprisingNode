"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usersService } from "@/services/api.service";
import { Header } from "@/components/layout";
import { MetricDisplay, StatusBadge } from "@/components/uprising";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PartnerDetails {
    id: string;
    name: string;
    expertise: string;
    tier: "platinum" | "gold" | "silver";
    dealsThisMonth: number;
    totalEarnings: number;
    avatar: string; // URL
    location: string;
    joinDate: string;
    stats: {
        leads: number;
        deals: number;
    };
}

export default function PartnerProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const [partner, setPartner] = useState<PartnerDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartner = async () => {
            if (!id) return;
            try {
                const data = await usersService.getPartnerDetails(id);
                setPartner(data);
            } catch (error) {
                toast.error("Impossible de charger les détails du partenaire");
            } finally {
                setLoading(false);
            }
        };
        fetchPartner();
    }, [id]);

    if (loading) return <div className="p-8 font-sans">Chargement...</div>;
    if (!partner) return <div className="p-8 font-sans">Partenaire introuvable</div>;

    return (
        <main className="flex flex-col h-full bg-white font-sans text-text-main pb-20">
            <Header
                title={partner.name}
                subtitle={`Membre depuis ${format(new Date(partner.joinDate), 'MMMM yyyy', { locale: fr })}`}
            />

            <div className="px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
                {/* Top Section: Avatar & Tier */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-full overflow-hidden border border-black/10 shrink-0">
                        <img
                            src={partner.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${partner.name}`}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <StatusBadge status="actif" />
                            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest border rounded-full ${partner.tier === 'platinum' ? 'bg-black text-white border-black' :
                                    partner.tier === 'gold' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                                        'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                Tier {partner.tier}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif">{partner.location}</h2>
                            <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{partner.expertise}</p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-black/5 w-full"></div>

                {/* Stats Grid */}
                <section>
                    <h3 className="text-xl font-serif italic mb-6">Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricDisplay
                            label="Gains Totaux"
                            value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(partner.totalEarnings)}
                            trend="+12% vs N-1"
                            trendDirection="up"
                        />
                        <MetricDisplay
                            label="Deals Signés"
                            value={partner.stats.deals.toString()}
                        />
                        <MetricDisplay
                            label="Leads Envoyés"
                            value={partner.stats.leads.toString()}
                        />
                    </div>
                </section>

                <div className="h-px bg-black/5 w-full"></div>

                {/* Additional Info / Future History */}
                <section className="opacity-50 pointer-events-none grayscale">
                    <h3 className="text-xl font-serif italic mb-6">Activité Récente (Bientôt disponible)</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium">Nouveau Lead Qualifié</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Il y a {i} jours</p>
                                </div>
                                <span className="text-xs font-mono">+ 500 €</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
