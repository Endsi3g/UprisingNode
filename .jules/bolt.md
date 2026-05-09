## 2024-05-17 - O(N) Array Reduction Bottleneck in Prisma FindMany
**Learning:** Found an anti-pattern where Prisma `findMany` was loading all transaction rows into memory and using array `.reduce()` to calculate a balance. This creates a severe O(N) memory bottleneck as a user's transaction history grows.
**Action:** Replace `findMany` + `reduce` with concurrent `this.prisma.<model>.aggregate({ _sum: ... })` queries executed via `Promise.all`. This pushes the computation to the database layer, eliminating application memory overhead.
