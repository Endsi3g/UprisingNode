## 2024-05-24 - SSRF Vulnerability in Scraper Service
**Vulnerability:** `ScraperService` accepted arbitrary URLs from user input and passed them directly to `puppeteer.launch` and `page.goto` without validation.
**Learning:** This allowed potential SSRF attacks where an attacker could probe internal network services (localhost, private IPs) or access local files.
**Prevention:** Implement strict URL validation: enforce `http/https` protocols, resolve hostnames to IP addresses, and block private/loopback IP ranges before making any external requests.
