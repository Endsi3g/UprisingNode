## 2025-02-05 - Hardcoded Secrets Fallback
**Vulnerability:** The `JwtModule` and `JwtStrategy` used `process.env.JWT_SECRET || 'secret'` as a fallback.
**Learning:** Hardcoded secrets as fallback values are dangerous because they fail open. If the environment variable is missing in production, the app silently uses a weak, guessable secret.
**Prevention:** Always fail closed. Throw an error if a required secret is missing during application startup. Use `ConfigService` with validation.

## 2025-02-09 - SSRF in ScraperService
**Vulnerability:** The `ScraperService` accepted arbitrary URLs and passed them to Puppeteer without validation.
**Learning:** Server-Side Request Forgery (SSRF) can allow attackers to access internal network resources (like AWS metadata, localhost services) by tricking the server into making requests on their behalf.
**Prevention:** Validate input URLs (protocol whitelist). Use DNS resolution to check the target IP address and block private/reserved ranges before making the request.
