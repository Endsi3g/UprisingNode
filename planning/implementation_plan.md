# Implementation Plan - Uprising Node Dashboard V1

The goal is to transform a static design export (approx. 50 screens in `stitch_uprising_node_dashboard_v1`) into a fully functional, data-driven web application using the existing Next.js (Frontend) and NestJS (Backend) monorepo structure.

## User Review Required

> [!IMPORTANT]
> **Scope Strategy**: There are over 50 screens to migrate. This plan focuses on setting up the **Core Systems** (Auth, Database, Layouts) and migrating a pilot set of screens (e.g., Authentication & Dashboard Home) to establish the pattern. Subsequent tasks will batch-process the remaining screens.

> [!NOTE]
> **Source Format**: The source consists of raw HTML/CSS exports. We will need to manually extract layout patterns and convert them into reusable React/Tailwind components to ensure maintainability, rather than just copying specific HTML files.

## Proposed Architecture

### 1. Database & Data Modeling (Backend)

- **ORM**: Prisma
- **Database**: PostgreSQL (presumed based on standard Prisma usage, need to verify connection string in `.env`).
- **Core Models**:
  - `User`: Auth mechanics, profile info.
  - `Node`: The core entity being managed (implied by "Uprising Node").
  - `Transaction`: Financials/stats.
  - `Settings`: User preferences.

### 2. Backend API (NestJS)

- **Auth Module**: JWT-based authentication (Login, Register, Refresh Token, Forgot Password).
- **Users Module**: Profile management.
- **Dashboard Module**: Aggregated stats and node data.
- **Guards**: `JwtAuthGuard` applied globally or per-controller.

### 3. Frontend Architecture (Next.js 16 + React 19)

- **Design System**:
  - Port styles from `code.html` to `globals.css` / Tailwind Config.
  - Normalize typography (Agmena Pro, SF Pro) - *Fonts found in source root*.
- **Routing**: App Router (`src/app`).
  - `(auth)/signin`, `(auth)/signup`
  - `(dashboard)/layout.tsx` -> Main dashboard shell (Sidebar, Header).
  - `(dashboard)/page.tsx` -> Home.
- **State Management**:
  - `AuthContext`: Manage session tokens and user state.
  - React Query (`@tanstack/react-query`) for server state.

## Implementation Steps

### Phase 1: Foundation & Assets

1. **Font Setup**: Configure `next/font` with the local fonts (`Agmena Pro`, `SF Pro`).
2. **Global Styles**: Analyze `code.html` CSS and update `tailwind.config.ts` / `globals.css`.
3. **Component Primitives**: Create base components (Button, Input, Card) matching the design.

### Phase 2: Backend Core

1. **Prisma Schema**: Define `User` and `Node` tables.
2. **Auth API**: Implement `AuthController` (login/register endpoints).

### Phase 3: Authentication Flow (Frontend)

1. **Auth Pages**: Create `/signin` and `/signup` pages using the design assets.
2. **Integration**: Connect forms to NestJS Auth API.

### Phase 4: Dashboard Shell & Home

1. **Dashboard Layout**: Implement the persistent Sidebar and Header.
2. **Home Page**: Implement the main dashboard view.

## Verification Plan

### Automated Tests

- **Backend E2E**: Run `npm run test:e2e` in `api` specific to Auth flow.
- **Frontend Build**: `npm run build` in `web` to ensure type safety.

### Manual Verification

1. **Start Services**:
    - `cd api && npm run start:dev`
    - `cd web && npm run dev`
2. **Auth Flow**:
    - Go to `localhost:3000/signup`, create account.
    - Verify redirect to Dashboard.
    - Check database for new user.
3. **UI Check**:
    - Compare `localhost:3000` against `screen.png` from source folders (e.g., `v2_1`).
