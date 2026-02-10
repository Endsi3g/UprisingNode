import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean up
  console.log('Cleaning up old data...');
  try {
      // Find partners
      const partners = await prisma.user.findMany({
          where: { role: 'PARTNER' },
          select: { id: true }
      });
      const partnerIds = partners.map(p => p.id);

      if (partnerIds.length > 0) {
          // Delete transactions for these partners
          await prisma.transaction.deleteMany({
              where: { userId: { in: partnerIds } }
          });
          // Delete users
          await prisma.user.deleteMany({
              where: { id: { in: partnerIds } }
          });
      }
  } catch (e) {
      console.log('Cleanup error (might be empty DB):', e.message);
  }

  // 2. Prepare data
  const password = await bcrypt.hash('password123', 10);
  const totalUsers = 10000;
  const batchSize = 500;

  const expertises = ['Tech', 'Marketing', 'Finance', 'Legal', 'Sales', 'Real Estate', 'Consulting'];
  const locations = ['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg'];

  console.log(`Seeding ${totalUsers} partners...`);

  for (let i = 0; i < totalUsers; i += batchSize) {
    const users: any[] = [];
    for (let j = 0; j < batchSize && (i + j) < totalUsers; j++) {
      const idx = i + j;
      users.push({
        email: `partner${idx}@example.com`,
        password: password,
        name: `Partner ${idx}`,
        role: 'PARTNER',
        avatar: 'https://i.pravatar.cc/150',
        createdAt: new Date(),
        updatedAt: new Date(),
        expertise: expertises[Math.floor(Math.random() * expertises.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
      });
    }

    // @ts-ignore
    await prisma.user.createMany({ data: users });
    process.stdout.write(`\rCreated ${Math.min(i + batchSize, totalUsers)} users`);
  }
  console.log('\nUsers created.');

  // 3. Add transactions
  console.log('Seeding transactions...');
  // Fetch back all partners to get IDs
  const allPartners = await prisma.user.findMany({
      where: { role: 'PARTNER' },
      select: { id: true }
  });

  const transactions: any[] = [];
  const TX_BATCH_SIZE = 2000;

  for (const partner of allPartners) {
      // Add 2-5 transactions per partner
      const count = Math.floor(Math.random() * 4) + 2;
      for (let k = 0; k < count; k++) {
          transactions.push({
              amount: Math.floor(Math.random() * 10000) + 100,
              type: 'COMMISSION',
              status: 'PAID',
              userId: partner.id,
              updatedAt: new Date()
          });
      }

      if (transactions.length >= TX_BATCH_SIZE) {
          // @ts-ignore
          await prisma.transaction.createMany({ data: transactions });
          transactions.length = 0;
      }
  }
  if (transactions.length > 0) {
      // @ts-ignore
      await prisma.transaction.createMany({ data: transactions });
  }

  console.log('\nSeeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
