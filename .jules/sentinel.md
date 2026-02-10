# Sentinel's Journal

## 2024-02-11 - [CRITICAL] Hardcoded JWT Secret Fallback
**Vulnerability:** The application was configured to use a hardcoded string "secret" if the `JWT_SECRET` environment variable was missing.
**Learning:** Default values for critical secrets (even as fallbacks) are dangerous because they can be easily overlooked during deployment, leaving the application vulnerable to token forgery.
**Prevention:** Always use `ConfigService.getOrThrow()` or explicit validation to ensure critical secrets are provided by the environment. Fail fast if they are missing.
