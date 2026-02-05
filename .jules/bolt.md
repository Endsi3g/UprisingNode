## 2025-02-12 - Prisma Version Mismatch in CI/Dev
**Learning:** The project uses Prisma 6.x but `npx prisma` defaults to latest (7.x), causing schema validation errors due to breaking changes in `datasource` configuration.
**Action:** Always use `node_modules/.bin/prisma` or ensure `npx` uses the local version when running generator or migration commands to avoid version mismatches.

## 2025-02-12 - Optimizing Transaction Balance Calculation
**Learning:** `findMany` followed by `reduce` is a common anti-pattern for aggregations. Prisma's `aggregate` is much faster but requires careful handling of `where` clauses to match code-level filtering logic.
**Action:** When calculating sums/counts, always prefer database-level aggregation. Ensure null handling is in place as `_sum` returns null for empty result sets.
