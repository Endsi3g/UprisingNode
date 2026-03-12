## 2024-05-20 - Fix SSRF Vulnerability in ScraperService

**Vulnerability:** Server-Side Request Forgery (SSRF) risk in `ScraperService` due to missing URL validation before navigating using Puppeteer (`page.goto(url)`). User-provided URLs were executed without filtering, which could allow attackers to access internal cloud metadata services (e.g., `169.254.x.x`), internal network services, or private IPs.

**Learning:** When using web scraping tools like Puppeteer or rendering engines, user-supplied URLs must be strictly validated before execution. Relying solely on Puppeteer request interception to rewrite URLs can break TLS/SNI. A pre-navigation URL validation logic blocking private IP ranges, localhost, and internal metadata is more secure and reliable.

**Prevention:** Always validate URLs using the `URL` API and a blocklist of private IPs and non-HTTP/HTTPS protocols before passing the URL to fetching libraries or browser navigation. Use a lightweight `isSafeUrl` verification function to block malicious internal navigation requests.
