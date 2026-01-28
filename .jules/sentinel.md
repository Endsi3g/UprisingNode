## 2026-01-28 - Missing Global Validation
**Vulnerability:** The NestJS application defined DTOs with validation decorators but failed to enable the global `ValidationPipe`.
**Learning:** Decorators alone are insufficient; the execution context (Pipe) must be explicitly enabled. This is a common "silent failure" configuration in NestJS.
**Prevention:** Always verify `app.useGlobalPipes` or `APP_PIPE` provider in `AppModule` when auditing NestJS apps.
