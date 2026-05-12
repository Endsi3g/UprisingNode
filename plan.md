1. **Optimize `getBalance` in `api/src/transactions/transactions.service.ts`**
   - Use `Promise.all` with Prisma's `aggregate` to compute the sum of `COMMISSION` (with status `PAID`) and `WITHDRAWAL` (with status not `CANCELLED`) at the database level instead of fetching all transactions and using an in-memory array `reduce`.
   - Add inline code comments to explain the optimization and document its expected performance impact (reducing O(N) memory usage and data transfer to O(1)).
2. **Verify Changes and Run Tests**
   - Run format and lint checks in the `api` workspace (e.g., `npm run lint` or `npx eslint`).
   - Run the full test suite in the `api` workspace (e.g., `npm run test`) to ensure the optimization is safe and functionally correct.
3. **Pre-commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
4. **Submit Pull Request**
   - Create a Pull Request with the exact title `⚡ Bolt: [performance improvement]`.
   - Include sections: `💡 What`, `🎯 Why`, `📊 Impact`, and `🔬 Measurement` in the PR description using the `create_pull_request` tool (or equivalent).
