## 2025-01-28 - Monorepo Lockfile Pollution
**Vulnerability:** Unexpected build artifact changes (lockfile pollution).
**Learning:** Running `pnpm install` in the root workspace to fix a missing test dependency in `api` caused unrelated frontend dependencies (e.g., `@radix-ui`) to be added to `pnpm-lock.yaml`, leading to a rejected PR. This implies `pnpm-lock.yaml` was potentially stale or sensitive to environment differences.
**Prevention:** Always verify `pnpm-lock.yaml` changes carefully. If only one workspace is touched, revert unrelated lockfile changes or use `--frozen-lockfile` in CI steps. Use `git checkout HEAD -- pnpm-lock.yaml` if dependencies were not intentionally added.
