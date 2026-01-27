# UPRISING NODE

> **Infrastructure de Domination Commerciale & Partenariat Stratégique**

Bienvenue sur le dépôt officiel du **Portail Partenaire Uprising Node**. Cette plateforme est la tour de contrôle centrale pour nos partenaires d'élite, conçue pour orchestrer, suivre et amplifier les opérations commerciales B2B à haute fréquence.

![Uprising Node Dashboard](https://placehold.co/1200x600/000000/FFF?text=UPRISING+NODE+INTERFACE)

---

## ⚡ Architecture & Stack Technique

Construit pour la performance, la sécurité et une expérience utilisateur sans friction (Zero-Friction UX).

- **Frontend Core** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : TypeScript (Strict Mode)
- **Styling** : [Tailwind CSS v4.0](https://tailwindcss.com/)
- **UI Library** : [Shadcn/UI](https://ui.shadcn.com/) + [Tremor](https://www.tremor.so/) + [Aceternity](https://ui.aceternity.com/)
- **Motion** : Motion (fka Framer Motion)
- **Backend** : NestJS (API REST) + PostgreSQL
- **Fonts** : SF Pro Display (System) & Agmena Pro (Serif)

---

## 🚀 Fonctionnalités Clés

### 1. Tableau de Bord Unifié

Une vue d'aigle sur vos performances. Métriques en temps réel, graphiques d'évolution et indicateurs clés de performance (KPIs) pour un pilotage précis.

### 2. Navigation Hybride

- **Sidebar Classique** : Pour une navigation structurelle et rapide.
- **Floating Dock (Nouveau)** : Interface immersive style MacOS pour un accès fluide aux outils critiques (activable dans les paramètres).

### 3. Simulation de Gains

Calculez vos projections financières instantanément. Ajustez les variables (TJM, Jours vendus, Commission) et visualisez votre potentiel de revenus.

### 4. Ressources Stratégiques (War Room)

Accès direct aux actifs de vente :

- **Dossier Stratégique (PDF interactif)** : Rapports d'audit et analyses de surface.
- **Scripts de Vente** : Protocoles de closing et traitement des objections.
- **Documentation** : Guides techniques et procédures opérationnelles.

### 5. Collaboration d'Équipe

Gérez votre escouade. Ajoutez des membres, définissez les rôles et configurez les notifications pour rester synchronisé sur chaque opportunité.

---

## 🛠 Installation & Démarrage (Monorepo)

### Prérequis

- **Node.js 20+** (Recommandé)
- **pnpm** (Gestionnaire de paquets principal)

### 1. Installation

Installez toutes les dépendances (API + Web) depuis la racine :

```bash
pnpm install
```

### 2. Démarrage Rapide (Tout-en-un)

Lancez le Frontend (Next.js) et le Backend (NestJS) avec une seule commande :

```bash
npm run dev
# ou
pnpm dev
```

- **Web App** : `http://localhost:3000`
- **API** : `http://localhost:3001`

---

## 🚀 Déploiement

### Frontend (Netlify / Vercel)

Le dossier `web` est une application Next.js standard.

- **Netlify** : Connectez votre repo GitHub, pointez sur le dossier `web`.
- **Vercel** : Créez un nouveau projet, sélectionnez le dossier `web`.

### Backend (Vercel / Cloud)

L'API est configurée pour fonctionner en Serverless ou Standalone.

- **Vercel** : Le fichier `vercel.json` à la racine gère la redirection vers l'API.
- **Docker** : Un `Dockerfile` est disponible pour un déploiement classique.

---

## 🎨 Design System

**Uprising Node** utilise une esthétique "Lindy" minimaliste et autoritaire.

- **Typographie** :
  - *Titres* : `SF Pro Display Bold` (Impact, Modernité)
  - *Corps* : `SF Pro Display Regular` (Lisibilité, Neutralité)
  - *Accents* : `Agmena Pro SemiBold` (Élégance, Autorité)
- **Couleurs** : Strictement Monochrome (Noir, Blanc, Gris de sécurité).

---

## 🔒 Sécurité

- Authentification 2FA prête.
- Logs d'activité détaillés.
- Gestion des sessions sécurisée.

---

© 2024 Uprising Node. *Confidentiel & Propriétaire.*
