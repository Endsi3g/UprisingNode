## 2025-02-18 - SSRF in Web Scraper
**Vulnerability:** The web scraper service allowed scraping arbitrary URLs provided by users without validation, enabling potential Server-Side Request Forgery (SSRF) attacks against internal services or local files.
**Learning:** Headless browsers running on the server side have access to the server's internal network perspective. Without explicit blocking, they can access sensitive internal endpoints or metadata services.
**Prevention:** Always validate user-provided URLs against an allowlist of protocols (http/https) and resolve hostnames to check against private/reserved IP ranges before initiating a request. Use a timeout.
