## 2023-10-27 - SSRF Protection for Web Scrapers
**Vulnerability:** Server-Side Request Forgery (SSRF) was possible via `ScraperService` as it allowed passing arbitrary URLs to Puppeteer. This could be used to scan internal networks, access metadata endpoints (e.g. 169.254.169.254), or access internal APIs by requesting localhost or private IP addresses.
**Learning:** Even headless browsers need SSRF protection. Relying solely on the initial URL is insufficient since redirects could point to internal resources.
**Prevention:**
1. Explicitly check the protocol of the requested URL (must be `http:` or `https:`).
2. Perform DNS resolution using `dns.lookup` to get the IP address.
3. Validate that the resolved IP address is not a private or reserved IP range (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16, etc).
4. Most importantly, intercept all outgoing requests at the browser level (e.g., using Puppeteer's `page.setRequestInterception(true)`) and perform the identical validation for *every* request, including redirects and assets.
