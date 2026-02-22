## 2025-02-22 - [SSRF in Scraper Service]
**Vulnerability:** The `ScraperService` accepted arbitrary URLs and passed them directly to Puppeteer, allowing potential SSRF attacks against internal network resources or local files.
**Learning:** Even "internal" tools like scrapers need rigorous input validation. Libraries like Puppeteer are powerful but dangerous if given untrusted input. Redirects are a common bypass for SSRF filters.
**Prevention:** Always validate URLs against an allowlist of protocols and block private IP ranges by resolving the hostname. Crucially, use request interception (`page.setRequestInterception(true)`) to validate *every* request, including redirects, to prevent bypasses.
