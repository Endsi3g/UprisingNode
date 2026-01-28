# Feuille de Route : Préparation au Lancement en Production (Uprising Node)

Ce document détaille les étapes techniques et fonctionnelles nécessaires pour faire passer la plateforme **Uprising Node** de l'état de prototype (MVP) à un produit stable, sécurisé et prêt pour la production ("Fully Ready").

---

## 🚨 Priorités Critiques (Bloquants)

Ces éléments doivent être corrigés avant tout déploiement réel.

### 1. Infrastructure de Données (Backend)
- [ ] **Migrer de SQLite vers PostgreSQL** :
  - Actuellement, l'API utilise `file:./dev.db` (SQLite). C'est inadapté pour la production (pas de concurrence, risques de perte de données).
  - **Action** : Provisionner une base PostgreSQL (Supabase, AWS RDS, ou Railway), mettre à jour `schema.prisma` et le `.env`.

### 2. Correction des Bugs Architecturaux (Backend)
- [ ] **Réparer l'Injection de Dépendances (DI)** :
  - Le `DashboardController` dépend de `LeadsService`, mais `LeadsModule` n'est pas importé dans `DashboardModule`. L'application plantera à l'exécution de ces routes.
  - **Action** : Ajouter `LeadsModule` dans les imports de `DashboardModule`.
- [ ] **Activer le Service de Scraping** :
  - Le `ScraperService` existe mais est "orphelin". Il n'est intégré dans aucun module actif de l'application.
  - **Action** : Créer un `ScraperModule` et l'importer dans `AppModule` ou l'intégrer là où il est nécessaire (ex: `LeadsModule`).

### 3. Nettoyage des Données Factices (Frontend & Backend)
- [ ] **Supprimer les Mocks (Frontend)** :
  - `leadsService.getStats` dans `api.service.ts` utilise un `setTimeout` avec des fausses données.
  - **Action** : Connecter à un endpoint réel `/leads/stats`.
- [ ] **Calculs Réels (Backend)** :
  - Dans `DashboardController`, `potentialGains` est codé en dur à `1450`.
  - **Action** : Implémenter la logique de calcul basée sur le `score` ou la valeur des leads en statut "Analyse" ou "Négociation".

---

## 🛠 Robustesse Technique

Pour garantir la stabilité et la maintenabilité.

### 1. Sécurité & Performance
- [ ] **Rate Limiting (Throttler)** :
  - Protéger l'API contre les attaques par force brute (surtout `/auth/login`).
  - **Action** : Installer et configurer `@nestjs/throttler`.
- [ ] **Validation des Données** :
  - S'assurer que `ValidationPipe` est actif globalement avec `{ whitelist: true }` pour rejeter les champs non désirés.
- [ ] **Gestion des Erreurs (Frontend)** :
  - Remplacer les `alert()` (bloquants) par des notifications "Toast" (via la librairie `sonner` déjà installée).
  - Gérer les erreurs 401/403 de manière fluide (redirection propre vers le login).

### 2. Tests (QA)
- [ ] **Tests de bout en bout (E2E)** :
  - Il n'y a pratiquement aucun test.
  - **Action** : Créer un test E2E critique pour le flux : Inscription -> Login -> Affichage Dashboard.

---

## ✨ Complétude des Fonctionnalités

Fonctionnalités visibles dans l'UI mais non implémentées.

### 1. Gestion du Compte
- [ ] **Mot de passe oublié** :
  - Le lien existe sur la page de login mais ne pointe vers rien.
  - **Action** : Créer l'endpoint API d'envoi d'email et la page de réinitialisation.
- [ ] **Statut du Compte** :
  - L'interface affiche "Actif / Vérifié" en dur.
  - **Action** : Baser cet affichage sur les champs `emailVerified` ou `status` de l'utilisateur en base de données.

### 2. Fonctionnalités "Coming Soon"
- [ ] **War Room / Salle de Guerre** :
  - Boutons grisés ("Bientôt disponible").
  - **Action** : Décider si cette feature doit être livrée pour la V1 ou cachée.

---

## 🚀 Plan de Déploiement

1. **Dockerisation** : Créer un `Dockerfile` multi-stage pour le backend NestJS.
2. **CI/CD** : Configurer un pipeline (GitHub Actions) pour lancer les tests et le build à chaque push.
3. **Variables d'Environnement** : Sécuriser les clés (JWT_SECRET, DATABASE_URL) dans le service d'hébergement.

---

Ce plan transforme le projet actuel en une application professionnelle et fiable.
