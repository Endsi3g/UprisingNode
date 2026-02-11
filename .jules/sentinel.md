## 2026-02-11 - [Insecure Default JWT Secret]
**Vulnerability:** The application used a hardcoded fallback secret 'secret' if `JWT_SECRET` was not provided in the environment. This allowed attackers to forge tokens if the environment variable was missing.
**Learning:** Default values for critical security configuration (like secrets) can lead to insecure deployments if configuration management fails.
**Prevention:** Always use strict configuration validation. Throw errors if critical secrets are missing instead of falling back to defaults. Use `ConfigService` or similar tools to enforce this.
