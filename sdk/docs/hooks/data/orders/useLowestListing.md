# data/orders/useLowestListing

## Type Aliases

### UseLowestListingParams

```ts
type UseLowestListingParams = Optional<LowestListingQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useLowestListing.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useLowestListing.tsx#L12)

## Functions

### useLowestListing()

```ts
function useLowestListing(params): UseQueryResult<undefined | null | Order, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useLowestListing.tsx:55](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useLowestListing.tsx#L55)

Hook to fetch the lowest listing for a collectible

Retrieves the lowest priced listing currently available for a specific token
in a collection from the marketplace.

#### Parameters

##### params

[`UseLowestListingParams`](#uselowestlistingparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`undefined` \| `null` \| `Order`, `Error`\>

Query result containing the lowest listing data or null if no listings exist

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useLowestListing({
  chainId: 137,
  collectionAddress: '0x...',
  tokenId: '1'
})
```

With custom query options:
```typescript
const { data, isLoading } = useLowestListing({
  chainId: 1,
  collectionAddress: '0x...',
  tokenId: '42',
  query: {
    refetchInterval: 15000,
    enabled: hasTokenId
  }
})
```

## References

### FetchLowestListingParams

Re-exports [FetchLowestListingParams](../../data.md#fetchlowestlistingparams)

***

### lowestListingQueryOptions

Re-exports [lowestListingQueryOptions](../../data.md#lowestlistingqueryoptions-1)

***

### LowestListingQueryOptions

Re-exports [LowestListingQueryOptions](../../data.md#lowestlistingqueryoptions)
