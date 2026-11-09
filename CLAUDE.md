# MIXR Types

> **Git policy — never auto-commit or auto-push.** Leave work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when
> the user explicitly asks in that turn**. Approval for an earlier change does not
> carry forward, and finishing a task is not permission to commit it.

TypeScript type definitions for the MIXR cocktail-recipe platform. **Types-only
package**: `src/index.ts` holds every declaration plus two array constants and one
type guard (`isSuccessResponse`). No runtime business logic, no React, no app code.

- **npm name**: `@sudobility/mixr_types` — published to **GitHub Packages** (not public npm)
- **License**: BUSL-1.1

## Stack

- TypeScript (`~5.9`), ESM only (`"type": "module"` — no CommonJS build)
- Bun runtime + package manager (do not use npm/yarn/pnpm to install)
- Build: `tsc` via `tsconfig.esm.json`
- Test: Vitest
- Lint: ESLint flat config + Prettier

## Commands (all verified)

```bash
bun install        # requires GitHub Packages auth (see Registry below)
bun run build      # tsc -p tsconfig.esm.json -> dist/ (ESM only)
bun run typecheck  # tsc --noEmit
bun run lint       # eslint src/   (lint:fix to autofix)
bun run format     # prettier --write (format:check to verify)
bun run test:unit  # vitest run   (test:watch for watch mode)
bun run verify     # typecheck + lint + build
bun run clean      # rm -rf dist dist-cjs
```

There is **no `bun run test`** and **no `build:esm`/`build:cjs`** scripts — use the
names above. The test script is `test:unit`.

## Gotchas

- **ESM only.** Despite older docs, there is no dual ESM/CJS build. `bun run build`
  emits only `dist/index.js` + `dist/index.d.ts` (+ maps). `package.json` `main`,
  `types`, and `exports` all point at the ESM files; there is no `dist/index.cjs`.
- **Registry**: `.npmrc` scopes `@sudobility` to `https://npm.pkg.github.com`.
  Installing (including the `@sudobility/types` peer dep) needs a token with
  `read:packages` (`GH_PACKAGES_READ_TOKEN`). Install fails without it.
- **Peer dependency**: `@sudobility/types ^1.9.78`. `src/index.ts` re-exports
  `Optional`, `ApiResponse`, `PaginatedResponse`, etc. from it, so types here depend
  on that package being present in the consumer.
- **snake_case vs camelCase is intentional.** API-facing shapes (`User`,
  `UserPreferences`, `RecipeRating`, request bodies) use snake_case to match the
  wire format; entity fields like `createdAt`/`moodId` use camelCase. Match the
  existing field style of the surrounding type — don't "normalize" it.
- **Nullable fields** use `Optional<T>` (from `@sudobility/types`), not `T | null`
  spelled out. Follow that convention.
- `eslint.config.js` is the active flat config; `eslint.config.mjs` also exists and
  is effectively unused.

## Architecture

Single source file, grouped by section comments: enum/union types + constants →
`MixrApiResponse<T>` + `isSuccessResponse` guard → entity types → request bodies →
query params → response-type aliases → subscription/health/version types. Response
aliases are thin wrappers (`type X = MixrApiResponse<Y>`); a few responses define
bespoke shapes (`AddFavoriteResponse`, `HealthResponse`, `VersionResponse`,
`SubscriptionStatusResponse`) — see `plans/IMPROVEMENTS.md` for the standing note to
consolidate these onto `MixrApiResponse<T>`.

Tests (`src/__tests__/index.test.ts`) are compile-time shape checks plus runtime
assertions on the constants and `isSuccessResponse`.

## Publishing

CI (`.github/workflows/ci-cd.yml`) calls the shared `johnqh/workflows` unified
pipeline with `publish-target: github` on pushes to `main`/`develop`.
`prepublishOnly` runs `clean` + `verify`. Release by bumping `version` in
`package.json`.

## Package hierarchy

Base types package consumed by `@sudobility/mixr_client` (hooks) and
`@sudobility/mixr_lib` (logic), then `mixr` (frontend) and `mixr_api` (backend).

## Git workflow

Do not use feature branches for code changes; stay on the current branch.
