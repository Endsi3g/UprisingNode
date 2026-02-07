## 2024-05-22 - SSRF in ScraperService
**Vulnerability:** ScraperService blindly accepts URLs and navigates to them, allowing Server-Side Request Forgery (SSRF) attacks against internal services or local files.
**Learning:** External inputs processed by backend services, especially those triggering outbound requests, must be strictly validated.
**Prevention:** Always validate protocol (http/https), resolve hostnames to IP addresses, and check against private/reserved IP ranges before processing URLs.
