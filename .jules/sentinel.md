## 2024-03-21 - SSRF Vulnerability in Scraper Service
**Vulnerability:** Server-Side Request Forgery (SSRF) risk in `ScraperService` where user-provided URLs were directly passed to Puppeteer without validation, allowing access to private IP ranges and cloud metadata endpoints.
**Learning:** Puppeteer's `page.goto` follows URLs exactly as provided. URL rewriting in request interception breaks SNI/TLS validation. Lightweight URL string validation before navigation is required for safe scraping.
**Prevention:** Always validate user-provided URLs against an allowlist of protocols (`http/https`) and block known private/internal IP ranges (e.g., `127.0.0.1`, `169.254.169.254`) before initiating any outbound network requests from the server.
