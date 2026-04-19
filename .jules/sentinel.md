## 2024-05-23 - Puppeteer SSRF via Redirects
**Vulnerability:** ScraperService allowed Server-Side Request Forgery (SSRF) because it only loaded user-provided URLs without validating internal network access, exposing cloud metadata and local endpoints.
**Learning:** Validating just the initial `goto` URL is insufficient because Puppeteer automatically follows HTTP redirects. A safe URL can redirect to `169.254.169.254` or `localhost`.
**Prevention:** Enable request interception (`page.setRequestInterception(true)`) and validate every single request URL inside the `page.on('request')` event listener. Block loopback, private IPv4/IPv6, and 0.0.0.0/8 networks.
