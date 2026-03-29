## YYYY-MM-DD - Initial
**Vulnerability:** None
**Learning:** None
**Prevention:** None

## 2025-02-28 - SSRF via Puppeteer Navigation
**Vulnerability:** Server-Side Request Forgery (SSRF) allowed the `ScraperService` to navigate headless Chrome to internal metadata APIs (`169.254.169.254`), `localhost`, and internal IPv4 ranges, which could leak internal network infrastructure or sensitive cloud metadata to malicious users providing arbitrary URLs.
**Learning:** Puppeteer does not enforce network boundaries. An attacker supplying internal IP addresses in the `url` parameter can cause the application server to perform unauthorized internal HTTP requests via Chrome.
**Prevention:** Implement an `isSafeUrl` function to parse the domain using the `URL` object prior to navigating. Enforce allowed schemes (`http/https`), block loopback devices, block private IPv4 address spaces (`10.x.x.x`, `172.16.x.x`, `192.168.x.x`), and reject cloud metadata endpoints.
