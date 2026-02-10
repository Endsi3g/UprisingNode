import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting benchmark setup...');

  // Create a dummy user
  const user = await prisma.user.create({
    data: {
      email: `benchmark_${Date.now()}@test.com`,
      password: 'password',
      name: 'Benchmark User',
    },
  });

  console.log(`Created user: ${user.id}`);

  // Seed leads
  const statuses = ['PROSPECT', 'ANALYSIS', 'NEGOTIATION', 'CLOSED', 'LOST'];
  const leadsData: any[] = [];
  for (let i = 0; i < 5000; i++) {
    leadsData.push({
      url: `http://example.com/${i}`,
      companyName: `Company ${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 10),
      ownerId: user.id,
    });
  }

  console.log('Seeding 5000 leads...');
  // Note: createMany is supported in SQLite for recent Prisma versions
  await prisma.lead.createMany({
    data: leadsData,
  });
  console.log('Seeding complete.');

  // --- Baseline (Current Implementation) ---
  console.log('Running Baseline (In-Memory)...');
  const startBaseline = process.hrtime.bigint();

  const allLeads = await prisma.lead.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const potentialLeads = allLeads.filter(
    (l) =>
      l.status === 'ANALYSIS' ||
      l.status === 'NEGOTIATION' ||
      l.status === 'PROSPECT',
  );
  const potentialGains = potentialLeads.reduce((sum, lead) => {
    return sum + (lead.score || 0) * 10;
  }, 0);

  const activePipeline = allLeads
      .filter((l) => l.status !== 'CLOSED' && l.status !== 'LOST')
      .slice(0, 5); // Simplification of the mapping for benchmark

  const endBaseline = process.hrtime.bigint();
  const baselineDuration = Number(endBaseline - startBaseline) / 1e6; // ms
  console.log(`Baseline Duration: ${baselineDuration.toFixed(2)} ms`);
  console.log(`Baseline Results - Potential Gains: ${potentialGains}, Pipeline Count: ${activePipeline.length}`);


  // --- Optimized (Proposed Implementation) ---
  console.log('Running Optimized (Database Aggregation)...');
  const startOptimized = process.hrtime.bigint();

  const potentialGainsAgg = await prisma.lead.aggregate({
    _sum: {
      score: true,
    },
    where: {
      ownerId: user.id,
      status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
    },
  });
  const optimizedPotentialGains = (potentialGainsAgg._sum.score || 0) * 10;

  const optimizedActivePipeline = await prisma.lead.findMany({
    where: {
        ownerId: user.id,
        status: { notIn: ['CLOSED', 'LOST'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const endOptimized = process.hrtime.bigint();
  const optimizedDuration = Number(endOptimized - startOptimized) / 1e6; // ms
  console.log(`Optimized Duration: ${optimizedDuration.toFixed(2)} ms`);
  console.log(`Optimized Results - Potential Gains: ${optimizedPotentialGains}, Pipeline Count: ${optimizedActivePipeline.length}`);

  // --- Cleanup ---
  console.log('Cleaning up...');
  await prisma.lead.deleteMany({ where: { ownerId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
