## 2025-02-14 - SSRF in ScraperService
**Vulnerability:** The `ScraperService.scrapeCompany` method accepted arbitrary URLs without validation, allowing Server-Side Request Forgery (SSRF).
**Learning:** Puppeteer's `page.goto` follows redirects and can access internal network resources (localhost, private IPs) if not restricted.
**Prevention:** Validate protocol (http/https), resolve hostname to IP, and check against private IP ranges. Use `page.setRequestInterception` to block requests to private IPs during navigation.
