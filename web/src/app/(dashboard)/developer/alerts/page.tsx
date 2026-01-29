"use client";

import { Header } from "@/components/layout";
import { Card, Input, Button } from "@/components/ui";

export default function AlertsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
        <h1 className="text-3xl font-serif text-black">Webhooks & Alertes</h1>

        <Card title="Endpoints Webhooks">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">
                URL de Réception (Prod)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://votre-api.com/webhooks"
                  defaultValue="https://api.techcorp.io/uprising/events"
                />
                <Button>Mettre à jour</Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Secret de Signature
              </label>
              <div className="font-mono bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                <span>whsec_...8f2a</span>
                <Button variant="ghost" size="sm">
                  Révéler
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Configuration des Alertes">
          <div className="space-y-4">
            {[
              "Lead Créé",
              "Deal Signé",
              "Erreur Critique",
              "Quota Atteint",
            ].map((event) => (
              <div
                key={event}
                className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded"
              >
                <span className="font-medium">{event}</span>
                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="toggle"
                    id={event}
                    className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-4 bg-black border-black"
                  />
                  <label
                    htmlFor={event}
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-black cursor-pointer"
                  ></label>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
