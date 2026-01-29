"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/services/api.service";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getProfile()
      .then((data) => setProfile(data))
      // Mock data if backend fails/is empty for demo
      .catch(() =>
        setProfile({
          name: "Jean Dupont",
          email: "jean.dupont@entreprise.fr",
          company: "Uprising Tech Solutions",
          siret: "123 456 789 00012",
          rank: "Partenaire Platine",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profile);
      alert("Profil mis à jour avec succès");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50">
                <span className="material-symbols-outlined text-4xl text-gray-300 font-light">
                  person
                </span>
              </div>
              <div className="absolute inset-0 rounded-full border border-black/5"></div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight">
                {profile?.name || "Jean Dupont"}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.25em]">
                  Rang actuel
                </span>
                <span className="text-black font-sans text-[10px] uppercase tracking-[0.25em] font-bold">
                  {profile?.rank || "Partenaire Platine"}
                </span>
              </div>
            </div>
          </div>
          <form className="space-y-16 max-w-2xl" onSubmit={handleSubmit}>
            <section className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-sm font-serif italic text-black">
                  Informations Personnelles
                </h3>
                <div className="w-8 h-px bg-black/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2 group">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                    htmlFor="nom"
                  >
                    Nom Complet
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-2 text-base font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300"
                    id="nom"
                    name="nom"
                    type="text"
                    value={profile?.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 group">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                    htmlFor="email"
                  >
                    Email Professionnel
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-2 text-base font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300"
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>
            <section className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-sm font-serif italic text-black">
                  Informations sur l&apos;Entreprise
                </h3>
                <div className="w-8 h-px bg-black/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2 group">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                    htmlFor="company"
                  >
                    Raison Sociale
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-2 text-base font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300"
                    id="company"
                    name="company"
                    type="text"
                    value={profile?.company || "Uprising Tech Solutions"}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 group">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
                    htmlFor="siret"
                  >
                    Numéro SIRET
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-2 text-base font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300"
                    id="siret"
                    name="siret"
                    type="text"
                    value={profile?.siret || "123 456 789 00012"}
                    onChange={(e) =>
                      setProfile({ ...profile, siret: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>
            <div className="pt-4">
              <button className="bg-black text-white py-4 px-10 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group">
                <span>Mettre à jour le profil</span>
                <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
                  check
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-4 lg:border-l lg:border-gray-50 lg:pl-16 space-y-12">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                État du compte
              </span>
              <div className="w-4 h-px bg-black/10"></div>
            </div>
            <div className="flex items-center gap-4 py-4 px-6 border border-gray-100">
              <span className="material-symbols-outlined text-green-600 font-light">
                verified_user
              </span>
              <div>
                <p className="text-sm font-serif text-black">
                  Statut du Compte: Vérifié
                </p>
                <p className="text-[9px] uppercase tracking-widest text-gray-400">
                  Identité validée le 12/03/2024
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Aide &amp; Support
              </span>
              <div className="w-4 h-px bg-black/10"></div>
            </div>
            <p className="text-xs text-gray-500 font-serif leading-relaxed italic">
              Besoin d&apos;aide pour modifier vos informations d&apos;entreprise ?
              Contactez votre gestionnaire de compte dédié.
            </p>
            <a
              className="inline-block text-[10px] uppercase tracking-widest font-semibold border-b border-gray-200 hover:border-black transition-colors pb-1"
              href="#"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
