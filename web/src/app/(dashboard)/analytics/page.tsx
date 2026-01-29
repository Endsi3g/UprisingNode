"use client";

import { Header } from "@/components/layout";
import { DataCard, Card } from "@/components/ui";

export default function AnalyticsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        <h1 className="text-3xl font-serif text-black">Performance & ROI</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DataCard
            title="Closing Rate"
            value="34%"
            trend="+2.4%"
            trendUp={true}
          />
          <DataCard
            title="Ticket Moyen"
            value="12.5k €"
            trend="+500 €"
            trendUp={true}
          />
          <DataCard
            title="Cycle de Vente"
            value="14j"
            trend="-3j"
            trendUp={true}
          />
          <DataCard
            title="NPS Partenaire"
            value="9.2"
            trend="Excellent"
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Évolution des Gains (YTD)">
            <div className="h-64 bg-gray-50 flex items-center justify-center border-dashed border-2 border-gray-200">
              <p className="text-gray-400 text-sm">
                Graphique Interactif (Chart.js)
              </p>
              {/* Integration point for Chart.js or Recharts */}
            </div>
          </Card>

          <Card title="Sources de Leads">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Inbound Marketing</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-[45%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Node Network</span>
                  <span>30%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 w-[30%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cold Outreach</span>
                  <span>25%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 w-[25%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
