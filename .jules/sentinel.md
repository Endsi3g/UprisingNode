# Sentinel's Journal

## 2025-02-14 - SSRF in Scraper Service
**Vulnerability:** The `ScraperService` accepted any URL and passed it directly to `puppeteer.launch().newPage().goto()`. This allowed access to local files (`file://`), internal network services (`localhost`, `127.0.0.1`), and cloud metadata services (`169.254.169.254`).
**Learning:** Direct usage of headless browsers without input validation is a high-risk pattern. Developers often assume the input URL is valid and safe. Also, `new URL()` in Node.js parses IPv6 hostnames with brackets (e.g., `[::1]`), which must be explicitly handled in string comparisons.
**Prevention:** Always validate user-supplied URLs before use. Implement a strict allowlist of protocols (`http`, `https`) and a denylist of private IP ranges and local hostnames. Use a robust validation library or consistent parsing logic that handles edge cases like IPv6 brackets.
