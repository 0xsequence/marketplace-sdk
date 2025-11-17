# Custom Validation Proposal for `buildQueryOptions`

## The Problem

Two query files need array length validation:
- `checkout/market-checkout-options.ts` - requires `orders.length > 0`
- `checkout/primary-sale-checkout-options.ts` - requires `items.length > 0`

Currently, `buildQueryOptions` only checks truthiness:
```typescript
const enabled = Boolean(
  config.requiredParams.every((key) => params[key]) &&
    params.config &&
    (params.query?.enabled ?? true),
);
```

Empty arrays `[]` are truthy, so they pass validation but shouldn't make API requests.

## Current State

These files use manual pattern with explicit `.length` checks:
```typescript
const enabled = Boolean(
  params.chainId &&
    params.walletAddress &&
    params.orders?.length &&  // ← Array length check
    params.config &&
    (params.query?.enabled ?? true),
);
```

## Proposed Solution

Add optional `customValidation` function to `buildQueryOptions`:

### API Design

```typescript
export interface QueryBuilderConfig<TParams extends BaseQueryParams, TData> {
  getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
  requiredParams: EnsureAllRequiredKeys<...>;
  fetcher: (params: TParams) => Promise<TData>;
  /** Optional custom validation beyond truthiness checks */
  customValidation?: (params: WithOptionalParams<TParams>) => boolean;
}
```

### Implementation

```typescript
export function buildQueryOptions<...>(
  config: {
    getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
    requiredParams: TKeys & (...);
    fetcher: (params: TParams) => Promise<TData>;
    customValidation?: (params: WithOptionalParams<TParams>) => boolean;
  },
  params: WithOptionalParams<TParams>,
) {
  // Check if all required params are present
  const requiredParamsValid = config.requiredParams.every(
    (key) => params[key]
  );
  
  // Run custom validation if provided
  const customValid = config.customValidation 
    ? config.customValidation(params)
    : true;
  
  const enabled = Boolean(
    requiredParamsValid &&
      customValid &&
      params.config &&
      (params.query?.enabled ?? true),
  );

  return queryOptions({
    queryKey: config.getQueryKey(params),
    queryFn: () => config.fetcher(params as TParams),
    ...params.query,
    enabled,
  });
}
```

### Usage Example

```typescript
export function marketCheckoutOptionsQueryOptions(
  params: WithOptionalParams<FetchMarketCheckoutOptionsParams>,
) {
  return buildQueryOptions(
    {
      getQueryKey: getMarketCheckoutOptionsQueryKey,
      requiredParams: ['chainId', 'walletAddress', 'orders', 'config'] as const,
      fetcher: fetchMarketCheckoutOptions,
      customValidation: (params) => (params.orders?.length ?? 0) > 0,
    },
    params,
  );
}
```

## Ugliness Assessment

### Pros ✅
- **Minimal API surface**: Single optional parameter
- **Type-safe**: Full TypeScript support
- **Flexible**: Handles any custom validation logic
- **Optional**: Doesn't affect existing usage
- **Clean separation**: Required params vs custom logic

### Cons ❌
- **Slight complexity increase**: One more optional parameter
- **Potential overuse**: Developers might use it when they shouldn't
- **Debugging**: Custom validation errors might be less obvious

### Ugliness Score: **3/10** 

It's actually pretty clean! The API is:
- **Intuitive**: Optional parameter with clear purpose
- **Consistent**: Follows existing pattern of optional `query` param
- **Minimal**: Only adds ~5 lines to implementation
- **Type-safe**: No type gymnastics required

## Alternative: Keep Manual Pattern

### Pros ✅
- **No changes to `buildQueryOptions`**: Keeps it simple
- **Explicit validation**: Clear what's being checked
- **Only 2 files**: Small maintenance burden

### Cons ❌
- **Inconsistency**: 2 files use different pattern
- **Boilerplate**: Manual null assertions and biome-ignore comments
- **Missed opportunity**: Can't fully standardize queries

## Recommendation

**Option 1: Add `customValidation`** ⭐ RECOMMENDED

This is the cleanest solution because:
1. It's not ugly - just one optional parameter
2. Allows full migration to `buildQueryOptions` (27/27 files!)
3. Removes all biome-ignore comments
4. Type-safe and flexible
5. Minimal complexity increase

**Option 2: Keep Manual Pattern**

Acceptable if you prefer to keep `buildQueryOptions` absolutely minimal. Only 2 files affected.

**Option 3: Update Tests**

Remove `.length` validation entirely - let empty arrays enable queries. API will return empty results gracefully. This is the simplest but changes business logic.

## Implementation Effort

- **Option 1**: ~15 minutes (add customValidation + update 2 files)
- **Option 2**: 0 minutes (keep as-is)
- **Option 3**: ~5 minutes (update 2 test files)
