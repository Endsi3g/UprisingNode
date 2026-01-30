import { PrismaClient as PrismaClientPg } from '@prisma/client';
// @ts-ignore
import { PrismaClient as PrismaClientSqlite } from '@prisma/client-sqlite';

async function main() {
  console.log('Starting migration from SQLite to PostgreSQL...');

  const sqlite = new PrismaClientSqlite();
  const pg = new PrismaClientPg();

  try {
    // 1. Users
    console.log('Migrating Users...');
    const users = await sqlite.user.findMany();
    for (const user of users) {
      await pg.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    console.log(`Migrated ${users.length} users.`);

    // 2. Leads
    console.log('Migrating Leads...');
    const leads = await sqlite.lead.findMany();
    for (const lead of leads) {
      await pg.lead.upsert({
        where: { id: lead.id },
        update: lead,
        create: lead,
      });
    }
    console.log(`Migrated ${leads.length} leads.`);

    // 3. Transactions
    console.log('Migrating Transactions...');
    const transactions = await sqlite.transaction.findMany();
    for (const tx of transactions) {
      await pg.transaction.upsert({
        where: { id: tx.id },
        update: tx,
        create: tx,
      });
    }
    console.log(`Migrated ${transactions.length} transactions.`);

    // 4. Messages
    console.log('Migrating Messages...');
    const messages = await sqlite.message.findMany();
    for (const msg of messages) {
      await pg.message.upsert({
        where: { id: msg.id },
        update: msg,
        create: msg,
      });
    }
    console.log(`Migrated ${messages.length} messages.`);

    // 5. Resources
    console.log('Migrating Resources...');
    const resources = await sqlite.resource.findMany();
    for (const res of resources) {
      await pg.resource.upsert({
        where: { id: res.id },
        update: res,
        create: res,
      });
    }
    console.log(`Migrated ${resources.length} resources.`);

    console.log('Migration complete!');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await sqlite.$disconnect();
    await pg.$disconnect();
  }
}

main();
