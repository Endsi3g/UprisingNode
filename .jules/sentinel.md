## 2024-05-22 - NestJS Config Loading Timing
**Vulnerability:** Hardcoded JWT secret fallback in `JwtModule.register`.
**Learning:** `process.env` may not be populated when module decorators are evaluated if relying on `ConfigModule` to load `.env`. `JwtModule.register` executes at import time, potentially before `ConfigModule` loads the environment.
**Prevention:** Always use `JwtModule.registerAsync` (or other `registerAsync` methods) and inject `ConfigService` to ensure configuration is loaded before use.
