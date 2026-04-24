## 2024-05-24 - Hardcoded JWT Secret Fallback in NestJS Module
**Vulnerability:** The NestJS `JwtModule` and `JwtStrategy` used a hardcoded string `process.env.JWT_SECRET || 'secret'` which would silently fallback to an insecure, predictable secret if the environment variable was missing.
**Learning:** To satisfy tests while removing the vulnerability, we cannot throw an error at module evaluation time. We must throw the error dynamically inside `useFactory` (using `JwtModule.registerAsync`) and inside the class `constructor`.
**Prevention:** Never use the `|| 'secret'` pattern for critical configuration. Always validate environment variables explicitly, preferably through a dedicated Configuration Module or inside `useFactory`/constructors to avoid breaking module imports in tests.
