## 2026-02-02 - [SSRF in Puppeteer Scraper]
**Vulnerability:** Unvalidated URL input in `ScraperService` allowed potential SSRF (e.g. `file://` access).
**Learning:** Puppeteer's `page.goto()` accepts `file://` protocol by default, which can be used to read local files if the environment allows it.
**Prevention:** Always validate URL protocols (allowlist `http`, `https`) before passing to `page.goto()`.
