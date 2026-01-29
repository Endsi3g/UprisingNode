"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout";
import { Button, Card, DataCard } from "@/components/ui";
import { leadsService } from "@/services/api.service";
import { toast } from "sonner";

export default function WarRoomPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const found = await leadsService.getOne(leadId);
        if (found) {
          setLead(found);
        } else {
          // Mock fallback if not found in dev
          if (process.env.NODE_ENV === "development") {
            setLead({
              id: leadId,
              companyName: "DataFlow Industries (Mock)",
              status: "AUDIT",
              score: 92,
              url: "https://example.com",
            });
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Erreur chargement lead");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId]);

  if (loading) return <div className="p-10">Chargement...</div>;
  if (!lead) return <div className="p-10">Lead non trouvé</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-black text-white text-[10px] px-2 py-0.5 uppercase tracking-widest">
                {lead.status}
              </span>
              <span className="text-gray-400 text-sm font-mono">
                #{leadId.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-4xl font-serif text-black">
              {lead.companyName || lead.url}
            </h1>
            <p className="text-gray-500 mt-2 font-light max-w-2xl">
              Leader européen de la gestion de données B2B. Cible haute valeur
              avec besoins d&apos;automatisation critiques.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <span className="material-symbols-outlined mr-2 text-lg">
                description
              </span>
              Rapport PDF
            </Button>
            <Button variant="outline">
              <span className="material-symbols-outlined mr-2 text-lg">
                call
              </span>
              Scripts
            </Button>
            <Button>
              <span className="material-symbols-outlined mr-2 text-lg">
                rocket_launch
              </span>
              Lancer le Pitch
            </Button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DataCard
            title="Score IA"
            value={`${lead.score || 0}/100`}
            trend="+14% cette semaine"
            trendUp={true}
          />
          <DataCard
            title="Valeur Est."
            value={`${((lead.score || 0) * 1000).toLocaleString()} €`}
            trend="Commission: 10%"
            trendUp={true}
          />
          <DataCard
            title="Probabilité"
            value="Haute"
            trend="Closing < 30j"
            trendUp={true}
          />
          <DataCard
            title="Concurrents"
            value="3"
            trend="Faible menace"
            trendUp={true}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Strategy & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Analyse Stratégique">
              <div className="prose prose-sm max-w-none font-light text-gray-600 space-y-4">
                <p>
                  <strong className="text-black font-medium">
                    Point de Douleur Principal :
                  </strong>
                  Leur infrastructure actuelle ne supporte pas la montée en
                  charge du Q4. Les coûts serveurs ont augmenté de 200% sans
                  gain de performance.
                </p>
                <p>
                  <strong className="text-black font-medium">
                    Angle d&apos;Attaque :
                  </strong>
                  Approche &quot;Réduction de Coûts &quot; couplée à
                  &quot;Scalabilité Infinie&quot;. Mettre en avant
                  l&apos;architecture distribuée du Node.
                </p>
                <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm mt-4">
                  <h4 className="text-xs uppercase tracking-widest text-black mb-2">
                    Recommandation du Node
                  </h4>
                  <p className="italic">
                    &quot;Approchez le CTO directement via LinkedIn avec le
                    script #4. Mentionnez spécifiquement leurs downtimes de la
                    semaine dernière.&quot;
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Timeline d'Action">
              <div className="space-y-6 relative border-l border-gray-100 ml-3 pl-8 py-2">
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  <p className="text-xs text-gray-400 mb-1">
                    Aujourd&apos;hui, 09:41
                  </p>
                  <h4 className="text-sm font-medium">Lead Déposé</h4>
                  <p className="text-sm text-gray-500">
                    Analyse initiale terminée par le Node.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-black border-2 border-white" />
                  <p className="text-xs text-black mb-1">À Faire</p>
                  <h4 className="text-sm font-medium">Premier Contact</h4>
                  <p className="text-sm text-gray-500">
                    Envoyer l&apos;email d&apos;intro via Outlook.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white" />
                  <p className="text-xs text-gray-400 mb-1">Futur</p>
                  <h4 className="text-sm font-medium">Appel de Découverte</h4>
                  <p className="text-sm text-gray-500">
                    Planifié après réponse positive.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Actions & Files */}
          <div className="space-y-6">
            <Card title="Décideurs Clés">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="text-sm font-medium">Jean Dupont</p>
                    <p className="text-xs text-gray-400">
                      Chief Technology Officer
                    </p>
                  </div>
                  <span className="ml-auto text-green-600 text-[10px] uppercase font-bold">
                    Cible
                  </span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="text-sm font-medium">Marie Claire</p>
                    <p className="text-xs text-gray-400">VP Engineering</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Documents Générés" className="bg-black text-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between group cursor-pointer hover:bg-white/10 p-2 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-white">
                      picture_as_pdf
                    </span>
                    <span className="text-sm font-light">
                      Audit_Technique_v1.pdf
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">
                    download
                  </span>
                </div>
                <div className="flex items-center justify-between group cursor-pointer hover:bg-white/10 p-2 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-white">
                      description
                    </span>
                    <span className="text-sm font-light">
                      Script_Appel_CTO.docx
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">
                    download
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
