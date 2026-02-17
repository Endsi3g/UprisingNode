## 2025-01-29 - [Strict Linting in API Tests]
**Learning:** The `api` workspace enforces strict linting rules (`no-unsafe-*`) which flag standard Jest mocking patterns (like `jest.fn()` returning `any`). This necessitates explicit type handling or file-level `eslint-disable` directives in test files.
**Action:** When adding tests in `api`, proactively include `/* eslint-disable @typescript-eslint/no-unsafe-* */` directives or use strict typing for mocks to avoid lint failures.

## 2025-01-29 - [Prisma Aggregation Optimization]
**Learning:** `TransactionsService.getBalance` was fetching all user transactions (O(N)) to calculate a sum, which is inefficient. Prisma's `groupBy` allows offloading this to the database (O(1) transfer).
**Action:** Look for `findMany` followed by `reduce` or `filter` in service methods and replace them with `prisma.groupBy` or `prisma.aggregate` for significant performance gains.
