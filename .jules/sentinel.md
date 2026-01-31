# Sentinel Security Journal

## 2025-05-27 - Hardcoded JWT Secret Fallback
**Vulnerability:** `AuthModule` and `JwtStrategy` defaulted to `'secret'` if `JWT_SECRET` env var was missing.
**Learning:** Convenience fallbacks for secrets ("it just works") create silent failures where production apps run insecurely without anyone noticing.
**Prevention:** Strictly enforce secret presence at startup. Throw errors instead of falling back to insecure defaults.
