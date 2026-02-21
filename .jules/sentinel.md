## 2024-05-22 - SSRF Vulnerability in ScraperService
**Vulnerability:** The `ScraperService` accepted arbitrary URLs and passed them directly to Puppeteer without validation, allowing access to internal network resources (localhost, private IPs) and local files.
**Learning:** Puppeteer (and other headless browsers) execute requests from the server context, bypassing client-side restrictions. Without strict server-side validation, this leads to Server-Side Request Forgery (SSRF).
**Prevention:** Always validate and sanitize user-provided URLs before fetching them. Specifically:
1. Parse the URL.
2. Allow only `http` and `https` protocols.
3. Resolve the hostname to an IP address.
4. Block private/internal IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16).
