## 2025-05-03 - [Remove hardcoded JWT fallback secrets]
**Vulnerability:** The application used a hardcoded fallback string ('secret') for JWT secret if the environment variable was missing, which is highly insecure in production.
**Learning:** Using default fallback values for critical cryptographic secrets entirely bypasses the intended environment-based security architecture and leaves the system open to trivial token forgery.
**Prevention:** Explicitly throw errors during application or module initialization if critical environment variables are missing, forcing fail-secure behavior rather than silent degradation.
