import { ResourcesService } from '../src/resources/resources.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prismaService = new PrismaService();
  await prismaService.$connect();

  const resourcesService = new ResourcesService(prismaService);

  console.log('Starting benchmark: Fetch All Resources (Simulated)');
  const start = process.hrtime();

  // simulate current behavior: fetch all
  const results = await resourcesService.findAll({ page: 1, limit: 100000 });

  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

  console.log(`Fetched ${results.data.length} resources in ${timeInMs}ms`);

  await prismaService.$disconnect();
}

main().catch(console.error);
