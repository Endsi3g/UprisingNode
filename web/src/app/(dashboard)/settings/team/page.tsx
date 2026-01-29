"use client";

import { Button, Input, Label, Separator } from "@/components/ui";

export default function TeamSettingsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="sm:mx-auto sm:max-w-2xl bg-white p-8 md:p-12 border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-2 mb-10">
          <h3 className="text-2xl font-serif font-normal text-black tracking-tight">
            Détails du Compte & Équipe
          </h3>
          <p className="text-sm text-gray-400 font-light">
            Mettez à jour les informations utilisées pour la gestion du compte
            et la facturation.
          </p>
        </div>

        <form action="#" method="post" className="space-y-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3 space-y-2">
              <Label
                htmlFor="first-name"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Prénom
              </Label>
              <Input
                type="text"
                id="first-name"
                name="first-name"
                autoComplete="given-name"
                placeholder="Emma"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full sm:col-span-3 space-y-2">
              <Label
                htmlFor="last-name"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Nom
              </Label>
              <Input
                type="text"
                id="last-name"
                name="last-name"
                autoComplete="family-name"
                placeholder="Crown"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="emma@company.com"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label
                htmlFor="address"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Adresse
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="29 Park Street"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full sm:col-span-2 space-y-2">
              <Label
                htmlFor="country"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Pays
              </Label>
              <Input
                type="text"
                id="country"
                name="country"
                autoComplete="country-name"
                placeholder="France"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full sm:col-span-2 space-y-2">
              <Label
                htmlFor="city"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Ville
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder="Paris"
                className="lindy-input"
              />
            </div>
            <div className="col-span-full sm:col-span-2 space-y-2">
              <Label
                htmlFor="postal-code"
                className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
              >
                Code Postal
              </Label>
              <Input
                type="number"
                id="postal-code"
                name="postal-code"
                autoComplete="postal-code"
                placeholder="75001"
                className="lindy-input"
              />
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-normal text-black tracking-tight">
                Notifications & Équipe
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Gérez vos préférences de collaboration pour cet espace de
                travail.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  id: "option-1",
                  title: "Newsletter Partenaire",
                  desc: "Mises à jour sur les nouveaux produits et services.",
                },
                {
                  id: "option-2",
                  title: "Activités des Membres",
                  desc: "Notifications lorsque de nouveaux membres rejoignent.",
                },
                {
                  id: "option-3",
                  title: "Activités de Déploiement",
                  desc: "Notifications sur le succès ou l'échec du déploiement.",
                },
              ].map((option) => (
                <div
                  key={option.id}
                  className="relative flex items-start gap-4 p-4 border border-transparent hover:border-black transition-all group"
                >
                  <div className="flex h-6 items-center">
                    <input
                      id={option.id}
                      name={option.id}
                      type="checkbox"
                      className="h-4 w-4 border-black text-black focus:ring-black accent-black cursor-pointer"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor={option.id}
                      className="font-medium text-black cursor-pointer uppercase tracking-tight text-[11px]"
                    >
                      {option.title}
                    </label>
                    <p className="text-gray-400 font-light text-xs">
                      {option.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div className="flex items-center justify-end space-x-6 pt-4">
            <button
              type="button"
              className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 hover:text-black transition-colors"
            >
              Annuler
            </button>
            <Button type="submit" variant="default" className="px-8">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
