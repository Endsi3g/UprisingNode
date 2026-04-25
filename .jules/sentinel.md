## 2024-04-25 - Hardcoded JWT Secret Fallback in NestJS
**Vulnerability:** Hardcoded JWT secret fallback (`'secret'`) in `auth.module.ts` and `jwt.strategy.ts`.
**Learning:** In NestJS `JwtModule` and Passport strategies, a hardcoded fallback like `process.env.JWT_SECRET || 'secret'` is a critical vulnerability. When removing it to enforce secure configuration, explicitly throw an error if the variable is undefined. However, to prevent breaking test suite imports, do not throw at the file-evaluation level; instead, throw inside `useFactory` (using `JwtModule.registerAsync`) or inside the class `constructor`.
**Prevention:** Always use `registerAsync` for module registration and validate environment variables inside constructors or factory functions, never at the file-evaluation level.
