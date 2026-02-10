import { ResourcesService } from '../src/resources/resources.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prismaService = new PrismaService();
  await prismaService.$connect();

  const resourcesService = new ResourcesService(prismaService);

  console.log('Starting benchmark: Fetch Page 1 (Optimized)');
  const start = process.hrtime();

  const results = await resourcesService.findAll({
      page: 1,
      limit: 10,
      category: 'all',
      search: ''
  });

  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

  console.log(`Fetched ${results.data.length} resources in ${timeInMs}ms (Total: ${results.meta.total})`);

  await prismaService.$disconnect();
}

main().catch(console.error);
