## 2026-05-05 - O(N) Array Reduce Bottleneck in Aggregates
**Learning:** Using `findMany` followed by an in-memory array `reduce` for calculating sums or balances creates an O(N) memory and processing bottleneck.
**Action:** Always use `this.prisma.<model>.aggregate({ _sum: ... })` (running multiple concurrently via `Promise.all` if evaluating different conditions) to push the computation to the database layer.
