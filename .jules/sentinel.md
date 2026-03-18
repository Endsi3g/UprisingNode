## 2025-03-18 - Prevent SSRF in Puppeteer Scraper
**Vulnerability:** ScraperController takes a user-supplied URL and passes it directly to Puppeteer without validating its destination, allowing SSRF (Server-Side Request Forgery) attacks where internal metadata (like 169.254.169.254) or localhost endpoints could be accessed.
**Learning:** Even though Puppeteer operates via browser instance, it can navigate to private IP networks, leaking sensitive application and infrastructure data.
**Prevention:** Implement strict URL validation (`isSafeUrl`) that blocks `localhost`, private IP ranges, cloud metadata IP ranges, and enforces only `http:` and `https:` protocols prior to initiating `page.goto()`.
