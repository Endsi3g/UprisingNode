## 2025-02-12 - Scraper SSRF Vulnerability
**Vulnerability:** The `ScraperService` accepted arbitrary URLs and passed them directly to Puppeteer without validation. This allowed potential Server-Side Request Forgery (SSRF) attacks where an attacker could access internal services (localhost, private IPs, cloud metadata services).
**Learning:** Puppeteer (and other headless browsers) do not inherently block access to local/private networks. Explicit validation of the target URL is required before navigation.
**Prevention:** Always validate user-provided URLs. Ensure the protocol is HTTP/HTTPS. Resolve the hostname to an IP address and check against a list of private/reserved IP ranges (IPv4 and IPv6) before allowing the request.
