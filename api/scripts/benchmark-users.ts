
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../src/users/users.service';
import { PasswordService } from '../src/auth/password.service';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();

// Mock PasswordService since it's not used in findAllPartners
const mockPasswordService = {} as PasswordService;

// Create an instance of PrismaService that extends PrismaClient
// In the app, PrismaService extends PrismaClient, so we can just use our prisma instance
// cast as PrismaService for the dependency injection
const prismaService = prisma as unknown as PrismaService;

const usersService = new UsersService(prismaService, mockPasswordService);

async function seed() {
  console.log('Checking database state...');
  const partnerCount = await prisma.user.count({
    where: { role: { in: ['PARTNER', 'ADMIN'] } },
  });

  if (partnerCount > 20) {
    console.log(`Found ${partnerCount} partners. Skipping seed.`);
    return;
  }

  console.log('Seeding database for benchmark...');

  // Create Partners
  const partners: any[] = [];
  for (let i = 0; i < 50; i++) {
    const partner = await prisma.user.create({
      data: {
        email: `benchmark_partner_${i}_${Date.now()}@example.com`,
        password: 'hashed_password_placeholder',
        name: `Partner ${i}`,
        role: 'PARTNER',
        status: 'active',
      },
    });
    partners.push(partner);
  }

  // Create Transactions
  console.log('Seeding transactions...');
  const transactionsData: any[] = [];
  for (const partner of partners) {
    // Each partner gets ~200 transactions
    for (let j = 0; j < 200; j++) {
      transactionsData.push({
        amount: Math.random() * 1000,
        type: 'COMMISSION',
        status: Math.random() > 0.1 ? 'PAID' : 'PENDING', // 90% PAID
        userId: partner.id,
        description: `Benchmark Transaction ${j}`,
      });
    }
  }

  // Batch insert transactions
  // SQLite has variables limit, so we chunk it
  const chunkSize = 100;
  for (let i = 0; i < transactionsData.length; i += chunkSize) {
    const chunk = transactionsData.slice(i, i + chunkSize);
    await prisma.$transaction(
        chunk.map(t => prisma.transaction.create({ data: t }))
    );
  }

  // Create Leads
  console.log('Seeding leads...');
  const leadsData: any[] = [];
  for (const partner of partners) {
      for(let k = 0; k < 20; k++) {
          leadsData.push({
              url: `https://example.com/lead/${partner.id}/${k}`,
              ownerId: partner.id,
              status: 'PROSPECT'
          })
      }
  }

  for (let i = 0; i < leadsData.length; i += chunkSize) {
    const chunk = leadsData.slice(i, i + chunkSize);
    await prisma.$transaction(
        chunk.map(l => prisma.lead.create({ data: l }))
    );
  }

  console.log('Seeding complete.');
}

async function benchmark() {
  await seed();

  console.log('Starting benchmark for findAllPartners()...');

  // Warmup (optional, but good for JIT)
  // await usersService.findAllPartners();

  const start = performance.now();
  const partners = await usersService.findAllPartners();
  const end = performance.now();

  console.log(`\n--------------------------------------------------`);
  console.log(`Fetched ${partners.length} partners.`);
  console.log(`Time taken: ${(end - start).toFixed(2)} ms`);
  console.log(`--------------------------------------------------\n`);

  // Simple integrity check
  if (partners.length > 0) {
      console.log('Sample Partner:', JSON.stringify(partners[0], null, 2));
  }
}

benchmark()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
