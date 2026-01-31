# BOLT'S JOURNAL

## YYYY-MM-DD - [Title]
**Learning:** [Insight]
**Action:** [How to apply next time]

## 2026-01-31 - Parallelizing Dashboard Data Fetching
**Learning:** The `DashboardController` was fetching data sequentially, accumulating latency. Independent database calls (user, transactions, leads) should be parallelized.
**Action:** Used `Promise.all` to execute independent service calls concurrently, reducing endpoint response time to the duration of the slowest query.
