
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Benchmark: Dashboard Stats Calculation');

  // 1. Setup
  const email = `benchmark-${Date.now()}@test.com`;
  console.log(`Creating test user: ${email}...`);

  const user = await prisma.user.create({
    data: {
      email,
      password: 'hashed-password',
      name: 'Benchmark User',
    },
  });

  const TRANSACTION_COUNT = 10000;
  console.log(`Seeding ${TRANSACTION_COUNT} transactions...`);

  const transactions: any[] = [];
  for (let i = 0; i < TRANSACTION_COUNT; i++) {
    const isCommission = Math.random() > 0.3; // 70% commissions
    const isPaid = Math.random() > 0.2; // 80% paid

    transactions.push({
      amount: Math.floor(Math.random() * 1000) + 100,
      type: isCommission ? 'COMMISSION' : 'WITHDRAWAL',
      status: isCommission && isPaid ? 'PAID' : 'PENDING',
      userId: user.id,
      description: `Transaction ${i}`,
    });
  }

  // Batch insert for speed
  try {
     await prisma.transaction.createMany({
       data: transactions
     });
  } catch (e) {
      console.log('createMany failed, falling back to loop...');
      throw e;
  }

  console.log('✅ Seeding complete.\n');

  // 2. Measure Old Approach (In-Memory)
  // Logic: Fetch All -> Filter -> Calculate
  // We simulate exactly what the controller does: findMany then JS filter.

  console.log('--- Benchmarking Old Approach (In-Memory) ---');
  const startOld = performance.now();

  const allTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const paidCommissions = allTransactions.filter(
    (t) => t.type === 'COMMISSION' && t.status === 'PAID',
  );

  const totalEarnings = paidCommissions.reduce((sum, t) => sum + t.amount, 0);
  const avgPerDealOld =
    paidCommissions.length > 0 ? totalEarnings / paidCommissions.length : 0;

  const endOld = performance.now();
  const timeOld = endOld - startOld;
  console.log(`Result: ${avgPerDealOld.toFixed(2)}`);
  console.log(`Time: ${timeOld.toFixed(4)} ms`);


  // 3. Measure New Approach (DB Aggregate)
  console.log('\n--- Benchmarking New Approach (DB Aggregate) ---');
  const startNew = performance.now();

  const aggregations = await prisma.transaction.aggregate({
    _avg: { amount: true },
    where: {
      userId: user.id,
      type: 'COMMISSION',
      status: 'PAID',
    },
  });

  const avgPerDealNew = aggregations._avg.amount || 0;

  const endNew = performance.now();
  const timeNew = endNew - startNew;
  console.log(`Result: ${avgPerDealNew.toFixed(2)}`);
  console.log(`Time: ${timeNew.toFixed(4)} ms`);

  // 4. Comparison
  console.log('\n--- Summary ---');
  console.log(`Improvement: ${(timeOld / timeNew).toFixed(2)}x faster`);

  // Cleanup
  console.log('\nCleaning up...');
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
