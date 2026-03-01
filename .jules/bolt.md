## 2025-02-14 - Dashboard Performance Optimization
**Learning:** Fetching all lead records into memory via `findAll()` just to aggregate basic dashboard metrics (potential gains and active pipeline) is an O(N) operation that causes unnecessary memory consumption and latency, especially as the user's data grows.
**Action:** Replace in-memory aggregations (`Array.filter`, `Array.reduce`, `Array.slice`) with database-level aggregations and queries using Prisma (`aggregate` with `_sum`, `findMany` with `take` and `orderBy`) for dashboards and other analytic endpoints.
