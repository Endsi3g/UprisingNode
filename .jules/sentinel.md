## 2026-02-17 - [SSRF in Puppeteer Service]
**Vulnerability:** Unrestricted URL access in `ScraperService` allowing SSRF attacks against internal network resources (localhost, AWS metadata).
**Learning:** Puppeteer by default follows redirects and accesses any URL given to it. Validating the URL *before* passing it to Puppeteer is crucial, but DNS rebinding remains a theoretical risk without a forward proxy.
**Prevention:** Implement strict URL validation including protocol checks and DNS resolution to block private/reserved IP ranges.
