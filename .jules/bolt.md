## 2024-05-22 - pnpm Lockfile Hygiene
**Learning:** Running `pnpm install` in the root can inadvertently modify `pnpm-lock.yaml` by syncing it with `package.json`, adding numerous dependencies. These changes pollute the PR and should be reverted unless explicitly required.
**Action:** Always verify `git status` for unexpected `pnpm-lock.yaml` changes before committing and revert them if unrelated.
