import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting benchmark setup...');

  // 1. Create a dummy user
  const email = 'benchmark_user@example.com';
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'password123',
        name: 'Benchmark User',
      },
    });
    console.log(`Created benchmark user: ${user.id}`);
  } else {
    console.log(`Using existing benchmark user: ${user.id}`);
  }

  // 2. Check lead count and seed if necessary
  const TARGET_LEAD_COUNT = 10000;
  const currentCount = await prisma.lead.count({ where: { ownerId: user.id } });

  if (currentCount < TARGET_LEAD_COUNT) {
    console.log(`Seeding leads (current: ${currentCount}, target: ${TARGET_LEAD_COUNT})...`);
    const leadsToCreate = TARGET_LEAD_COUNT - currentCount;
    const batchSize = 100;

    for (let i = 0; i < leadsToCreate; i += batchSize) {
      const leads: Prisma.LeadCreateManyInput[] = [];
      for (let j = 0; j < batchSize && i + j < leadsToCreate; j++) {
        leads.push({
          ownerId: user.id,
          url: `http://example.com/lead-${i + j}`,
          companyName: `Company ${i + j}`,
          status: 'PROSPECT',
          score: Math.floor(Math.random() * 100),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random past date
        });
      }

      // Prisma createMany is not supported on SQLite for relations in some versions,
      // but let's try createMany if available or fallback to loop.
      // SQLite does support createMany in recent Prisma versions.
      await prisma.lead.createMany({ data: leads });

      if ((i + batchSize) % 1000 === 0) {
        process.stdout.write(`.`);
      }
    }
    console.log('\nSeeding complete.');
  } else {
    console.log(`Leads already seeded (${currentCount}).`);
  }

  // 3. Run Benchmark
  console.log('Running benchmark...');
  const iterations = 50;
  let totalTime = 0;

  // Warmup
  await prisma.lead.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 1, // Just to warm up connection
  });

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    const results = await prisma.lead.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const end = performance.now();
    totalTime += (end - start);

    // Sanity check to ensure we are actually fetching data
    if (results.length === 0) {
        console.warn("Warning: Query returned 0 results!");
    }
  }

  const averageTime = totalTime / iterations;
  console.log(`\nBenchmark Results:`);
  console.log(`Average Query Time: ${averageTime.toFixed(4)} ms`);
  console.log(`Total Iterations: ${iterations}`);
  console.log(`Rows returned: ${TARGET_LEAD_COUNT}`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
