"use client";

import React, { useState, useEffect } from "react";
import { useLayout } from "@/context/layout-context";
import { useAuth } from "@/context/auth-context";
import { usersService } from "@/services/api.service";
import { toast } from "sonner";

export default function SettingsPage() {
    const { viewMode, toggleViewMode } = useLayout();
    const { user, refetchProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const [prefs, setPrefs] = useState({
        twoFactorEnabled: false,
        emailNotifications: true,
        pushNotifications: true,
    });

    // Populate form data from user context
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
            });
            // Prefs might be in user object if we updated the backend to return them in 'me'
            // Since we updated findAll but might not have updated findOne select, let's verify.
            // If findOne doesn't return them, we might need to update UsersService.findOne
            if (user.twoFactorEnabled !== undefined) {
                setPrefs({
                    twoFactorEnabled: user.twoFactorEnabled,
                    emailNotifications: user.emailNotifications,
                    pushNotifications: user.pushNotifications,
                });
            }
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);
            await usersService.updateProfile({
                name: formData.name,
                avatar: formData.avatar,
            });
            toast.success("Profil mis à jour");
            refetchProfile();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        try {
            setLoading(true);
            await usersService.changePassword(passwordData);
            toast.success("Mot de passe modifié");
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error("Erreur (vérifiez l'ancien mot de passe)");
        } finally {
            setLoading(false);
        }
    };

    const togglePref = async (key: keyof typeof prefs) => {
        try {
            const newPrefs = { ...prefs, [key]: !prefs[key] };
            setPrefs(newPrefs); // Optimistic UI
            await usersService.updatePreferences({ [key]: newPrefs[key] });
            // toast.success("Préférences sauvegardées");
            refetchProfile();
        } catch (error) {
            setPrefs(prefs); // Revert
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    return (
        <main className="max-w-3xl mx-auto px-6 pt-8 pb-24 font-sans text-text-main">
            <header className="mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight mb-4">
                    Paramètres Système
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Configuration du Portail Partenaire</p>
            </header>

            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Profil</h2>
                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Nom Complet</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full border-b border-gray-200 py-2 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Avatar URL</label>
                            <input
                                type="text"
                                value={formData.avatar}
                                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                                className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="text-[10px] font-semibold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                    >
                        {loading ? '...' : 'Enregistrer le profil'}
                    </button>
                </div>
            </section>

            <div className="h-px bg-black/10 w-full mb-12"></div>

            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Apparence</h2>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Mode de Navigation</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">
                                {viewMode === "sidebar" ? "Barre latérale classique" : "Dock flottant (Expérimental)"}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={viewMode === "dock"}
                                onChange={toggleViewMode}
                            />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>

            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Sécurité</h2>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="password"
                                placeholder="Ancien mot de passe"
                                value={passwordData.oldPassword}
                                onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm"
                            />
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm"
                            />
                        </div>
                        <button
                            onClick={handlePasswordChange}
                            disabled={loading || !passwordData.oldPassword || !passwordData.newPassword}
                            className="text-[10px] font-semibold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        >
                            Modifier le mot de passe
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <p className="text-sm font-medium">Authentification à deux facteurs (2FA)</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Sécurité renforcée de votre compte</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={prefs.twoFactorEnabled}
                                onChange={() => togglePref('twoFactorEnabled')}
                            />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>
            <section className="mb-16">
                <h2 className="text-xl font-serif italic mb-8">Notifications</h2>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Emails</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Résumé hebdomadaire des transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={prefs.emailNotifications}
                                onChange={() => togglePref('emailNotifications')}
                            />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Notifications Push</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Alertes système en temps réel</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={prefs.pushNotifications}
                                onChange={() => togglePref('pushNotifications')}
                            />
                            <div className="w-11 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>
            </section>
            <div className="h-px bg-black/10 w-full mb-12"></div>
        </main>
    );
}
