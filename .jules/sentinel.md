## 2024-02-05 - Hardcoded JWT Secret Fallback
**Vulnerability:** The `JwtStrategy` used a hardcoded fallback secret `'secret'` when `JWT_SECRET` was missing.
**Learning:** Even with environment variables, default fallbacks can lead to insecure deployments if configuration is missed.
**Prevention:** Always validate critical configuration (like secrets) at startup and fail fast (throw error) if missing, rather than falling back to weak defaults.
