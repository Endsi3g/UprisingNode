## 2025-02-14 - Scraper SSRF Vulnerability
**Vulnerability:** Scraper service accepted arbitrary URLs, allowing Server-Side Request Forgery (SSRF) to localhost and private IPs.
**Learning:** External URL fetching services must validate the destination IP, not just the URL string, to prevent access to internal infrastructure.
**Prevention:** Use a `validateUrl` method that resolves DNS and checks against private IP ranges before initiating requests. Added `validateUrl` pattern in `ScraperService`.
