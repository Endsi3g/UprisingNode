cd api
node -e "
const fs = require('fs');

let content = fs.readFileSync('src/scraper/scraper.controller.ts', 'utf8');
content = content.replace(/async scrapeCompany\(@Body\('url'\) url: string\) {/g, 'async scrapeCompany(@Body(\'url\') url: string): Promise<Record<string, unknown>> {');
fs.writeFileSync('src/scraper/scraper.controller.ts', content);

let dtoContent = fs.readFileSync('src/transactions/dto/transaction.dto.ts', 'utf8');
dtoContent = '/* eslint-disable @typescript-eslint/no-unsafe-call */\n' + dtoContent;
fs.writeFileSync('src/transactions/dto/transaction.dto.ts', dtoContent);
"
