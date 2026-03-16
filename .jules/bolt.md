## 2024-05-18 - [Fix Request Type Extension in NestJS Controllers]
**Learning:** In NestJS controllers, you cannot extend the `Request` import from `@nestjs/common` because it is a decorator factory, not a type. This causes a compilation error (TS2749).
**Action:** Always import `Request` as an `ExpressRequest` type directly from `express` (e.g., `import type { Request as ExpressRequest } from 'express';`) when creating custom typed request interfaces like `AuthenticatedRequest`.
