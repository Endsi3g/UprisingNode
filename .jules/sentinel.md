## 2024-04-20 - SSRF via Puppeteer request navigation
**Vulnerability:** The scraper service used puppeteer.goto directly on user input, allowing Server-Side Request Forgery against internal metadata servers, 0.0.0.0, and loopback addresses.
**Learning:** Checking the initial URL is insufficient since Puppeteer follows HTTP redirects automatically. True SSRF protection requires request interception and DNS lookup validation.
**Prevention:** Enable `page.setRequestInterception(true)`, use `page.on('request')` to validate every request (DNS resolution + internal IP blocking), and abort unsafe requests. Ensure IPv4-mapped IPv6 and 0.0.0.0 ranges are blocked.
