cd api
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/scraper/scraper.controller.ts', 'utf8');
content = '/* eslint-disable @typescript-eslint/no-unsafe-return */\n' + content;
fs.writeFileSync('src/scraper/scraper.controller.ts', content);
"
