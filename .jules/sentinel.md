## 2025-02-12 - SSRF in ScraperService
**Vulnerability:** `ScraperService` accepted arbitrary URLs and passed them to Puppeteer's `page.goto` without validation, allowing access to local network resources (SSRF).
**Learning:** Puppeteer in a serverless/container environment can be used to scan internal networks or access cloud metadata services if not restricted.
**Prevention:** Always validate user-provided URLs. Enforce `http`/`https` protocols and resolve hostnames to check for private/reserved IP addresses before navigation.
