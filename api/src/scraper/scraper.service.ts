/* eslint-disable */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as dns from 'dns/promises';
import { URL } from 'url';

@Injectable()
export class ScraperService {
  async scrape(url: string) {
    // Basic validation
    if (!url) throw new Error('URL is required');

    // Security check: SSRF prevention
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }

    // Resolve hostname to check for private/local addresses
    const hostname = parsedUrl.hostname;
    // Check if hostname is an IP
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[');

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
       throw new Error('Access to local resources is denied');
    }

    if (!isIp) {
       const ips = await dns.resolve(hostname);
       for (const ip of ips) {
          if (ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || (ip.startsWith('172.') && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31)) {
             throw new Error('Access to private network is denied');
          }
       }
    }


    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Extract data (title, meta description, H1)
      const data = await page.evaluate(() => {
        return {
          title: document.title,
          description:
            document
              .querySelector('meta[name="description"]')
              ?.getAttribute('content') || '',
          h1: document.querySelector('h1')?.innerText || '',
          // Add more selectors as needed for specific platforms (LinkedIn, etc.)
        };
      });

      return data;
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      await browser.close();
    }
  }
}
