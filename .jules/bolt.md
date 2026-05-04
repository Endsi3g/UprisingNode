## 2025-05-04 - Database Aggregation Optimization
**Learning:** In the `api` workspace with Prisma, using `findMany` followed by an in-memory array `reduce` to calculate sums (like user balances) creates an O(N) memory bottleneck by pulling all rows into Node.js memory.
**Action:** Always use `this.prisma.<model>.aggregate({ _sum: ... })` (running multiple concurrently via `Promise.all` if evaluating different conditions) to push the computation to the database layer.
