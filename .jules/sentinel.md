## 2024-03-22 - Predictable JWT Token Generation

**Vulnerability:** The application used a hardcoded fallback (`'secret'`) for the JWT secret if the `JWT_SECRET` environment variable was missing. This would allow an attacker to sign their own tokens and completely bypass authentication if the environment variable was ever omitted.

**Learning:** This is a common "fail-open" pattern. Systems should "fail-secure" instead. If a critical security configuration like a secret is missing, the application should crash/refuse to start rather than fallback to an insecure default.

**Prevention:** Always validate critical environment variables at startup and throw an error if they are missing. Avoid `|| 'fallback_secret'` patterns for any cryptographic or security-related keys.
