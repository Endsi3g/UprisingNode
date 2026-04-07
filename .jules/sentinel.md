## 2024-04-07 - Server-Side Request Forgery (SSRF) in Scraper
**Vulnerability:** The scraper service used Puppeteer to navigate to an arbitrary URL supplied by the user without any validation or sanitization, potentially allowing internal network scanning or access to cloud metadata endpoints.
**Learning:** Even though Puppeteer is running in headless mode, it is still a browser navigating to a URL. It will happily navigate to localhost, 127.0.0.1, or AWS metadata IPs (169.254.169.254) if told to.
**Prevention:** Validate and restrict the URLs that the scraper can navigate to. Specifically block private/internal IP address ranges and cloud metadata IPs.
