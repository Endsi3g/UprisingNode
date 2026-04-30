## 2025-02-12 - Concurrent API calls with Promise.all
**Learning:** In NestJS controllers like `DashboardController`, sequential independent database/service calls (`await A; await B; await C;`) create an unnecessary performance bottleneck, adding up latencies.
**Action:** Group independent asynchronous operations using `Promise.all([A, B, C])` to execute them concurrently, significantly reducing the overall response time for the endpoint.
