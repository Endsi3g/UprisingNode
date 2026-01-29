"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/services/api.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (!token) {
      toast.error("Token de réinitialisation manquant");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      toast.success("Mot de passe réinitialisé", {
        description:
          "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Échec de la réinitialisation", {
        description: "Le lien est peut-être expiré ou invalide.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-6 py-8 border border-gray-100 bg-gray-50/30">
        <span className="material-symbols-outlined text-4xl text-red-500">
          error
        </span>
        <p className="text-sm text-gray-600">
          Lien de réinitialisation invalide ou manquant.
        </p>
        <Link href="/forgot-password" className="text-sm text-black underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* New Password Field */}
      <div className="space-y-2 group">
        <label
          htmlFor="newPassword"
          className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
        >
          Nouveau mot de passe
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-3 text-lg font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
        />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2 group">
        <label
          htmlFor="confirmPassword"
          className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors"
        >
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black p-0 py-3 text-lg font-serif text-black placeholder:text-gray-200 focus:ring-0 transition-all duration-300 outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6 space-y-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group disabled:opacity-70"
        >
          <span>
            {isLoading
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </span>
          {!isLoading && (
            <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased">
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-sm fixed top-0 z-40">
        <div className="px-6 md:px-12 py-8 flex items-center justify-center md:justify-start max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-4 text-black cursor-pointer hover:opacity-80 transition-opacity"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center py-24 md:py-32">
        {/* Title Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-black tracking-tight">
            Nouveau mot de passe
          </h1>
          <div className="w-16 h-px bg-black/10 mx-auto" />
          <p className="text-gray-400 font-sans text-sm">
            Créez un nouveau mot de passe pour votre compte
          </p>
        </div>

        <Suspense
          fallback={<div className="text-center py-8">Chargement...</div>}
        >
          <ResetPasswordForm />
        </Suspense>

        {/* Back to Login Link */}
        <div className="mt-16 pt-8 border-t border-gray-50 text-center">
          <Link
            href="/login"
            className="inline-flex flex-col items-center gap-2 group"
          >
            <span className="text-sm font-serif text-black border-b border-gray-200 group-hover:border-black pb-0.5 transition-all">
              Retour à la connexion
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none hidden md:block">
        <p className="text-[9px] text-gray-200 uppercase tracking-widest">
          Uprising Node System v2.4
        </p>
      </footer>
    </div>
  );
}
