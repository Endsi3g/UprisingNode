## 2024-05-22 - Optimizing Transactions Service
**Learning:** `TransactionsService.getBalance` fetched all user transactions to calculate balance in memory. This is O(N) and becomes a bottleneck. Prisma's `groupBy` aggregation allows doing this in O(1) (app memory) and significantly faster in DB.
**Action:** Always prefer DB-side aggregation (`aggregate`, `groupBy`) over fetching and reducing in application code for statistics/sums.
