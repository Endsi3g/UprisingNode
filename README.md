# UPRISING NODE

> **Infrastructure de Domination Commerciale & Partenariat Stratégique**
>
> ![Status](https://img.shields.io/badge/Status-Production%20Ready-green) ![Build](https://img.shields.io/badge/Build-Passing-success) ![Version](https://img.shields.io/badge/Version-2.4.0-black)

Bienvenue sur le dépôt officiel du **Portail Partenaire Uprising Node**. Cette plateforme est la tour de contrôle centrale pour nos partenaires d'élite, conçue pour orchestrer, suivre et amplifier les opérations commerciales B2B à haute fréquence.

![Uprising Node Dashboard](https://placehold.co/1200x600/000000/FFF?text=UPRISING+NODE+INTERFACE)

---

## ⚡ Architecture & Stack Technique

Construit pour la performance, la sécurité et une expérience utilisateur sans friction (Zero-Friction UX).

- **Frontend Core** : [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Langage** : TypeScript 5.9 (Strict Mode enabled)
- **Styling** : [Tailwind CSS v4.0](https://tailwindcss.com/)
- **UI Architecture** : [Shadcn/UI](https://ui.shadcn.com/) + [Tremor](https://www.tremor.so/)
- **Motion** : Motion (ex-Framer Motion)
- **Backend** : NestJS (Modular Monolith)
- **Base de Données** : Prisma ORM + PostgreSQL (via Supabase ou Docker)
- **Sécurité** : Rate Limiting, JWT Auth, Validation Pipes, CORS strict

---

## 🚀 Fonctionnalités Clés

### 1. Tableau de Bord Unifié

Une vue d'aigle sur vos performances. Métriques en temps réel, graphiques d'évolution et indicateurs clés de performance (KPIs) pour un pilotage précis.

### 2. Gestion Avancée des Leads (Scraper)

**Nouveau** : Module de scraping intégré pour l'enrichissement automatique des leads et la détection d'opportunités.

### 3. Navigation Hybride

- **Sidebar Classique** : Pour une navigation structurelle et rapide.
- **Floating Dock** : Interface immersive style MacOS pour un accès fluide aux outils critiques.

### 4. Sécurité & Authentification

- **Flux Complet** : Login, Inscription, Mot de passe oublié, Reset de mot de passe.
- **Protection** : Rate limiting sur les endpoints sensibles (Login: 5 req/min).
- **Validation** : Vérification stricte des entrées (DTOs).

### 5. Simulation de Gains

Calculez vos projections financières instantanément. Données basées sur les leads réels et le statut du compte.

---

## 🛠 Installation & Démarrage (Monorepo)

### Prérequis

- **Node.js 20+**
- **npm** ou **pnpm**

### 1. Installation

Installez toutes les dépendances (API + Web) depuis la racine :

```bash
npm install
```

### 2. Configuration Environnement

Copiez les fichiers d'exemple :

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
```

### 3. Démarrage Rapide

Lancez le Frontend (Next.js) et le Backend (NestJS) en parallèle :

```bash
# Terminal 1
cd api && npm run start:dev

# Terminal 2
cd web && npm run dev
```

- **Web App** : `http://localhost:3000`
- **API** : `http://localhost:3001` (Swagger: `/api`)

---

## 🚀 Déploiement

### Frontend (Netlify / Vercel)

Le dossier `web` est une application Next.js standard prête à être déployée.
Build command: `npm run build`

### Backend (Cloud Run / Vercel / VPS)

L'API est conteneurisable via le `Dockerfile` inclus.
Ports exposés : `3001`

---

## 🎨 Design System

**Uprising Node** utilise une esthétique "Lindy" minimaliste et autoritaire.

- **Typographie** : `SF Pro Display` (System) & `Agmena Pro` (Serif)
- **Couleurs** : Strictement Monochrome.

---

© 2026 Uprising Node. *Confidentiel & Propriétaire.*
