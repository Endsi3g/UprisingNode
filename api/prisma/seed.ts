import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean up
  await prisma.transaction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test Partner',
      role: 'PARTNER',
    },
  });

  console.log(`Created user: ${user.email} (${user.id})`);

  // 3. Create Transactions
  await prisma.transaction.create({
    data: {
      amount: 12450,
      type: 'COMMISSION',
      status: 'VALIDATED',
      userId: user.id,
      description: 'Initial Commission',
    },
  });

  // 4. Create Leads
  const statuses = [
    { status: 'PROSPECT', count: 7 },
    { status: 'AUDIT', count: 3 },
    { status: 'SIGNED', count: 12 },
  ];

  for (const group of statuses) {
    for (let i = 0; i < group.count; i++) {
      await prisma.lead.create({
        data: {
          url: `https://example-${group.status.toLowerCase()}-${i}.com`,
          status: group.status,
          ownerId: user.id,
          score: Math.floor(Math.random() * 100),
          createdAt: new Date(),
        },
      });
    }
  }

  // 5. Create "Last Month" Leads
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  for (let i = 0; i < 19; i++) {
    await prisma.lead.create({
      data: {
        url: `https://old-lead-${i}.com`,
        status: 'PROSPECT',
        ownerId: user.id,
        createdAt: lastMonth,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
