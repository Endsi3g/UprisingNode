# Task Checklist - Uprising Node Dashboard

## Phase 1: Foundation & Assets (Completed)

- [x] **Asset Migration**
  - [x] Copy Fonts (Agmena Pro, SF Pro) to `web/public/fonts` <!-- id: 100 -->
  - [x] Configure `next/font` in `web/src/app/layout.tsx` <!-- id: 101 -->
- [x] **Design System Setup**
  - [x] Analyze `code.html` from `v2_1` for color palette and layout tokens <!-- id: 102 -->
  - [x] Update `web/app/globals.css` and `tailwind.config.ts` <!-- id: 103 -->

## Phase 2: Backend Core (API) (Completed)

- [x] **Database Setup**
  - [x] Define `User` model in `api/prisma/schema.prisma` <!-- id: 200 -->
  - [x] Run migration: `npm run prisma:migrate` <!-- id: 201 -->
- [x] **Auth Module**
  - [x] Verify/Update `auth.service.ts` for registration logic <!-- id: 202 -->
  - [x] Ensure `AuthController` exposes `login` and `register` <!-- id: 203 -->

## Phase 3: Authentication Flow (Web) (Completed)

- [x] **Auth Components**
  - [x] Create `AuthLayout` (if distinct from main layout) <!-- id: 300 -->
  - [x] Implement `LoginForm` component <!-- id: 301 -->
  - [x] Implement `RegisterForm` component <!-- id: 302 -->
- [x] **Auth Pages**
  - [x] Create `app/(auth)/login/page.tsx` <!-- id: 303 -->
  - [x] Create `app/(auth)/register/page.tsx` <!-- id: 304 -->

## Phase 4: Dashboard Core (Web) (In Progress)

- [x] **Layout Implementation**
  - [x] Analyze Sidebar/Navigation from designs <!-- id: 400 -->
  - [x] Create `Sidebar` component <!-- id: 401 -->
  - [x] Create `TopNav` component <!-- id: 402 -->
  - [x] Implement `app/(dashboard)/layout.tsx` <!-- id: 403 -->
- [x] **Dashboard Home**
  - [x] Migrate Main Dashboard Content (from `v2_1` or equivalent) <!-- id: 404 -->

## Phase 5: Expansion & Refinement (Next Steps)

- [ ] **Data Integration**
    - [ ] Update `Lead` model in Prisma to include `value` <!-- id: 501 -->
    - [ ] Implement `getStats` endpoint in API <!-- id: 502 -->
    - [ ] Connect Pipeline page to real API data <!-- id: 503 -->
    - [ ] Connect Dashboard stats to real API data <!-- id: 504 -->
- [ ] **Pipeline Improvements**
    - [ ] Implement Drag & Drop persistance <!-- id: 505 -->
- [ ] **Navigation**
    - [ ] Add Pipeline link to Sidebar <!-- id: 506 -->
