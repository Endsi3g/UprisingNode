"use client";

import Link from "next/link";

export default function PipelinePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      <header className="w-full bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-50">
        <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 text-black">
            <div className="text-black opacity-80">
              <span className="material-symbols-outlined text-2xl font-light">
                hub
              </span>
            </div>
            <h2 className="text-base font-medium tracking-wide font-serif text-black italic">
              Uprising Node
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                Connecté
              </span>
            </div>
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
              <div
                className="bg-center bg-no-repeat bg-cover grayscale opacity-90 size-8 rounded-full border border-gray-100 ring-2 ring-white"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMflAqpGYir9XOgJftZNEspNP4YhL4rOPhdqw0jK_aScxv1hEB3L_lzTmM9Yhh7p9Bx-zR8FPI8BGHUHUllrAJDb-KhtUBsqU-ow4gz1n2Xk6fA8mW9g47-WRYmuNS0QAW_9o-jagO5g5z8bKdLzEnz2LlxLpmlbixX3D_b0WsSTorkGrwc3J7RGALpmKOBVUrUK7iA48qG0b4tWxQnQOXK_S9JVfjK6tVa4xwe4PR4q82uVCiUq2Ob5fW4_0YZ9Smp0LT32pSxHGh")',
                }}
              ></div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-between h-full">
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
          <div className="text-center space-y-6 mb-20 fade-in-up">
            <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.3em] font-medium">
              Opérations
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-black tracking-tight leading-tight">
              Visibilité <span className="italic">Cristalline</span>
            </h1>
            <p className="text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
              Un contrôle absolu sur chaque étape de votre flux d'affaires.
              Notre interface élimine l'opacité pour ne laisser place qu'à la
              performance.
            </p>
          </div>
          <div className="relative w-full mt-8 md:mt-16 mb-20">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -translate-y-1/2 z-0 fade-in-up delay-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
              <div className="flex flex-col md:items-center text-left md:text-center group fade-in-up delay-200">
                <div className="mb-6 md:mb-8 relative flex items-center justify-center">
                  <div className="bg-white p-4 border border-gray-100 shadow-sm relative z-10 group-hover:border-black transition-colors duration-500">
                    <span className="material-symbols-outlined text-3xl font-light">
                      person_search
                    </span>
                  </div>
                  <div className="md:hidden absolute left-8 top-full h-12 w-[1px] bg-gray-200"></div>
                </div>
                <h3 className="text-lg font-serif text-black mb-3">Prospect</h3>
                <div className="h-[1px] w-8 bg-black mb-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[220px]">
                  Détection et enrichissement automatique des leads entrants
                  avec traçabilité de la source en temps réel.
                </p>
              </div>
              <div className="flex flex-col md:items-center text-left md:text-center group fade-in-up delay-300">
                <div className="mb-6 md:mb-8 relative flex items-center justify-center">
                  <div className="bg-white p-4 border border-gray-100 shadow-sm relative z-10 group-hover:border-black transition-colors duration-500">
                    <span className="material-symbols-outlined text-3xl font-light">
                      fact_check
                    </span>
                  </div>
                  <div className="md:hidden absolute left-8 top-full h-12 w-[1px] bg-gray-200"></div>
                </div>
                <h3 className="text-lg font-serif text-black mb-3">Audit</h3>
                <div className="h-[1px] w-8 bg-black mb-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[220px]">
                  Analyse algorithmique des besoins et scoring prédictif
                  accessible instantanément sur votre dashboard.
                </p>
              </div>
              <div className="flex flex-col md:items-center text-left md:text-center group fade-in-up delay-400">
                <div className="mb-6 md:mb-8 relative flex items-center justify-center">
                  <div className="bg-white p-4 border border-gray-100 shadow-sm relative z-10 group-hover:border-black transition-colors duration-500">
                    <span className="material-symbols-outlined text-3xl font-light">
                      campaign
                    </span>
                  </div>
                  <div className="md:hidden absolute left-8 top-full h-12 w-[1px] bg-gray-200"></div>
                </div>
                <h3 className="text-lg font-serif text-black mb-3">Pitch</h3>
                <div className="h-[1px] w-8 bg-black mb-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[220px]">
                  Notification dès l'ouverture de la proposition et suivi précis
                  du temps de lecture par section.
                </p>
              </div>
              <div className="flex flex-col md:items-center text-left md:text-center group fade-in-up delay-500">
                <div className="mb-6 md:mb-8 relative flex items-center justify-center">
                  <div className="bg-black text-white p-4 border border-black shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl font-light">
                      handshake
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-serif text-black mb-3">Closed</h3>
                <div className="h-[1px] w-8 bg-black mb-4 hidden md:block"></div>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[220px]">
                  Validation juridique, signature électronique et archivage
                  sécurisé du contrat finalisé.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border-t border-gray-100 pt-12 mt-auto fade-in-up delay-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="hidden md:flex gap-12 items-center">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                  Pipeline Transparent
                </span>
                <div className="h-[1px] w-24 bg-gray-200">
                  <div className="h-full w-full bg-black"></div>
                </div>
              </div>
              <Link href="/onboarding/financials">
                <button className="group relative overflow-hidden bg-black text-white px-12 py-4 md:py-5 min-w-[240px] flex items-center justify-center gap-4 transition-all duration-300 hover:bg-gray-900 shadow-sm hover:shadow-lg ml-auto">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] relative z-10">
                    Suivant
                  </span>
                  <span className="material-symbols-outlined text-lg relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes fade-in-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
