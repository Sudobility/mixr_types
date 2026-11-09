# @sudobility/mixr_types

TypeScript type definitions for the MIXR cocktail recipe platform. This package
contains **only type declarations plus a few constants/type guards** — it is the
shared contract used by the MIXR client, backend, and apps. There is no runtime
business logic.

- **Package**: `@sudobility/mixr_types` (published to GitHub Packages)
- **Module format**: ESM only (`"type": "module"`)
- **License**: BUSL-1.1

## Installation

`@sudobility/*` packages are hosted on **GitHub Packages**, not the public npm
registry. Consumers need an `.npmrc` that routes the scope and provides a token
with `read:packages`:

```
@sudobility:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_READ_TOKEN}
```

Then install with Bun (the project's package manager):

```bash
bun add @sudobility/mixr_types
```

`@sudobility/types` is a **peer dependency** (`^1.9.78`) and must be installed by
the consumer.

## Usage

```typescript
import type {
  Equipment, Ingredient, Mood, Recipe, User,
  GenerateRecipeRequest, MixrApiResponse,
} from '@sudobility/mixr_types';

// Runtime values (constants + type guard)
import {
  EQUIPMENT_SUBCATEGORIES,
  INGREDIENT_SUBCATEGORIES,
  isSuccessResponse,
} from '@sudobility/mixr_types';
```

## What's exported

All exports live in a single file: `src/index.ts`.

### Runtime values

- `EQUIPMENT_SUBCATEGORIES` / `INGREDIENT_SUBCATEGORIES` — array constants of the subcategory string unions
- `isSuccessResponse(res)` — type guard narrowing `MixrApiResponse<T>` to `{ success: true; data: T }`

### Subcategory unions

- `EquipmentSubcategory`: `'essential' | 'glassware' | 'garnish' | 'advanced'`
- `IngredientSubcategory`: `'spirit' | 'wine' | 'other_alcohol' | 'fruit' | 'spice' | 'other'`

### Entity types

- `Equipment`, `Ingredient` — `id`, `subcategory`, `name`, `icon` (nullable), `createdAt`
- `Mood` — `emoji`, `name`, `description`, `exampleDrinks`, `imageName`, `createdAt`
- `Recipe` — `name`, `description`, `moodId`, `mood`, `ingredients[]`, `steps[]`, `equipment[]`
- `RecipeWithUser` — `Recipe` plus `userId`
- `RecipeIngredient`, `RecipeEquipment` — nested recipe relation shapes
- `User`, `UserPreferences` — snake_case fields for API compatibility; `User.id` is a Firebase UID
- `RecipeRating`, `RatingAggregate` — ratings/reviews (snake_case) and aggregate statistics

### Request types

- `GenerateRecipeRequest` — `equipment_ids?`, `ingredient_ids?`, `mood_id`
- `UpdateUserRequest`, `UpdateUserPreferencesRequest`
- `SubmitRatingRequest` (`stars`, optional `review`), `AddFavoriteRequest`

### Query parameter types

- `EquipmentQueryParams`, `IngredientQueryParams` — subcategory filters
- `PaginationQueryParams`, `RatingListParams` — `limit`/`offset` (+ `sort` for ratings)

### Response types

- `MixrApiResponse<T>` — standard wrapper (`success`, `data?`, `error?`, `count?`)
- Aliases: `EquipmentListResponse`, `EquipmentResponse`, `IngredientListResponse`,
  `MoodListResponse`, `RecipeListResponse`, `RecipeResponse`, `UserResponse`,
  `UserPreferencesResponse`, rating responses, etc.
- Custom shapes: `AddFavoriteResponse`, `RemoveFavoriteResponse`,
  `SubscriptionStatusResponse` / `SubscriptionStatusData`,
  `HealthResponse`, `VersionResponse`, `MixrErrorResponse`

### Re-exported from `@sudobility/types`

`ApiResponse`, `BaseResponse`, `NetworkClient`, `Optional`, `PaginatedResponse`,
`PaginationInfo`, `PaginationOptions`.

## Development

```bash
bun install          # Install dependencies (requires GitHub Packages auth, see above)
bun run build        # Compile to dist/ (ESM, via tsconfig.esm.json)
bun run dev          # tsc --watch
bun run typecheck    # Type-check only (tsc --noEmit)
bun run lint         # ESLint (bun run lint:fix to autofix)
bun run format       # Prettier write (format:check to verify)
bun run test:unit    # Run Vitest once
bun run test:watch   # Vitest in watch mode
bun run verify       # typecheck + lint + build
bun run clean        # Remove dist/
```

## Build output

ESM only. `bun run build` emits `dist/index.js`, `dist/index.d.ts`, and source/
declaration maps. `package.json` points `main`/`types`/`exports` at those files.

## Publishing

Publishing is handled by CI (`.github/workflows/ci-cd.yml`, which calls the shared
`johnqh/workflows` unified pipeline with `publish-target: github`) on pushes to
`main`/`develop`. `prepublishOnly` runs `clean` + `verify`. Bump the version in
`package.json` to release.

## Package hierarchy

Base types package consumed by the rest of the MIXR stack:

- `@sudobility/mixr_client` — API client and React hooks
- `@sudobility/mixr_lib` — business logic and utilities
- `mixr_api` — backend API server
- `mixr` — frontend web app
