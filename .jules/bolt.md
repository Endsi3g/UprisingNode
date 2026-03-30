## 2024-05-24 - Prisma Aggregations over In-Memory Array Methods
**Learning:** Found multiple instances where large arrays were fetched from the database into memory using `findMany` just to perform basic aggregates like `sum`, `filter`, and limits (`slice(0, 5)`), creating an O(N) application bottleneck and unnecessary database I/O.
**Action:** Replace `findMany` followed by `.filter().reduce()` with database-level Prisma aggregations (`prisma.lead.aggregate` with `_sum`), and `findMany` followed by `.slice()` with `take` limits to push computation down to the database level.
