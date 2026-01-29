"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

type Step = 1 | 2 | 3 | 4;

export default function FirstDepositPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [leadUrl, setLeadUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, title: "Bienvenue", description: "Introduction au système" },
    {
      id: 2,
      title: "Premier Lead",
      description: "Déposez votre premier contact",
    },
    { id: 3, title: "Traitement", description: "L'IA analyse votre lead" },
    { id: 4, title: "Terminé", description: "Accédez à votre dashboard" },
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadUrl.trim()) return;

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
      // Auto-advance after showing processing
      setTimeout(() => {
        setCurrentStep(4);
      }, 2500);
    }, 2000);
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-sm fixed top-0 z-40 border-b border-gray-50">
        <div className="px-6 py-6 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-black">
              hub
            </span>
            <span className="text-sm font-serif italic text-black">
              Uprising Node
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-[10px] uppercase tracking-widest">
              Étape {currentStep} / 4
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 h-px bg-gray-100 z-30">
        <div
          className="h-full bg-black transition-all duration-500 ease-out w-(--progress)"
          style={
            {
              "--progress": `${(currentStep / 4) * 100}%`,
            } as React.CSSProperties
          }
        />
      </div>

      <main className="flex-1 w-full max-w-lg mx-auto px-6 py-32 flex flex-col items-center justify-center">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full border border-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-black">
                waving_hand
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-serif text-black tracking-tight">
                Bienvenue dans le Node
              </h1>
              <p className="text-gray-500 font-light leading-relaxed max-w-md mx-auto">
                En quelques étapes, vous allez déposer votre premier lead et
                découvrir la puissance de notre système d&apos;intelligence.
              </p>
            </div>
            <div className="pt-8">
              <Button
                size="lg"
                onClick={handleNextStep}
                className="min-w-[200px]"
              >
                <span>Commencer</span>
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: First Lead */}
        {currentStep === 2 && (
          <div className="w-full space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border border-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-black">
                  link
                </span>
              </div>
              <h1 className="text-3xl font-serif text-black tracking-tight">
                Déposez Votre Premier Lead
              </h1>
              <p className="text-gray-500 font-light">
                Collez l&apos;URL du site web de votre prospect
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-8">
              <div className="relative">
                <input
                  type="url"
                  value={leadUrl}
                  onChange={(e) => setLeadUrl(e.target.value)}
                  placeholder="https://entreprise-cible.com"
                  required
                  className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-4 text-lg font-serif placeholder:text-gray-300 focus:ring-0 outline-none transition-all duration-300"
                />
              </div>

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  loading={isProcessing}
                  disabled={!leadUrl.trim()}
                  className="min-w-[200px]"
                >
                  <span>Analyser ce Lead</span>
                  <span className="material-symbols-outlined text-lg">
                    psychology
                  </span>
                </Button>
              </div>
            </form>

            <div className="text-center pt-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                L&apos;analyse prend généralement moins de 2 minutes
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 rounded-full border border-gray-200 animate-ping opacity-20" />
              <div className="absolute inset-0 rounded-full border border-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-black animate-pulse">
                  psychology
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-serif text-black tracking-tight">
                Analyse en Cours
              </h1>
              <p className="text-gray-500 font-light">
                Notre IA examine votre prospect...
              </p>
            </div>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {[
                "Extraction des données",
                "Analyse du positionnement",
                "Génération des angles",
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-400 animate-fade-in delay-(--delay)"
                  style={{ "--delay": `${i * 500}ms` } as React.CSSProperties}
                >
                  <span className="material-symbols-outlined text-base text-green-500">
                    check_circle
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-black flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-white">
                check
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-serif text-black tracking-tight">
                Félicitations !
              </h1>
              <p className="text-gray-500 font-light leading-relaxed max-w-md mx-auto">
                Votre premier lead a été analysé avec succès. Retrouvez le
                rapport complet dans votre Salle de Guerre.
              </p>
            </div>

            <div className="p-6 border border-gray-100 bg-gray-50/50 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Score de Réceptivité
                </span>
                <span className="text-xl font-serif text-black">87</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Commission Potentielle
                </span>
                <span className="text-xl font-serif text-black">2 500 $</span>
              </div>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                onClick={handleComplete}
                className="min-w-[240px]"
              >
                <span>Accéder au Dashboard</span>
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Steps Indicator */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              step.id === currentStep
                ? "bg-black scale-125"
                : step.id < currentStep
                  ? "bg-black/30"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
