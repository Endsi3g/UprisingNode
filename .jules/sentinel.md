# Sentinel's Journal

## 2024-05-24 - Hardcoded JWT Secret Fallback
**Vulnerability:** The `AuthModule` and `JwtStrategy` used a hardcoded fallback `'secret'` when `JWT_SECRET` environment variable was missing. This meant that if the environment variable was forgotten in production, the application would be vulnerable to token forgery using the known default secret.
**Learning:** Default values for sensitive secrets (like 'secret' or 'changeme') provide a false sense of security and can silently introduce critical vulnerabilities if configuration is missed.
**Prevention:** Always enforce the presence of sensitive configuration values. Throw an error during startup if they are missing, rather than falling back to a weak default. Use `ConfigService` with validation or explicit checks.
