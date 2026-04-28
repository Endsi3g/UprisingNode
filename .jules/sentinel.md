## 2024-04-28 - Hardcoded JWT Secret Vulnerability
**Vulnerability:** A hardcoded default secret ('secret') was used for JWT signing and verification when `process.env.JWT_SECRET` was undefined.
**Learning:** Hardcoded secrets in fallback configurations can lead to critical authorization bypass if environment variables fail to load. NestJS modules must be defensively configured using `registerAsync` to throw errors on missing critical variables rather than defaulting to unsafe values.
**Prevention:** Use `JwtModule.registerAsync` and explicitly validate environment variables within factories and constructors, throwing an error if missing. Never use fallback strings for cryptographic secrets.
