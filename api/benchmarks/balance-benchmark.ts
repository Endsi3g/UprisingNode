import { PrismaClient } from '@prisma/client';
import { TransactionsService } from '../src/transactions/transactions.service';

async function runBenchmark() {
    const prisma = new PrismaClient();

    // We instantiate the service manually.
    // We can cast prisma to any because at runtime it has the methods.
    const service = new TransactionsService(prisma as any);

    const userId = 'benchmark-user-' + Date.now();
    console.log(`Setting up benchmark for user: ${userId}`);

    try {
        await prisma.user.create({
            data: {
                id: userId,
                email: `${userId}@bench.com`,
                password: 'password',
                name: 'Benchmark User'
            }
        });

        console.log('Seeding 10,000 transactions...');
        const txs: any[] = [];
        for (let i = 0; i < 10000; i++) {
            txs.push({
                userId,
                amount: Math.floor(Math.random() * 1000),
                type: Math.random() > 0.5 ? 'COMMISSION' : 'WITHDRAWAL',
                status: Math.random() > 0.8 ? 'CANCELLED' : (Math.random() > 0.5 ? 'PAID' : 'PENDING'),
                description: 'Bench tx'
            });
        }

        // SQLite doesn't support createMany nicely, so we loop batching promises
        const batchSize = 100;
        for (let i = 0; i < txs.length; i += batchSize) {
            const batch = txs.slice(i, i + batchSize);
            await Promise.all(batch.map(data => prisma.transaction.create({ data })));
            if (i % 1000 === 0) process.stdout.write('.');
        }
        console.log('\nSeeding complete.');

        // Warmup
        await service.getBalance(userId);

        console.log('Measuring performance...');
        const start = performance.now();
        const iterations = 50;

        for (let i = 0; i < iterations; i++) {
            await service.getBalance(userId);
        }

        const end = performance.now();
        const totalTime = end - start;
        const avgTime = totalTime / iterations;

        console.log(`\nResults:`);
        console.log(`Total time (${iterations} runs): ${totalTime.toFixed(2)}ms`);
        console.log(`Average time per call: ${avgTime.toFixed(2)}ms`);

    } catch (e) {
        console.error(e);
    } finally {
        console.log('Cleaning up...');
        // Delete transactions first
        await prisma.transaction.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
        await prisma.$disconnect();
    }
}

runBenchmark();
