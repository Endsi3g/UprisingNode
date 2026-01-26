import Link from "next/link";
import { Button } from "@/components/ui";

export default function WelcomePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      {/* Header */}
      <header className="w-full bg-white fixed top-0 z-40">
        <div className="px-6 md:px-12 py-8 flex items-center justify-center md:justify-start max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-black group cursor-default">
            <div className="text-black opacity-100 transition-opacity duration-300">
              <span className="material-symbols-outlined text-3xl font-light">
                hub
              </span>
            </div>
            <h2 className="text-lg font-medium tracking-wide font-serif text-black italic">
              Uprising Node
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-screen pt-16 pb-12">
        <div className="text-center space-y-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in">
            <span className="inline-block py-1 px-3 border border-gray-200 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
              Portail Partenaire v1.0
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal text-black tracking-tight leading-[1.1] animate-fade-in-delay-100">
            Le Futur du
            <br />
            <span className="italic">Scale</span> est Ici.
          </h1>

          {/* Divider */}
          <div className="w-16 h-px bg-black mx-auto animate-fade-in-delay-200" />

          {/* Description */}
          <p className="text-gray-500 font-sans text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto animate-fade-in-delay-200">
            Bienvenue dans l&apos;écosystème Uprising Node. Une interface conçue
            pour la vélocité, la clarté et la performance financière sans
            compromis. Initialisez votre espace de travail pour accéder à vos
            privilèges.
          </p>

          {/* CTA */}
          <div className="pt-8 animate-fade-in-delay-300 flex flex-col items-center gap-6">
            <Link href="/register/identity">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[260px] group"
              >
                <span>Commencer l&apos;Expérience</span>
                <span className="material-symbols-outlined text-base font-light group-hover:translate-x-1 transition-transform duration-300">
                  arrow_forward
                </span>
              </Button>
            </Link>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              Temps de configuration estimé : 2 minutes
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
          <span className="material-symbols-outlined text-sm">
            verified_user
          </span>
          <span className="text-[10px] uppercase tracking-widest">
            Connexion Sécurisée
          </span>
        </div>
        <p className="text-[10px] text-gray-300 font-serif italic">
          © 2024 Uprising Node. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
