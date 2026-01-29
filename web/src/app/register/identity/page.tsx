"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IdentityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    company: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate and save state here
    router.push("/register/verify");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      <header className="w-full bg-white/95 backdrop-blur-sm fixed top-0 z-40 border-b border-gray-100">
        <div className="px-6 md:px-12 py-6 flex items-center justify-between w-full max-w-[1920px] mx-auto">
          <Link
            href="/"
            className="flex items-center gap-4 text-black decoration-0 cursor-pointer"
          >
            <div className="text-black opacity-80">
              <span className="material-symbols-outlined text-2xl font-light">
                hub
              </span>
            </div>
            <h2 className="text-base font-medium tracking-wide font-serif text-black italic">
              Uprising Node
            </h2>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-[10px] font-medium text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col md:flex-row min-h-screen pt-[80px]">
        <section className="w-full md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/40 p-12 md:p-16 flex flex-col justify-between min-h-[300px] md:min-h-0 relative overflow-hidden">
          <div className="absolute top-0 left-12 w-px h-32 bg-gray-200"></div>
          <div className="absolute bottom-0 right-12 w-px h-32 bg-gray-200"></div>
          <div className="hidden md:block">
            <div className="w-8 h-px bg-black mb-8"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full">
            <span className="material-symbols-outlined text-4xl mb-6 font-thin text-gray-300">
              format_quote
            </span>
            <blockquote className="font-serif text-3xl lg:text-4xl leading-tight text-black italic">
              Rejoignez l'élite du scale.
            </blockquote>
          </div>
          <div className="hidden md:block text-[9px] uppercase tracking-widest text-gray-400">
            Architecture Node v2.0
          </div>
        </section>

        <section className="w-full md:w-7/12 lg:w-8/12 bg-white flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
          <div className="w-full max-w-md space-y-12">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Inscription
                </span>
                <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                  Étape 1 sur 2
                </span>
              </div>
              <div className="w-full h-px bg-gray-100 relative">
                <div className="absolute left-0 top-0 h-full w-1/2 bg-black"></div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif text-black tracking-tight">
                Devenir Partenaire
              </h1>
              <p className="text-gray-500 font-sans text-sm font-light">
                Commencez par valider votre identité professionnelle.
              </p>
            </div>

            <form className="space-y-10 pt-4" onSubmit={handleSubmit}>
              <div className="relative group">
                <input
                  className="floating-input block w-full bg-transparent border-b border-gray-200 py-3 text-lg font-serif text-black placeholder-transparent focus:border-black focus:ring-0 transition-all duration-300 outline-none"
                  id="fullname"
                  placeholder="Nom complet"
                  type="text"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                />
                <label
                  className="floating-label absolute left-0 transition-all duration-300 pointer-events-none text-gray-400"
                  htmlFor="fullname"
                >
                  Nom complet
                </label>
              </div>

              <div className="relative group">
                <input
                  className="floating-input block w-full bg-transparent border-b border-gray-200 py-3 text-lg font-serif text-black placeholder-transparent focus:border-black focus:ring-0 transition-all duration-300 outline-none"
                  id="email"
                  placeholder="Email professionnel"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <label
                  className="floating-label absolute left-0 transition-all duration-300 pointer-events-none text-gray-400"
                  htmlFor="email"
                >
                  Email professionnel
                </label>
              </div>

              <div className="relative group">
                <input
                  className="floating-input block w-full bg-transparent border-b border-gray-200 py-3 text-lg font-serif text-black placeholder-transparent focus:border-black focus:ring-0 transition-all duration-300 outline-none"
                  id="company"
                  placeholder="Entreprise"
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
                <label
                  className="floating-label absolute left-0 transition-all duration-300 pointer-events-none text-gray-400"
                  htmlFor="company"
                >
                  Entreprise
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
                >
                  <span>Continuer</span>
                  <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </button>
                <div className="text-center mt-6">
                  <p className="text-[9px] text-gray-300 uppercase tracking-widest">
                    En continuant, vous acceptez nos CGU
                  </p>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .floating-input:placeholder-shown ~ .floating-label {
          top: 0.5rem;
          font-size: 1rem;
          color: #9ca3af;
          letter-spacing: normal;
        }
        .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
          top: -0.75rem;
          font-size: 0.65rem;
          color: #1a1a1a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
