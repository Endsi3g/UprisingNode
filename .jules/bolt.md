## 2024-03-01 - Avoid in-memory O(N) processing for database aggregations
**Learning:** Using `findAll` to load all database rows into memory and then performing `.filter` and `.reduce` or `.slice` is a significant architectural bottleneck. It creates O(N) memory overhead and latency, especially as tables like `leads` grow over time.
**Action:** Replace in-memory mapping with database-level `groupBy`, `aggregate` (`_sum`), and filtering (`where`, `take`). For concurrent dashboard widget data, use `Promise.all()` to execute the distinct database queries in parallel.
