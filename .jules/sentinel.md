## 2024-05-02 - Enforce Strict JWT Secrets
**Vulnerability:** Hardcoded JWT secret fallbacks (e.g., `process.env.JWT_SECRET || 'secret'`) expose the application to trivial token forgery if the environment variable is misconfigured.
**Learning:** Throwing an error at the file evaluation level breaks test suite imports. Using `JwtModule.registerAsync` with a `useFactory` function, and validating inside the `JwtStrategy` constructor, allows strict secret validation at runtime/bootstrap without breaking module-level testing.
**Prevention:** Always validate critical environment variables at application/module bootstrap rather than file evaluation, and never use weak string fallbacks for cryptographic keys.
