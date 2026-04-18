## 2025-04-18 - SSRF Vulnerability in Puppeteer Scraper
**Vulnerability:** Server-Side Request Forgery (SSRF) allowed in ScraperService due to lack of network-level URL validation.
**Learning:** Validating the initial user-provided URL is insufficient to prevent SSRF because Puppeteer automatically follows HTTP redirects to internal or cloud metadata IPs.
**Prevention:** Enable `page.setRequestInterception(true)` and use an asynchronous validation function with `dns.lookup` to verify every intercepted request URL within the `page.on('request')` listener, explicitly blocking loopback, private, and cloud metadata ranges.
