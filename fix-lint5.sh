cd api

# Fix missing types for req and any usage in controllers carefully
sed -i -E 's/@Request\(\) req,/@Request() req: { user: { userId: string } },/g' src/transactions/transactions.controller.ts
sed -i -E 's/@Request\(\) req\)/@Request() req: { user: { userId: string } })/g' src/transactions/transactions.controller.ts

sed -i -E 's/@Request\(\) req,/@Request() req: { user: { userId: string } },/g' src/leads/leads.controller.ts
sed -i -E 's/@Request\(\) req\)/@Request() req: { user: { userId: string } })/g' src/leads/leads.controller.ts

sed -i -E 's/@Request\(\) req,/@Request() req: { user: { userId: string } },/g' src/users/users.controller.ts
sed -i -E 's/@Request\(\) req\)/@Request() req: { user: { userId: string } })/g' src/users/users.controller.ts

sed -i -E 's/@Request\(\) req\)/@Request() req: { user: { userId: string; email: string; role: string } })/g' src/auth/auth.controller.ts
