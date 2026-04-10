## 2024-04-10 - Query Waterfalls in DashboardController
**Learning:** Sequential database queries inside NestJS controllers (like fetching user data, leads, and transaction aggregations one after another) create unnecessary query waterfalls, increasing overall endpoint latency linearly with the number of queries.
**Action:** Always inspect multiple independent `await` statements in endpoints. Group independent queries (e.g., `getTotalEarnings`, `findAll`, etc.) using `Promise.all` to fetch them concurrently. Be mindful of preserving types when refactoring.
