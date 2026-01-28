"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout";
import { toast } from "sonner";
import { Copy, Mail, ArrowRight, Star } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TEMPLATES = [
    {
        id: "cold-1",
        category: "cold",
        title: "Approche Directe (CEO)",
        subject: "Question stratégique pour [Entreprise]",
        body: "Bonjour [Prénom],\n\nJ'ai vu que [Entreprise] était en pleine croissance sur le marché [Secteur].\n\nNous aidons les entreprises comme la vôtre à optimiser leur infrastructure Node pour réduire les coûts de 30%.\n\nAuriez-vous 10 minutes pour un échange rapide ?",
        tag: "Top Performer"
    },
    {
        id: "cold-2",
        category: "cold",
        title: "Approche CTO / Tech Lead",
        subject: "Optimisation de votre infra blockchain",
        body: "Bonjour [Prénom],\n\nEn tant que CTO, vous savez que la latence est critique.\n\nUprising Node propose une infrastructure dédiée qui garantit 99.99% d'uptime.\n\nDiscutons de vos enjeux actuels ?",
        tag: ""
    },
    {
        id: "follow-1",
        category: "follow",
        title: "Relance J+3",
        subject: "Re: Question stratégique",
        body: "Bonjour [Prénom],\n\nJe me permets de faire remonter ce message. Avez-vous eu le temps d'y jeter un œil ?\n\nBien à vous,",
        tag: ""
    },
    {
        id: "close-1",
        category: "closing",
        title: "Dernière étape",
        subject: "Contrat Uprising Node - [Entreprise]",
        body: "Bonjour [Prénom],\n\nVoici le contrat finalisé. Dès signature, nous pourrons lancer le déploiement sous 24h.\n\nDans l'attente de votre retour,",
        tag: "Haute Conversion"
    }
];

export default function EmailTemplatesPage() {
    const handleCopy = (text: string, type: 'subject' | 'body') => {
        navigator.clipboard.writeText(text);
        toast.success(`${type === 'subject' ? 'Objet' : 'Corps'} copié dans le presse-papier`);
    };

    return (
        <main className="flex flex-col h-full bg-white font-sans text-text-main pb-20">
            <Header
                title="Templates d'Email"
                subtitle="Scripts de vente optimisés et prêts à l'emploi"
            />

            <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">

                <Tabs defaultValue="cold" className="w-full">
                    <TabsList className="mb-8 bg-gray-100 p-1 rounded-sm w-full md:w-auto flex overflow-x-auto">
                        <TabsTrigger value="cold" className="flex-1 md:flex-none uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Cold Outreach</TabsTrigger>
                        <TabsTrigger value="follow" className="flex-1 md:flex-none uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Relance</TabsTrigger>
                        <TabsTrigger value="closing" className="flex-1 md:flex-none uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Closing</TabsTrigger>
                    </TabsList>

                    {["cold", "follow", "closing"].map((category) => (
                        <TabsContent key={category} value={category} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {TEMPLATES.filter(t => t.category === category).map((template) => (
                                    <div key={template.id} className="border border-black/10 group bg-white hover:border-black/30 transition-all flex flex-col">
                                        <div className="p-6 border-b border-black/5 bg-gray-50/50 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <h3 className="font-serif font-bold text-lg">{template.title}</h3>
                                                </div>
                                                {template.tag && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-widest rounded-sm">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {template.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-400">Objet</span>
                                                    <button
                                                        onClick={() => handleCopy(template.subject, 'subject')}
                                                        className="text-[10px] uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Copy className="w-3 h-3" /> Copier
                                                    </button>
                                                </div>
                                                <p className="text-sm font-medium p-2 bg-gray-50 border border-transparent rounded-sm">{template.subject}</p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-400">Corps</span>
                                                    <button
                                                        onClick={() => handleCopy(template.body, 'body')}
                                                        className="text-[10px] uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Copy className="w-3 h-3" /> Copier
                                                    </button>
                                                </div>
                                                <div className="text-sm text-gray-600 p-3 bg-gray-50 border border-transparent rounded-sm whitespace-pre-wrap font-mono text-xs leading-relaxed">
                                                    {template.body}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-black/5 flex justify-end">
                                            <button className="text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                                Voir les détails <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

            </div>
        </main>
    );
}
