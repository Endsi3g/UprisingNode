## 2025-02-05 - Hardcoded Secrets Fallback
**Vulnerability:** The `JwtModule` and `JwtStrategy` used `process.env.JWT_SECRET || 'secret'` as a fallback.
**Learning:** Hardcoded secrets as fallback values are dangerous because they fail open. If the environment variable is missing in production, the app silently uses a weak, guessable secret.
**Prevention:** Always fail closed. Throw an error if a required secret is missing during application startup. Use `ConfigService` with validation.
