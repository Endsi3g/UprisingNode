## 2024-04-21 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** The application used a hardcoded fallback string ('secret') for the JWT secret if the environment variable was undefined.
**Learning:** Hardcoded fallbacks in authentication modules can lead to environments unintentionally using widely known, predictable secrets, resulting in critical authentication bypass vulnerabilities.
**Prevention:** Always enforce that critical secrets like JWT_SECRET are explicitly provided in the environment. Throw an Error on startup if they are missing to prevent the app from booting in an insecure state.
