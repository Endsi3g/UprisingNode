## 2025-05-02 - Prisma findMany Array Reductions
**Learning:** Using `findMany` followed by an in-memory `reduce` for calculating balances creates a significant memory bottleneck (O(N) space) and slows down as a user's transaction history grows.
**Action:** Always replace in-memory array aggregations with `Prisma.aggregate` running concurrently via `Promise.all` to push computation to the database layer and keep node memory usage at O(1).
