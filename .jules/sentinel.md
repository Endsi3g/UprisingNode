## 2024-05-22 - NestJS Config Loading Timing
**Vulnerability:** Hardcoded JWT secret fallback in `JwtModule.register`.
**Learning:** `process.env` may not be populated when module decorators are evaluated if relying on `ConfigModule` to load `.env`. `JwtModule.register` executes at import time, potentially before `ConfigModule` loads the environment.
**Prevention:** Always use `JwtModule.registerAsync` (or other `registerAsync` methods) and inject `ConfigService` to ensure configuration is loaded before use.

## 2024-05-22 - CI Linting Strictness
**Vulnerability:** Build failures due to strict linting rules (`no-unsafe-*`) in CI pipeline.
**Learning:** The CI pipeline runs `npm run lint` which enforces stricter rules than local development might suggest if not run consistently. `req.user` access in NestJS controllers is a common source of these errors because `req` is often typed as `any`.
**Prevention:** Run `npm run lint` locally before pushing. Use `eslint-disable` sparingly and specifically for lines involving `req.user` or legacy untyped libraries, or improve typing using custom decorators for user extraction.
