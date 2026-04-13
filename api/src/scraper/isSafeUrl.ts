import * as dns from 'dns/promises';
import * as net from 'net';

export async function isSafeUrl(urlString: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(urlString);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    const hostname = parsedUrl.hostname;
    const addresses = await dns.lookup(hostname, { all: true });

    for (const addr of addresses) {
      const ip = addr.address;

      if (net.isIPv4(ip)) {
        // Block 0.0.0.0/8
        if (ip.startsWith('0.')) return false;
        // Block 127.0.0.0/8
        if (ip.startsWith('127.')) return false;
        // Block 10.0.0.0/8
        if (ip.startsWith('10.')) return false;
        // Block 169.254.0.0/16
        if (ip.startsWith('169.254.')) return false;
        // Block 192.168.0.0/16
        if (ip.startsWith('192.168.')) return false;
        // Block 172.16.0.0/12
        const parts = ip.split('.');
        if (parts[0] === '172') {
          const second = parseInt(parts[1], 10);
          if (second >= 16 && second <= 31) return false;
        }
      } else if (net.isIPv6(ip)) {
        // Block loopback
        if (ip === '::1') return false;
        // Block IPv4-mapped IPv6
        if (ip.startsWith('::ffff:')) {
          const ipv4Part = ip.substring(7);
          if (
            ipv4Part.startsWith('127.') ||
            ipv4Part.startsWith('169.254.') ||
            ipv4Part.startsWith('10.') ||
            ipv4Part.startsWith('192.168.') ||
            ipv4Part.startsWith('0.')
          ) {
            return false;
          }
          const parts = ipv4Part.split('.');
          if (parts[0] === '172') {
            const second = parseInt(parts[1], 10);
            if (second >= 16 && second <= 31) return false;
          }
        }
        // Block unique local addresses fc00::/7
        if (
          ip.toLowerCase().startsWith('fc') ||
          ip.toLowerCase().startsWith('fd')
        )
          return false;
        // Block link-local fe80::/10
        if (
          ip.toLowerCase().startsWith('fe8') ||
          ip.toLowerCase().startsWith('fe9') ||
          ip.toLowerCase().startsWith('fea') ||
          ip.toLowerCase().startsWith('feb')
        )
          return false;
      }
    }
    return true;
  } catch {
    return false; // Invalid URL or DNS resolution failed
  }
}
