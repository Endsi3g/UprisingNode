import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding resources...');
  // Clear existing if needed, or just add. Let's add.

  const categories = ['scripts', 'strategies', 'marketing', 'legal', 'other'];
  const types = ['PDF', 'PPTX', 'DOCX', 'XLSX'];

  const resources: any[] = [];
  for (let i = 0; i < 10000; i++) {
    resources.push({
      title: `Resource ${i} - ${Math.random().toString(36).substring(7)}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      type: types[Math.floor(Math.random() * types.length)],
      url: `https://example.com/resource-${i}`,
      size: `${Math.floor(Math.random() * 1000)} KB`,
      description: `This is a description for resource number ${i}. It contains some search terms like efficiency, performance, and scaling.`,
    });
  }

  // Batch insert in chunks to avoid parameter limits if any
  const batchSize = 1000;
  for (let i = 0; i < resources.length; i += batchSize) {
    const batch = resources.slice(i, i + batchSize);
    await prisma.resource.createMany({
      data: batch,
    });
    console.log(`Inserted ${i + batch.length} / ${resources.length}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
