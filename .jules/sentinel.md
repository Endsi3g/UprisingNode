## 2025-01-29 - [SSRF in Puppeteer Scraper]
**Vulnerability:** The `ScraperService` accepted arbitrary URLs passed directly to `puppeteer.page.goto()`. This allowed attackers to access local files (`file://`) or internal network resources (`http://localhost`, `http://192.168.x.x`), leading to Server-Side Request Forgery (SSRF).
**Learning:** Puppeteer in headless mode is a powerful tool but extremely dangerous if input is not sanitized. It has access to the server's network and filesystem context by default.
**Prevention:** Always validate protocols (allow only `http`/`https`) and blocklist private IP ranges/localhost before passing URLs to `page.goto()`. Consider running Puppeteer in an isolated sandbox or container for defense in depth.
