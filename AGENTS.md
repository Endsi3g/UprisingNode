# Instructions pour les Agents AI

Ce fichier définit les règles et conventions à suivre pour travailler sur ce projet.

## 1. Vue d'ensemble
Ce projet est un dashboard pour "Uprising", utilisant :
- **Backend:** NestJS (Port 3000)
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Shadcn/UI (Port 3001)
- **Base de données:** SQLite avec Prisma ORM

## 2. Conventions de Code

### Backend (NestJS)
- **Modularité:** Respecter l'architecture modulaire de NestJS. Chaque fonctionnalité majeure doit avoir son propre module.
- **DTOs:** Toujours utiliser des DTOs avec `class-validator` pour valider les entrées.
- **Tests:** Écrire des tests unitaires (`.spec.ts`) pour chaque service.
- **Logs:** Utiliser le `Logger` de NestJS, pas `console.log`.

### Frontend (Next.js)
- **Client vs Server Components:** Utiliser `'use client'` uniquement lorsque nécessaire (hooks, interactivité).
- **Architecture:**
  - `components/ui`: Composants de base (Shadcn).
  - `components/{feature}`: Composants spécifiques métier.
  - `app/(dashboard)`: Routes protégées du dashboard.
- **Styles:** Utiliser Tailwind CSS. Éviter le CSS pur sauf exception.

## 3. Gestion des Données
- **Prisma:** Ne jamais modifier `schema.prisma` sans créer une migration (`npx prisma migrate dev`).
- **Base de données:** SQLite est utilisée. Le fichier `dev.db` ne doit jamais être commité.

## 4. Fonctionnalités Spécifiques
- **Temps Réel:** Utiliser `Socket.io` via `EventsGateway`. Émettre des événements pour la synchro (ex: pipeline leads).
- **Assets:** Les images statiques vont dans `web/public/assets`. Les fichiers uploadés (PDF, etc.) sont gérés par le module `Resources` et stockés localement (pour le MVP).

## 5. Tests et Vérification
- Avant de soumettre, toujours vérifier que le code compile (`npm run build` ou `pnpm build`).
- Vérifier les dépendances circulaires.
