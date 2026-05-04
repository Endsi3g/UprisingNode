## 2025-02-23 - Prevent Weak JWT Secrets
**Vulnerability:** A hardcoded string 'secret' was used as a fallback for the JWT_SECRET environment variable in the authentication module and strategy.
**Learning:** Hardcoded default secrets can easily make it to production environments causing severe security vulnerabilities. We should always fail fast and throw errors during startup/instantiation if critical security variables are missing, instead of using insecure fallbacks.
**Prevention:** Ensure required secrets (like JWT_SECRET, API keys) are strictly verified upon application bootstrap and throw errors if missing rather than falling back to weak values.
