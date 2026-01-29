"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Target, User, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEPS = [
  { id: 1, title: "Bienvenue", icon: Rocket },
  { id: 2, title: "Profil", icon: User },
  { id: 3, title: "Objectifs", icon: Target },
  { id: 4, title: "Succès", icon: Check },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    linkedin: "",
    revenueGoal: "",
    sector: [] as string[],
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  // const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1)); // Optional depending on flow

  const toggleSector = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      sector: prev.sector.includes(sector)
        ? prev.sector.filter((s) => s !== sector)
        : [...prev.sector, sector],
    }));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-stone-900 overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white/95 backdrop-blur-sm fixed top-0 z-40 border-b border-gray-100 h-20 flex items-center">
        <div className="px-6 md:px-12 flex items-center justify-between w-full max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4 text-black">
            <h2 className="text-base font-medium tracking-wide font-serif text-black italic">
              Uprising Node
            </h2>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col md:flex-row min-h-screen pt-20">
        {/* Visual Sidebar */}
        <section className="hidden md:flex w-full md:w-5/12 lg:w-4/12 border-r border-gray-100 bg-gray-50/40 p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-center">
            <blockquote className="font-serif text-3xl lg:text-4xl leading-tight text-black italic mb-8">
              {currentStep === 1 && "Tout commence ici."}
              {currentStep === 2 && "Dites-nous en plus."}
              {currentStep === 3 && "Visez haut."}
              {currentStep === 4 && "Prêt à décoller ?"}
            </blockquote>

            {/* Progress Stepper */}
            <div className="space-y-6">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-4 transition-all duration-300",
                    currentStep >= step.id ? "opacity-100" : "opacity-40",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                      currentStep > step.id
                        ? "bg-black border-black text-white"
                        : currentStep === step.id
                          ? "border-black text-black"
                          : "border-gray-300 text-gray-400",
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "uppercase tracking-widest text-xs font-medium",
                      currentStep === step.id ? "text-black" : "text-gray-500",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block text-[9px] uppercase tracking-widest text-gray-400">
            Configuration Initiale
          </div>
        </section>

        {/* Content Area */}
        <section className="w-full md:w-7/12 lg:w-8/12 bg-white flex flex-col items-center justify-center p-8 md:p-16 relative">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              {/* STEP 1: WELCOME */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h1 className="text-4xl font-serif text-black">
                      Bienvenue, Partenaire.
                    </h1>
                    <p className="text-gray-500 font-light text-lg">
                      Vous avez rejoint un réseau exclusif. Prenons 2 minutes
                      pour configurer votre espace personnel.
                    </p>
                  </div>
                  <Button
                    onClick={nextStep}
                    className="w-full h-14 bg-black text-white uppercase tracking-widest hover:bg-black/90 text-xs"
                  >
                    Commencer <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: PROFILE */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif text-black">
                      Votre Profil
                    </h1>
                    <p className="text-gray-500 font-light">
                      Ces informations aideront vos leads à vous identifier.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Rôle Principal</Label>
                      <Input
                        placeholder="Ex: Consultant Freelance"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="h-12 border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Profil LinkedIn (Optionnel)</Label>
                      <Input
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin: e.target.value })
                        }
                        className="h-12 border-gray-200"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={nextStep}
                    className="w-full h-14 bg-black text-white uppercase tracking-widest hover:bg-black/90 text-xs"
                  >
                    Suivant
                  </Button>
                </motion.div>
              )}

              {/* STEP 3: GOALS */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif text-black">
                      Vos Objectifs
                    </h1>
                    <p className="text-gray-500 font-light">
                      Définissez vos cibles pour personnaliser votre expérience.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Secteurs d'intérêt</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "SaaS B2B",
                          "E-commerce",
                          "Fintech",
                          "Industrie",
                          "Santé",
                        ].map((sector) => (
                          <button
                            key={sector}
                            onClick={() => toggleSector(sector)}
                            className={cn(
                              "px-4 py-2 rounded-full border text-sm transition-all",
                              formData.sector.includes(sector)
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                            )}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Objectif de Revenu Mensuel</Label>
                      <Input
                        placeholder="Ex: 5000"
                        type="number"
                        value={formData.revenueGoal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            revenueGoal: e.target.value,
                          })
                        }
                        className="h-12 border-gray-200 font-mono"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={nextStep}
                    className="w-full h-14 bg-black text-white uppercase tracking-widest hover:bg-black/90 text-xs"
                  >
                    Suivant
                  </Button>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-serif text-black">
                      C'est tout bon !
                    </h1>
                    <p className="text-gray-500 font-light text-lg max-w-md mx-auto">
                      Votre profil est configuré. Vous pouvez maintenant accéder
                      à votre tableau de bord et commencer à générer des
                      opportunités.
                    </p>
                  </div>

                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full max-w-xs h-14 bg-black text-white uppercase tracking-widest hover:bg-black/90 text-xs"
                  >
                    Accéder au Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
