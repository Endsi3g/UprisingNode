## 2024-04-17 - SSRF via Puppeteer
**Vulnerability:** Server-Side Request Forgery (SSRF) via `ScraperService` due to missing URL validation before Puppeteer page loading, allowing access to internal resources.
**Learning:** Puppeteer follows HTTP redirects automatically, so validating the initial URL is insufficient.
**Prevention:** Enable request interception and validate every intercepted request URL using `dns.lookup` and `net.isIPv4`, explicitly blocking local and private IP ranges including 0.0.0.0/8 and IPv4-mapped IPv6 addresses.
