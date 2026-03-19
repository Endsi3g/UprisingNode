## YYYY-MM-DD - [SSRF vulnerability in ScraperService]
**Vulnerability:** ScraperService does not validate URLs before navigating with Puppeteer, allowing Server-Side Request Forgery (SSRF) and access to internal network resources.
**Learning:** Puppeteer needs strict URL validation to prevent navigating to local IPs or sensitive internal services.
**Prevention:** Implement an `isSafeUrl` check that enforces `http/https` protocols and blocks private IP ranges before calling `page.goto()`.
