## 2025-01-26 - Unrestricted SSRF in Puppeteer Scraper
**Vulnerability:** The `ScraperService` accepted arbitrary URLs and navigated to them using Puppeteer without validation.
**Learning:** Puppeteer's `goto` method does not inherently block internal IPs or file protocols.
**Prevention:** Implement a strict allow-list for protocols (http/https) and resolve hostnames to check against private IP ranges before navigation.
