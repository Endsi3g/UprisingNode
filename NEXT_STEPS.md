# NEXT STEPS: Road to Production (Fully Proof)

This document outlines the precise technical steps required to transition **Uprising Node** from its current MVP state to a fully production-ready ("Fully Proof") application.

**Priorities:**
1.  **Stability & Security** (Architecture, Database, Protection)
2.  **Data Integrity** (Real Data, Real Math, No Mocks)
3.  **Features** (Completing the roadmap)
4.  **Testing & Deployment** (CI/CD, Hosting)

---

## Phase 1: Critical Stabilization (Immediate Action)

*Goal: Ensure the application runs without crashing and is secure against basic attacks.*

### 1.1 Fix Architectural Bugs (Backend)
The `DashboardModule` is currently broken due to missing dependency injection.
- **Action**: In `api/src/dashboard/dashboard.module.ts`, add `LeadsModule` to the `imports` array.
- **Why**: `DashboardController` relies on `LeadsService`, which is exported by `LeadsModule`.

### 1.2 Migrate to PostgreSQL
SQLite (`dev.db`) is not suitable for production concurrency or persistence on serverless/container platforms.
- **Action**:
    1.  Provision a PostgreSQL database (e.g., Railway, Supabase, or local Docker for dev).
    2.  Update `api/prisma/schema.prisma`: Change `provider = "sqlite"` to `"postgresql"`.
    3.  Update `api/.env`: Set `DATABASE_URL` to the connection string.
    4.  Run `npx prisma migrate dev --name init_postgres`.

### 1.3 Implement Security Layers
Protect the API from abuse and invalid data.
- **Action**:
    1.  **Rate Limiting**:
        - Install `@nestjs/throttler`.
        - Import `ThrottlerModule.forRoot()` in `AppModule` (Limit: 10 reqs/60s).
        - Apply `@UseGuards(ThrottlerGuard)` globally or on `AuthController`.
    2.  **Validation**:
        - Ensure `ValidationPipe` is enabled in `main.ts` with `{ whitelist: true, forbidNonWhitelisted: true }`.

---

## Phase 2: Data Integrity & Automation

*Goal: Replace all fake data with real database queries and automated logic.*

### 2.1 Wire the Scraper Service (Event-Driven)
The `ScraperService` is currently "orphan". It needs to run automatically when a lead is created.
- **Action**:
    1.  Install `@nestjs/event-emitter`.
    2.  Import `EventEmitterModule.forRoot()` in `AppModule`.
    3.  **In `LeadsService.create`**: Emit an event `lead.created` with the new Lead ID.
    4.  **In `LeadsService` (or a new `ScraperListener`)**: Listen for `lead.created`, call `ScraperService.scrapeCompany(url)`, and update the `Lead` entity with the results (Title, Description).

### 2.2 Remove Frontend Mocks
The frontend is lying to the user about data.
- **Action**: Update `web/src/services/api.service.ts`:
    1.  **`leadsService.getStats`**: Remove `setTimeout` and mock object. Make a real `api.get('/leads/stats')` call.
    2.  **`usersService.getPartnerDetails`**: Implement the backend endpoint `/users/:id/details` or use the existing profile logic.

### 2.3 Implement Real Dashboard Math (Backend)
The backend returns hardcoded numbers.
- **Action**: Update `api/src/dashboard/dashboard.controller.ts`:
    1.  **`potentialGains`**: Calculate this dynamically.
        - *Formula*: Sum of `value` (or `score` * multiplier) for all leads in status `AUDIT` or `PITCH`.
    2.  **`riskScore`**: Instead of returning "En attente", return the actual `score` field from the database.

### 2.4 Scheduled Scraper (Cron Job)
Keep data fresh by re-scraping periodically.
- **Action**:
    1.  Install `@nestjs/schedule` and `@types/cron`.
    2.  Import `ScheduleModule.forRoot()` in `AppModule`.
    3.  Create a Cron job (e.g., every Sunday at midnight) that finds all active leads and re-runs the scraper.

---

## Phase 3: Feature Completion

*Goal: Deliver the "Coming Soon" promises.*

### 3.1 Password Reset Flow
- **Action**:
    1.  **Backend**: Add `POST /auth/forgot-password` (generates token, sends email via Nodemailer/Resend) and `POST /auth/reset-password`.
    2.  **Frontend**: Create the `/forgot-password` and `/reset-password` pages.

### 3.2 War Room / Resources
- **Action**:
    1.  Populate the `Resource` table in Prisma with initial data (PDFs, Scripts).
    2.  Create a `ResourcesController` to serve these files (or presigned URLs if using S3).

---

## Phase 4: Production Hygiene

*Goal: Prepare for "Day 1" Launch.*

### 4.1 Testing
- **Action**:
    1.  **Unit Tests**: Fix `jest` configuration in `api` to work with the codebase. Write tests for `LeadsService`.
    2.  **E2E Tests**: Write a Cypress or Playwright test for the "Critical Path": Login -> Dashboard -> Add Lead.

### 4.2 Deployment Strategy
- **Frontend**: Deploy to **Netlify**.
    - Build Command: `npm run build`
    - Publish Directory: `.next` (or use Netlify Next.js plugin).
- **Backend**: Deploy to **Railway** or **Fly.io** (Docker).
    - *Why not Netlify Functions?* Puppeteer (Chrome) is too heavy for standard serverless functions (50MB limit) and often times out (10s limit). A Docker container is required for reliable scraping.
    - Create a `Dockerfile` in `api/` that installs Chrome dependencies.

---

## Execution Order

1.  **Step 1**: Fix DI Bug & Install Dependencies (`throttler`, `schedule`, `event-emitter`).
2.  **Step 2**: Setup PostgreSQL locally & Run Migrations.
3.  **Step 3**: Implement Scraper Logic & Remove Mocks.
4.  **Step 4**: Deploy to Staging (Netlify + Railway).
