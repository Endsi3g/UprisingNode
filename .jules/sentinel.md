## 2024-05-24 - Puppeteer SSRF Protection
**Vulnerability:** Scraper services using headless browsers like Puppeteer are vulnerable to Server-Side Request Forgery (SSRF) if they only validate the initial URL. Redirects (3xx) can bypass initial checks, allowing access to internal resources (e.g., localhost, metadata services).
**Learning:** `page.goto(url)` follows redirects by default. Validating only the input `url` is insufficient security theater.
**Prevention:** Implement `page.setRequestInterception(true)` and validate *every* request URL in the `page.on('request')` handler. This ensures all redirects and sub-resource requests are checked against the allowlist/blocklist.
