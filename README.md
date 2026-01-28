# UPRISING NODE

> **Infrastructure de Domination Commerciale & Partenariat Stratégique**

Bienvenue sur le dépôt officiel du **Portail Partenaire Uprising Node**. Cette plateforme est la tour de contrôle centrale pour nos partenaires d'élite.

---

## ⚡ Architecture & Stack Technique

**Frontend (Web)**
- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS v4.0 + Shadcn/UI
- **State** : React Hooks + Context
- **Deployment** : Vercel / Netlify

**Backend (API)**
- **Framework** : NestJS (API REST)
- **Database** : SQLite (via Prisma ORM)
- **Authentication** : JWT (Global Guard)
- **Validation** : Class-Validator + Global Pipes

---

## 🛠 Installation & Démarrage

Ce projet est un Monorepo géré par `pnpm`.

### 1. Prérequis

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 2. Installation

Installez les dépendances à la racine :

```bash
pnpm install
```

### 3. Configuration

Le backend utilise SQLite par défaut (`api/prisma/dev.db`). Aucune configuration complexe n'est requise pour la base de données en développement.

Pour la sécurité, vous pouvez créer un fichier `.env` dans `api/`:

```env
JWT_SECRET=votre_secret_tres_long
PORT=3000
```

### 4. Démarrage (Dev)

Lancez tout le projet (API + Web) en une commande :

```bash
pnpm dev
```

- **Web App** : `http://localhost:3001`
- **API** : `http://localhost:3000`

---

## 📚 API Documentation

### Authentification

- `POST /auth/register` : Créer un compte.
  - Body: `{ email, password, name }`
- `POST /auth/login` : Se connecter.
  - Body: `{ email, password }`
  - Response: `{ access_token, user }`

### Leads

- `GET /leads` : Liste des leads de l'utilisateur.
- `POST /leads` : Créer un nouveau lead.
  - Body: `{ url }`
- `GET /leads/stats` : Statistiques agrégées (Balance, Leads Actifs, Croissance).

---

## 🚀 Déploiement

### Backend (Docker / VPS)

Le backend est une application NestJS standard.

1. **Build** : `pnpm --filter api build`
2. **Prisma** : `cd api && npx prisma migrate deploy`
3. **Start** : `node dist/main`

**Docker** :

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY api/package*.json ./api/
RUN pnpm install --prod
COPY api ./api
RUN cd api && npx prisma generate && pnpm build
CMD ["node", "api/dist/main"]
```

### Frontend (Vercel)

1. Connectez votre dépôt Git à Vercel.
2. Configurez le **Root Directory** sur `web`.
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_API_URL` : URL de votre backend déployé (ex: `https://api.example.com`).

---

## 🧪 Tests

Le projet inclut des tests unitaires pour le backend.

```bash
cd api
pnpm test
```

---

© 2024 Uprising Node. *Confidentiel & Propriétaire.*
