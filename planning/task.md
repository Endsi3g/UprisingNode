# Task Checklist - Uprising Node Dashboard

## Phase 1: Foundation & Assets

- [ ] **Asset Migration**
  - [ ] Copy Fonts (Agmena Pro, SF Pro) to `web/public/fonts` <!-- id: 100 -->
  - [ ] Configure `next/font` in `web/src/app/layout.tsx` <!-- id: 101 -->
- [ ] **Design System Setup**
  - [ ] Analyze `code.html` from `v2_1` for color palette and layout tokens <!-- id: 102 -->
  - [ ] Update `web/app/globals.css` and `tailwind.config.ts` <!-- id: 103 -->

## Phase 2: Backend Core (API)

- [ ] **Database Setup**
  - [ ] Define `User` model in `api/prisma/schema.prisma` <!-- id: 200 -->
  - [ ] Run migration: `npm run prisma:migrate` <!-- id: 201 -->
- [ ] **Auth Module**
  - [ ] Verify/Update `auth.service.ts` for registration logic <!-- id: 202 -->
  - [ ] Ensure `AuthController` exposes `login` and `register` <!-- id: 203 -->

## Phase 3: Authentication Flow (Web)

- [ ] **Auth Components**
  - [ ] Create `AuthLayout` (if distinct from main layout) <!-- id: 300 -->
  - [ ] Implement `LoginForm` component <!-- id: 301 -->
  - [ ] Implement `RegisterForm` component <!-- id: 302 -->
- [ ] **Auth Pages**
  - [ ] Create `app/(auth)/login/page.tsx` <!-- id: 303 -->
  - [ ] Create `app/(auth)/register/page.tsx` <!-- id: 304 -->

## Phase 4: Dashboard Core (Web)

- [ ] **Layout Implementation**
  - [ ] Analyze Sidebar/Navigation from designs <!-- id: 400 -->
  - [ ] Create `Sidebar` component <!-- id: 401 -->
  - [ ] Create `TopNav` component <!-- id: 402 -->
  - [ ] Implement `app/(dashboard)/layout.tsx` <!-- id: 403 -->
- [ ] **Dashboard Home**
  - [ ] Migrate Main Dashboard Content (from `v2_1` or equivalent) <!-- id: 404 -->

## Phase 5: Expansion (Iterative)

- [ ] Map remaining source folders to routes <!-- id: 500 -->
- [ ] Implement User Settings <!-- id: 501 -->
