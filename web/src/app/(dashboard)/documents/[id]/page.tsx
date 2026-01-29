"use client";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function DocumentViewerPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col font-sans text-white">
      {/* Dark Header for Immersive View */}
      <header className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            asChild
          >
            <Link href="/dashboard">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-serif">Audit_Technique_v1.pdf</h1>
            <p className="text-xs text-gray-500">
              Généré le 25 Jan 2026 • 2.4 MB
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <span className="material-symbols-outlined mr-2">share</span>
            Partager
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">
            <span className="material-symbols-outlined mr-2">download</span>
            Télécharger
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#1a1a1a]">
        <div className="bg-white w-full max-w-4xl aspect-[1/1.414] shadow-2xl rounded-sm relative group overflow-hidden">
          {/* Placeholder for PDF Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4">
            <span className="material-symbols-outlined text-6xl opacity-20">
              picture_as_pdf
            </span>
            <p className="text-sm uppercase tracking-widest opacity-40 font-serif">
              Aperçu du Document
            </p>
          </div>

          {/* Fake content lines to look like a document */}
          <div className="absolute inset-0 p-16 space-y-8 opacity-10 pointer-events-none">
            <div className="w-1/3 h-8 bg-black mb-12" />
            <div className="space-y-4">
              <div className="w-full h-4 bg-black" />
              <div className="w-full h-4 bg-black" />
              <div className="w-2/3 h-4 bg-black" />
            </div>
            <div className="space-y-4 pt-12">
              <div className="w-full h-4 bg-black" />
              <div className="w-5/6 h-4 bg-black" />
              <div className="w-full h-4 bg-black" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
