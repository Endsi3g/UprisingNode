## 2025-02-12 - Dashboard Aggregation Optimization
**Learning:** The dashboard `getStats` endpoint was fetching *all* user leads to calculate potential gains, an O(N) operation.
**Action:** Always prefer database aggregations (`_sum`, `count`) over fetching and filtering in memory. Use `Promise.all` for independent service calls.
