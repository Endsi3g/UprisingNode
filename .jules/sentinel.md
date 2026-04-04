
## 2024-05-24 - Prevent SSRF in Puppeteer Scraping
**Vulnerability:** The ScraperService accepted arbitrary user-provided URLs for a Puppeteer instance, leading to Server-Side Request Forgery (SSRF) risk where internal endpoints, cloud metadata, or loopbacks could be accessed.
**Learning:** Puppeteer does not restrict URLs by default. If a headless browser is used to visit user-provided URLs, the backend's internal network (e.g. AWS metadata endpoint `169.254.169.254`, `127.0.0.1`, private IP ranges) is exposed to attacks.
**Prevention:** Always implement an `isSafeUrl` check using the built-in `URL` class to parse protocols and block internal IP addresses and hostnames before handing off the URL to Puppeteer or `fetch`.
