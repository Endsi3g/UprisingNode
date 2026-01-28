# Documentation du Projet Uprising

## 1. Mission
Créer un dashboard performant pour la gestion des leads, des ressources et la collaboration en temps réel.

## 2. Architecture Technique
- **Backend:** NestJS, Socket.io, Prisma, SQLite.
- **Frontend:** Next.js, React Query (ou useEffect), Tailwind.

## 3. Stratégie de Collaboration (Real-time)
Pour permettre le travail en équipe, nous utilisons **Socket.io**.
- **Pipeline:** Les changements de statut des leads sont synchronisés instantanément entre tous les utilisateurs connectés.
- **Mécanisme:** Le backend émet un événement `lead-updated` lorsqu'un lead est modifié. Le frontend écoute cet événement et met à jour son état local.

## 4. Stratégie de Gestion des Assets

### A. Assets Statiques (UI)
- **Emplacement:** `web/public/assets/`
- **Usage:** Logos, icônes, illustrations fixes.
- **Accès:** `/assets/nom-fichier.png` depuis le frontend.

### B. Ressources Dynamiques (Uploads)
- **Objectif:** Permettre aux utilisateurs d'uploader des fichiers (PDF, Docs) liés au modèle `Resource`.
- **Stockage:**
  - Backend: Dossier `api/uploads/` (servi statiquement).
  - Base de données: Table `Resource` stockant l'URL et les métadonnées.
- **Flux:**
  1. Frontend envoie POST `/resources/upload` avec `FormData`.
  2. Backend stocke le fichier et crée l'entrée DB.
  3. Backend renvoie l'objet Resource créé.

## 5. Roadmap Immédiate
- [x] Création de la documentation.
- [ ] Mise en place du WebSocket.
- [ ] Synchro du Pipeline Leads.
- [ ] Système d'upload de fichiers.
