"use client";

import { Divider, NumberInput, TextInput } from '@tremor/react';

export default function TeamSettingsPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <div className="sm:mx-auto sm:max-w-2xl">
                <h3 className="mt-6 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Détails du Compte & Équipe
                </h3>
                <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                    Mettez à jour les informations personnelles utilisées pour la gestion du compte et la facturation.
                </p>
                <form action="#" method="post" className="mt-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Prénom
                            </label>
                            <TextInput
                                type="text"
                                id="first-name"
                                name="first-name"
                                autoComplete="given-name"
                                placeholder="Emma"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="last-name"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Nom
                            </label>
                            <TextInput
                                type="text"
                                id="last-name"
                                name="last-name"
                                autoComplete="family-name"
                                placeholder="Crown"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="email"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Email
                            </label>
                            <TextInput
                                type="text"
                                id="email"
                                name="email"
                                autoComplete="email"
                                placeholder="emma@company.com"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="address"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Adresse
                            </label>
                            <TextInput
                                type="text"
                                id="address"
                                name="address"
                                autoComplete="street-address"
                                placeholder="29 Park Street"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-2">
                            <label
                                htmlFor="country"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Pays
                            </label>
                            <TextInput
                                type="text"
                                id="country"
                                name="country"
                                autoComplete="country-name"
                                placeholder="France"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-2">
                            <label
                                htmlFor="city"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Ville
                            </label>
                            <TextInput
                                type="text"
                                id="city"
                                name="city"
                                autoComplete="address-level2"
                                placeholder="Paris"
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-2">
                            <label
                                htmlFor="postal-code"
                                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                            >
                                Code Postal
                            </label>
                            <NumberInput
                                id="postal-code"
                                name="postal-code"
                                autoComplete="postal-code"
                                placeholder="75001"
                                enableStepper={false}
                                className="mt-2 rounded-tremor-small"
                            />
                        </div>
                    </div>
                    <Divider className="my-12" />
                    <div>
                        <h3 className="mt-6 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Notifications & Équipe
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Gérez vos préférences de collaboration pour cet espace de travail.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="form-option-1"
                                        aria-describedby="form-option-1-description"
                                        name="form-option-1"
                                        type="checkbox"
                                        className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                                    />
                                </div>
                                <div className="ml-3 text-tremor-default leading-6">
                                    <label
                                        htmlFor="form-option-1"
                                        className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Newsletter Partenaire
                                    </label>
                                    <p
                                        id="form-option-1-description"
                                        className="text-tremor-content dark:text-dark-tremor-content"
                                    >
                                        Je souhaite recevoir les mises à jour sur les nouveaux produits et services.
                                    </p>
                                </div>
                            </div>
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="form-option-2"
                                        aria-describedby="form-option-2-description"
                                        name="form-option-2"
                                        type="checkbox"
                                        className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                                    />
                                </div>
                                <div className="ml-3 text-tremor-default leading-6">
                                    <label
                                        htmlFor="form-option-2"
                                        className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Activités des Membres
                                    </label>
                                    <p
                                        id="form-option-2-description"
                                        className="text-tremor-content dark:text-dark-tremor-content"
                                    >
                                        Restez informé et recevez des notifications lorsque de nouveaux membres rejoignent ou quittent cet espace.
                                    </p>
                                </div>
                            </div>
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="form-option-3"
                                        aria-describedby="form-option-3-description"
                                        name="form-option-3"
                                        type="checkbox"
                                        className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                                    />
                                </div>
                                <div className="ml-3 text-tremor-default leading-6">
                                    <label
                                        htmlFor="form-option-3"
                                        className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Activités de Déploiement
                                    </label>
                                    <p
                                        id="form-option-3-description"
                                        className="text-tremor-content dark:text-dark-tremor-content"
                                    >
                                        Recevez des notifications sur le succès ou l'échec du déploiement de cet espace de travail.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong hover:bg-gray-100 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="whitespace-nowrap rounded-tremor-small bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis bg-black text-white hover:bg-zinc-800 transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
