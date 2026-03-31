## 2025-01-28 - SSRF in Puppeteer Navigation
**Vulnerability:** Scraper service accepts arbitrary user URLs for Puppeteer to navigate to without validation, creating a Server-Side Request Forgery (SSRF) risk where the server could access internal APIs or cloud metadata endpoints.
**Learning:** URL rewriting in Puppeteer request interception breaks SNI/TLS validation. Simple string matching is insufficient because of complex URL formats.
**Prevention:** Use the `URL` object to strictly parse domains, only allow `http`/`https` protocols, and explicitly block private/internal IP ranges (e.g., `10.x.x.x`, `192.168.x.x`), localhosts, and cloud metadata endpoints (e.g., `169.254.169.254`) before calling `page.goto()`.
