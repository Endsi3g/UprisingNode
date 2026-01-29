import { PrismaClient } from '@prisma/client';
import { UsersService } from '../src/users/users.service';
import { PasswordService } from '../src/auth/password.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prisma = new PrismaService();
  // Mock PasswordService as it's not used in findAllPartners
  const passwordService = {} as PasswordService;
  const usersService = new UsersService(prisma, passwordService);

  console.log('Connecting to database...');
  await prisma.$connect();

  const PARTNER_COUNT = 500;
  const TX_PER_PARTNER = 50;

  console.log(`Seeding ${PARTNER_COUNT} partners with ${TX_PER_PARTNER} transactions each...`);

  const partnerIds: string[] = [];

  // Create partners and transactions
  // We do this in a loop because we need the IDs to clean up later, and complex nested creates are easier one by one or we'd need to fetch them back.
  // Actually, we can use a transaction or just loop.

  for (let i = 0; i < PARTNER_COUNT; i++) {
    const partner = await prisma.user.create({
      data: {
        email: `bench_partner_${Date.now()}_${i}@test.com`,
        password: 'hash',
        name: `Bench Partner ${i}`,
        role: 'PARTNER',
        transactions: {
          createMany: {
            data: Array.from({ length: TX_PER_PARTNER }).map((_, j) => ({
              amount: Math.random() * 1000,
              type: 'COMMISSION',
              status: j % 2 === 0 ? 'PAID' : 'PENDING', // Mix statuses
              description: 'Benchmark Transaction'
            }))
          }
        }
      }
    });
    partnerIds.push(partner.id);
  }

  console.log('Seeding complete. Running benchmark...');

  // Warmup (optional, but good for JIT)
  // await usersService.findAllPartners();

  const start = process.hrtime();
  const partners = await usersService.findAllPartners();
  const end = process.hrtime(start);

  const durationInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
  console.log(`findAllPartners executed in ${durationInMs} ms`);
  console.log(`Retrieved ${partners.length} partners (includes existing DB data)`);

  // Simple verification of structure
  if (partners.length > 0) {
      const p = partners[0];
      if (p.totalEarnings === undefined || p.dealsThisMonth === undefined) {
          console.error("ERROR: Missing expected fields in response");
      }
  }

  // Cleanup
  console.log('Cleaning up benchmark data...');
  // Delete transactions for these users
  await prisma.transaction.deleteMany({
    where: {
      userId: { in: partnerIds }
    }
  });

  await prisma.user.deleteMany({
    where: {
      id: { in: partnerIds }
    }
  });

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
