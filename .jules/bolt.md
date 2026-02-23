## 2025-01-28 - In-memory filtering bottleneck
**Learning:** `LeadsService.findAll` fetches all records for a user, encouraging in-memory filtering in controllers (seen in `DashboardController`).
**Action:** Always prefer creating specific service methods with `where` clauses and aggregations over using generic `findAll`.
