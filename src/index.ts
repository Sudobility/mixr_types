/**
 * @sudobility/mixr_types
 * TypeScript types for MIXR API - Cocktail recipe platform
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
} from '@sudobility/types';

import type { Optional } from '@sudobility/types';

// =============================================================================
// Enum Types
// =============================================================================

/**
 * Equipment subcategory types
 */
export type EquipmentSubcategory =
  'essential' | 'glassware' | 'garnish' | 'advanced';

/**
 * Ingredient subcategory types
 */
export type IngredientSubcategory =
  'spirit' | 'wine' | 'other_alcohol' | 'fruit' | 'spice' | 'other';

/**
 * List of equipment subcategories
 */
export const EQUIPMENT_SUBCATEGORIES: EquipmentSubcategory[] = [
  'essential',
  'glassware',
  'garnish',
  'advanced',
];

/**
 * List of ingredient subcategories
 */
export const INGREDIENT_SUBCATEGORIES: IngredientSubcategory[] = [
  'spirit',
  'wine',
  'other_alcohol',
  'fruit',
  'spice',
  'other',
];

// =============================================================================
// API Response wrapper (matches existing MixrApiResponse)
// =============================================================================

/**
 * API Response wrapper
 */
export interface MixrApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

/**
 * Type guard that narrows a {@link MixrApiResponse} to a successful response
 * where `success` is `true` and `data` is guaranteed to be present.
 *
 * @example
 * ```ts
 * const res: MixrApiResponse<Recipe[]> = await fetchRecipes();
 * if (isSuccessResponse(res)) {
 *   // res.data is Recipe[] (not undefined)
 *   console.log(res.data.length);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  res: MixrApiResponse<T>
): res is MixrApiResponse<T> & { success: true; data: T } {
  return res.success === true && res.data !== undefined;
}

// =============================================================================
// Entity Types (database models)
// =============================================================================

/**
 * Equipment item (e.g., shaker, jigger, glass)
 */
export interface Equipment {
  /** Unique numeric identifier */
  id: number;
  /** Category grouping: essential, glassware, garnish, or advanced */
  subcategory: EquipmentSubcategory;
  /** Display name of the equipment */
  name: string;
  /** Optional icon image filename; null when no icon is assigned */
  icon: Optional<string>;
  /** ISO 8601 timestamp of when the equipment was created */
  createdAt: string;
}

/**
 * Ingredient (e.g., vodka, lime juice, sugar)
 */
export interface Ingredient {
  /** Unique numeric identifier */
  id: number;
  /** Category grouping: spirit, wine, other_alcohol, fruit, spice, or other */
  subcategory: IngredientSubcategory;
  /** Display name of the ingredient */
  name: string;
  /** Optional icon image filename; null when no icon is assigned */
  icon: Optional<string>;
  /** ISO 8601 timestamp of when the ingredient was created */
  createdAt: string;
}

/**
 * Mood for cocktail selection (e.g., celebratory, relaxed)
 */
export interface Mood {
  /** Unique numeric identifier */
  id: number;
  /** Single emoji character representing the mood (e.g., "🎉", "😌") */
  emoji: string;
  /** Display name of the mood */
  name: string;
  /** Human-readable description of the mood */
  description: string;
  /** Comma-separated list of example cocktails for this mood */
  exampleDrinks: string;
  /** Optional image filename for the mood; null when no image is assigned */
  imageName: Optional<string>;
  /** ISO 8601 timestamp of when the mood was created */
  createdAt: string;
}

/**
 * User profile (snake_case for API compatibility)
 */
export interface User {
  /** Firebase UID - unique identifier from Firebase Authentication */
  id: string;
  /** User's email address */
  email: string;
  /** User's chosen display name */
  display_name: string;
  /** ISO 8601 timestamp of when the user account was created */
  created_at: string;
  /** ISO 8601 timestamp of the last profile update */
  updated_at: string;
}

/**
 * User preferences for equipment and ingredients (snake_case for API compatibility)
 */
export interface UserPreferences {
  /** Array of equipment IDs the user has selected */
  equipment_ids: number[];
  /** Array of ingredient IDs the user has available */
  ingredient_ids: number[];
  /** ISO 8601 timestamp of the last preferences update */
  updated_at: string;
}

/**
 * Recipe ingredient with amount
 */
export interface RecipeIngredient {
  /** Ingredient ID referencing the Ingredient entity */
  id: number;
  /** Display name of the ingredient */
  name: string;
  /** Optional icon image filename; null when no icon is assigned */
  icon: Optional<string>;
  /** Human-readable amount string (e.g., "2 oz", "1/2 cup", "1 dash") */
  amount: string;
}

/**
 * Recipe equipment item
 */
export interface RecipeEquipment {
  /** Equipment ID referencing the Equipment entity */
  id: number;
  /** Display name of the equipment */
  name: string;
  /** Optional icon image filename; null when no icon is assigned */
  icon: Optional<string>;
}

/**
 * Complete recipe with all relations
 */
export interface Recipe {
  /** Unique numeric identifier */
  id: number;
  /** Display name of the recipe (e.g., "Classic Martini") */
  name: string;
  /** Optional description of the recipe; null when not provided */
  description: Optional<string>;
  /** Optional mood ID this recipe is associated with; null when unassigned */
  moodId: Optional<number>;
  /** ISO 8601 timestamp of when the recipe was created */
  createdAt: string;
  /** Expanded mood relation; null when not loaded or unassigned */
  mood: Optional<Mood>;
  /** Ordered list of ingredients with amounts */
  ingredients: RecipeIngredient[];
  /** Ordered list of preparation steps as plain text */
  steps: string[];
  /** List of equipment needed to make the recipe */
  equipment: RecipeEquipment[];
}

/**
 * Recipe with userId field indicating the user who generated it
 */
export interface RecipeWithUser extends Recipe {
  /** Firebase UID of the user who generated this recipe; null for system recipes */
  userId: Optional<string>;
}

/**
 * Recipe rating/review by a user (snake_case for API compatibility)
 */
export interface RecipeRating {
  /** Unique numeric identifier */
  id: number;
  /** ID of the recipe being rated */
  recipe_id: number;
  /** Firebase UID of the user who submitted the rating */
  user_id: string;
  /** Display name of the rating author */
  user_name: string;
  /** Email of the rating author */
  user_email: string;
  /** Rating value from 1 (worst) to 5 (best) */
  stars: number;
  /** Optional text review; null when the user only submitted a star rating */
  review: Optional<string>;
  /** ISO 8601 timestamp of when the rating was created */
  created_at: string;
  /** ISO 8601 timestamp of the last rating update */
  updated_at: string;
}

/**
 * Rating aggregate statistics for a recipe
 */
export interface RatingAggregate {
  /** ID of the recipe these statistics belong to */
  recipe_id: number;
  /** Mean star rating across all ratings (1.0 - 5.0) */
  average_rating: number;
  /** Total number of ratings submitted */
  total_ratings: number;
  /** Breakdown of how many ratings were given at each star level */
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

// =============================================================================
// Request Body Types
// =============================================================================

/**
 * Request to update user profile
 */
export interface UpdateUserRequest {
  /** New display name for the user; must be non-empty */
  display_name: string;
}

/**
 * Request to update user preferences
 */
export interface UpdateUserPreferencesRequest {
  /** Array of equipment IDs the user has selected */
  equipment_ids: number[];
  /** Array of ingredient IDs the user has available */
  ingredient_ids: number[];
}

/**
 * Request to add a recipe to favorites
 */
export interface AddFavoriteRequest {
  /** ID of the recipe to add to favorites */
  recipe_id: number;
}

/**
 * Request to submit a recipe rating
 */
export interface SubmitRatingRequest {
  /** Rating value from 1 (worst) to 5 (best) */
  stars: number;
  /** Optional text review to accompany the star rating */
  review?: string;
}

/**
 * Request to generate a recipe based on available equipment, ingredients, and mood
 */
export interface GenerateRecipeRequest {
  /** Array of available equipment IDs; falls back to user preferences when omitted */
  equipment_ids?: number[];
  /** Array of available ingredient IDs; falls back to user preferences when omitted */
  ingredient_ids?: number[];
  /** ID of the selected mood for recipe generation */
  mood_id: number;
}

// =============================================================================
// Query Parameter Types
// =============================================================================

/**
 * Query params for equipment list
 */
export interface EquipmentQueryParams {
  subcategory?: EquipmentSubcategory;
}

/**
 * Query params for ingredient list
 */
export interface IngredientQueryParams {
  subcategory?: IngredientSubcategory;
}

/**
 * Pagination query params
 */
export interface PaginationQueryParams {
  limit?: number;
  offset?: number;
}

/**
 * Rating list query params
 */
export interface RatingListParams {
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}

// =============================================================================
// API Response Type Aliases
// =============================================================================

// Equipment responses
export type EquipmentListResponse = MixrApiResponse<Equipment[]>;
export type EquipmentResponse = MixrApiResponse<Equipment>;
export type EquipmentSubcategoriesResponse = MixrApiResponse<string[]>;

// Ingredient responses
export type IngredientListResponse = MixrApiResponse<Ingredient[]>;
export type IngredientResponse = MixrApiResponse<Ingredient>;
export type IngredientSubcategoriesResponse = MixrApiResponse<string[]>;

// Mood responses
export type MoodListResponse = MixrApiResponse<Mood[]>;
export type MoodResponse = MixrApiResponse<Mood>;

// Recipe responses
export type RecipeListResponse = MixrApiResponse<Recipe[]>;
export type RecipeResponse = MixrApiResponse<Recipe>;

// User responses
export type UserResponse = MixrApiResponse<User>;
export type UserPreferencesResponse = MixrApiResponse<UserPreferences>;

// Favorites responses
export interface AddFavoriteResponse {
  success: boolean;
  message: string;
}

export interface RemoveFavoriteResponse {
  success: boolean;
  message: string;
}

// Rating responses
export type RecipeRatingResponse = MixrApiResponse<RecipeRating>;
export type RecipeRatingListResponse = MixrApiResponse<RecipeRating[]>;
export type RatingAggregateResponse = MixrApiResponse<RatingAggregate>;
export type DeleteRatingResponse = MixrApiResponse<{ message: string }>;

// =============================================================================
// Subscription types
// =============================================================================

/**
 * Subscription status data returned from the subscriptions endpoint
 */
export interface SubscriptionStatusData {
  /** Whether the user has an active subscription */
  hasSubscription: boolean;
  /** Array of active entitlement names */
  entitlements: string[];
  /** When the subscription started (ISO date or Date), or null if no subscription */
  subscriptionStartedAt: string | Date | null;
  /** Platform where the subscription was purchased, or null if no subscription */
  platform: string | null;
}

/**
 * Response from GET /api/v1/users/:userId/subscriptions
 */
export interface SubscriptionStatusResponse {
  success: boolean;
  data?: SubscriptionStatusData;
  error?: string;
  timestamp: string;
}

// =============================================================================
// Not found / error response type
// =============================================================================

/**
 * Standard error response for 4xx/5xx errors
 */
export type MixrErrorResponse = MixrApiResponse<never>;

// =============================================================================
// Health check types
// =============================================================================

export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
}

export interface VersionResponse {
  success: boolean;
  message: string;
  version: string;
}
