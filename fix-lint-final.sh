cd api

# Fix missing types for req and any usage in controllers carefully using node to avoid sed bugs with parens
node -e "
const fs = require('fs');

function fixController(path, isAuth) {
  let content = fs.readFileSync(path, 'utf8');
  if (isAuth) {
    content = content.replace(/@Request\(\) req\)/g, '@Request() req: { user: { userId: string; email: string; role: string } })');
  } else {
    content = content.replace(/@Request\(\) req,/g, '@Request() req: { user: { userId: string } },');
    content = content.replace(/@Request\(\) req\)/g, '@Request() req: { user: { userId: string } })');
  }
  fs.writeFileSync(path, content);
}

fixController('src/transactions/transactions.controller.ts', false);
fixController('src/leads/leads.controller.ts', false);
fixController('src/users/users.controller.ts', false);
fixController('src/auth/auth.controller.ts', true);
"
