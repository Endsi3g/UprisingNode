"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FinancialsPage() {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    // Trigger chart animations slightly after mount
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center flex-1 min-h-[60vh]">
          <div className="lg:col-span-5 space-y-12 fade-in-up">
            <div className="space-y-6">
              <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.3em] font-medium pl-1">
                Analyse Financière
              </p>
              <h1 className="text-5xl md:text-6xl font-serif text-black leading-[1.1] tracking-tight">
                Gains <br />
                <span className="italic">Accélérés</span>
              </h1>
              <p className="text-gray-500 font-light leading-relaxed text-lg max-w-md">
                Notre architecture financière débloque une courbe de rendement
                exponentielle, maximisant l'impact de chaque nouveau nœud
                connecté au réseau.
              </p>
            </div>
            <div className="relative pl-8 py-4 border-l-2 border-black/80">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-50 to-transparent opacity-50 -z-10"></div>
              <span className="block text-6xl md:text-7xl font-serif text-black leading-none mb-2">
                25%
              </span>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-black font-semibold">
                  Commission Perpétuelle
                </p>
                <p className="text-sm text-gray-500 font-light leading-snug max-w-xs">
                  Revenu récurrent généré automatiquement sur l'ensemble de
                  votre volume d'affaires direct et indirect.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 w-full fade-in-up delay-200">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] p-6 md:p-12">
              <div className="absolute inset-0 border border-gray-100 bg-gray-50/30"></div>
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 400 250"
              >
                <line
                  stroke="#e5e5e5"
                  strokeWidth="1"
                  x1="0"
                  x2="400"
                  y1="250"
                  y2="250"
                ></line>
                <line
                  stroke="#e5e5e5"
                  strokeWidth="1"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="250"
                ></line>
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#000000"
                      stopOpacity="0.03"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="#ffffff"
                      stopOpacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
                <path
                  className={`opacity-0 ${animateChart ? "fade-chart-path" : ""}`}
                  d="M0,240 C120,240 200,220 260,140 S360,20 400,10 V250 H0 Z"
                  fill="url(#chartGradient)"
                ></path>
                <path
                  className={`${animateChart ? "draw-line" : "opacity-0"}`}
                  d="M0,240 C120,240 200,220 260,140 S360,20 400,10"
                  fill="none"
                  stroke="black"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                ></path>
                <g className="fade-in-up delay-300">
                  <circle
                    cx="260"
                    cy="140"
                    fill="white"
                    r="3"
                    stroke="black"
                    strokeWidth="1.5"
                  ></circle>
                  <line
                    stroke="#d4d4d4"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                    x1="260"
                    x2="260"
                    y1="140"
                    y2="250"
                  ></line>
                  <text
                    className="text-[10px] font-serif italic fill-black font-medium"
                    x="268"
                    y="135"
                  >
                    Effet de Levier
                  </text>
                </g>
                <g className="fade-in-up delay-300">
                  <circle
                    cx="380"
                    cy="25"
                    fill="black"
                    r="3"
                    stroke="none"
                  ></circle>
                  <text
                    className="text-[9px] font-sans uppercase tracking-widest fill-black font-semibold"
                    x="360"
                    y="45"
                  >
                    Scale
                  </text>
                </g>
                <text
                  className="text-[9px] font-sans uppercase tracking-[0.2em] fill-gray-400 rotate-0"
                  x="10"
                  y="20"
                >
                  Revenus Passifs
                </text>
                <text
                  className="text-[9px] font-sans uppercase tracking-[0.2em] fill-gray-400"
                  x="360"
                  y="240"
                >
                  Temps
                </text>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end pt-8 md:pt-12 mt-auto border-t border-gray-50 fade-in-up delay-300">
          <div className="hidden md:flex gap-1 mb-6 md:mb-0">
            <div className="h-0.5 w-8 bg-black"></div>
            <div className="h-0.5 w-8 bg-gray-200"></div>
            <div className="h-0.5 w-8 bg-gray-200"></div>
          </div>
          <Link href="/register/identity">
            <button className="group relative overflow-hidden bg-black text-white px-12 py-5 min-w-[240px] flex items-center justify-center gap-4 transition-all duration-500 hover:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-0.5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] relative z-10">
                Suivant
              </span>
              <span className="material-symbols-outlined text-sm relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
