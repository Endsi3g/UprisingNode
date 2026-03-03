
## $(date +%Y-%m-%d) - Optimize Dashboard stats memory usage via DB aggregations
**Learning:** Found an anti-pattern of loading all unpaginated `Lead` records into memory via `findAll()` just to calculate sum stats and list a few active items. This causes O(N) memory complexity and hurts DB performance by fetching unnecessary data.
**Action:** Replace in-memory mapping and reducing with database-level `Prisma` queries (using `aggregate._sum` and `findMany` with `take` and `select`).
