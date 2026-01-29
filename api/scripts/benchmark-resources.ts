
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

async function seed(count: number) {
  console.log(`Seeding ${count} resources...`);

  // Clear existing resources first to have a clean slate
  await prisma.resource.deleteMany();

  const batchSize = 1000;
  for (let i = 0; i < count; i += batchSize) {
    const resources: any[] = [];
    for (let j = 0; j < batchSize && i + j < count; j++) {
      resources.push({
        title: `Resource ${i + j}`,
        category: ['scripts', 'strategies', 'marketing', 'legal'][Math.floor(Math.random() * 4)],
        type: ['PDF', 'PPTX', 'DOCX'][Math.floor(Math.random() * 3)],
        url: 'https://example.com/resource.pdf',
        size: `${Math.floor(Math.random() * 1000)} KB`,
        description: `Description for resource ${i + j}. This is a long description to simulate real data payload.`,
      });
    }
    await prisma.resource.createMany({ data: resources });
    console.log(`Seeded ${Math.min(i + batchSize, count)}/${count}`);
  }
}

async function benchmark() {
  console.log('Starting benchmark...');

  const start = performance.now();
  const resources = await prisma.resource.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  const end = performance.now();

  const size = JSON.stringify(resources).length;
  const sizeMB = (size / 1024 / 1024).toFixed(2);

  console.log('--- Baseline Results ---');
  console.log(`Total Resources: ${resources.length}`);
  console.log(`Time to fetch all: ${(end - start).toFixed(2)} ms`);
  console.log(`Payload size: ${sizeMB} MB`);

  // Optimized Benchmark
  const startPaged = performance.now();
  const [data, total] = await Promise.all([
    prisma.resource.findMany({
      take: 12,
      skip: 0,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.resource.count(),
  ]);
  const endPaged = performance.now();

  const sizePaged = JSON.stringify({
    data,
    meta: { total, page: 1, limit: 12 },
  }).length;
  const sizePagedKB = (sizePaged / 1024).toFixed(2);

  console.log('\n--- Optimization Results ---');
  console.log(`Fetched 1 page (12 items) of ${total}`);
  console.log(`Time to fetch: ${(endPaged - startPaged).toFixed(2)} ms`);
  console.log(`Payload size: ${sizePagedKB} KB`);
}

async function main() {
  await seed(10000);
  await benchmark();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
