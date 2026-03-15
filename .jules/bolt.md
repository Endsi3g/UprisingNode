
## 2024-03-15 - Prisma groupBy _count syntax
**Learning:** When using Prisma's `groupBy` feature, the `_count` property takes an object like `{ _all: true }`, not a boolean `true`. Using a boolean fails at runtime/compile-time, and even if it worked, `group._count` would return an object resulting in type coercion bugs like `"0[object Object]"`.
**Action:** Always use `{ _all: true }` and access the value via `group._count._all` to safely aggregate counts in Prisma queries.
