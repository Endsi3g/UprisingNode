## 2024-05-24 - Optimizing Aggregations in NestJS/Prisma
**Learning:** Using `Promise.all` alongside database-level Prisma aggregations (`aggregate`, `count`, `groupBy`) replaces O(N) in-memory array filtering (e.g. `reduce`, `filter`, `slice` after fetching all records), significantly reducing memory footprint and application CPU load, while also improving query concurrency.
**Action:** Always prefer pushing data aggregations and limits (like `take` or `_sum`) down to the database using Prisma rather than fetching all records and processing them in the application layer.
