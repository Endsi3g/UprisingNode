## 2024-05-24 - Hardcoded JWT Secret Fallback
**Vulnerability:** JWT Module and Passport Strategy used a hardcoded fallback (`'secret'`) if the `JWT_SECRET` environment variable was missing.
**Learning:** Hardcoded fallbacks for JWT secrets bypass environment misconfigurations and can lead to token forgery if the environment variable fails to load. NestJS module initialization should throw an error via `useFactory` or `constructor` rather than silently using an insecure default.
**Prevention:** Always validate environment variables at module initialization and fail securely if missing, never falling back to a hardcoded string.
