
## 2024-05-24 - SSRF Bypass via IPv4-mapped IPv6
**Vulnerability:** The scraper service had SSRF protections that checked for IPv4 loops and standard IPv6 loops, but failed to account for IPv4-mapped IPv6 addresses (e.g., `::ffff:127.0.0.1`).
**Learning:** Node.js `dns.lookup` and underlying OS resolvers can return IPv4-mapped IPv6 addresses when querying for AAAA records that map to IPv4 addresses. This allows attackers to bypass simple IPv4 checks by providing an IPv6 format that resolves to an internal IPv4 address.
**Prevention:** When performing SSRF checks on resolved IP addresses, ensure the validation logic explicitly checks and blocks IPv4-mapped IPv6 prefixes (e.g., `::ffff:127.0.0.0/104`, `::ffff:169.254.0.0/112`) alongside standard loopback and private ranges.
