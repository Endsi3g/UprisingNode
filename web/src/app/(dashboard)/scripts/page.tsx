"use client";

import { Header } from "@/components/layout";
import { Button, Card } from "@/components/ui";

const scripts = [
  {
    id: 1,
    title: "Le 'Pattern Interrupt' CTO",
    category: "Cold Call",
    tags: ["Technique", "Direct"],
    content:
      "Bonjour [Nom], je ne vais pas vous demander comment vous allez, je sais que vous êtes occupé. La raison de mon appel est vos coûts serveurs du Q3...",
  },
  {
    id: 2,
    title: "Email de Relance 'Break-Up'",
    category: "Email",
    tags: ["Psychologie", "Closing"],
    content:
      "Bonjour [Nom], sans nouvelle de votre part, je suppose que l'optimisation de l'infrastructure n'est plus une priorité. Je vais donc fermer ce dossier...",
  },
  {
    id: 3,
    title: "Objection: 'Trop Cher'",
    category: "Négociation",
    tags: ["Rebuttal", "Finance"],
    content:
      "Cher par rapport à quoi ? Si on regarde le coût de l'inaction (20k/mois de perte actuelle), notre solution s'autofinance en 14 jours...",
  },
];

export default function ScriptsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main">
      <Header userName="K. Miller" userRole="Opérateur" />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-black">
              Bibliothèque de Scripts
            </h1>
            <p className="text-gray-500 mt-2 font-light">
              Templates de communication haute performance, éprouvés par le
              Node.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filtrer par Phase</Button>
            <Button>Suggérer un Script</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scripts.map((script) => (
            <Card
              key={script.id}
              title={script.title}
              className="hover:border-black transition-colors cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {script.category}
                  </span>
                  {script.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-sm font-mono text-sm text-gray-600 leading-relaxed italic border-l-2 border-transparent group-hover:border-black transition-all">
                  &quot;{script.content}&quot;
                </div>

                <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="text-xs">
                    <span className="material-symbols-outlined text-sm mr-1">
                      content_copy
                    </span>
                    Copier
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
