## 2024-05-15 - Hardcoded Fallback JWT Secret
**Vulnerability:** A hardcoded default secret was used for JWT signing and verification (`process.env.JWT_SECRET || 'secret'`).
**Learning:** Hardcoded default secrets are a critical vulnerability. Throwing an error at the module or constructor level is the best way to enforce environment variable checks without breaking tests due to module evaluation.
**Prevention:** Always use `process.env` directly without fallbacks for sensitive values. Use `JwtModule.registerAsync` to enforce validation in the factory.
