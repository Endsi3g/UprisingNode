cd api

# Fix controllers directly using node to make precise replacements
node -e "
const fs = require('fs');

function replaceReqAny(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/@Request\(\) req,/g, '@Request() req: { user: { userId: string } },');
  content = content.replace(/@Request\(\) req\)/g, '@Request() req: { user: { userId: string } })');
  fs.writeFileSync(path, content);
}

replaceReqAny('src/transactions/transactions.controller.ts');
replaceReqAny('src/leads/leads.controller.ts');
replaceReqAny('src/users/users.controller.ts');

let authContent = fs.readFileSync('src/auth/auth.controller.ts', 'utf8');
authContent = authContent.replace(/@Request\(\) req\)/g, '@Request() req: { user: { userId: string; email: string; role: string } })');
fs.writeFileSync('src/auth/auth.controller.ts', authContent);
"
