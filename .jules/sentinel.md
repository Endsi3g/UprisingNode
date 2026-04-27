## 2024-04-27 - Hardcoded JWT Secret Fallback Vulnerability
**Vulnerability:** A hardcoded default 'secret' was used as a fallback for the JWT_SECRET environment variable in auth.module.ts and jwt.strategy.ts.
**Learning:** Fallbacks like process.env.JWT_SECRET || 'secret' create a critical vulnerability by allowing tokens signed with a widely known secret if the environment is misconfigured. To prevent breaking test suites, errors should be thrown inside useFactory or the class constructor rather than at the module evaluation level.
**Prevention:** Never use hardcoded secrets or fallbacks in authentication configurations. Enforce strict checks that throw initialization errors when required security environment variables are missing.
