# data/collectibles/useListCollectibles

## Type Aliases

### UseListCollectiblesArgs

```ts
type UseListCollectiblesArgs = UseListCollectiblesParams;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx:93](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx#L93)

***

### UseListCollectiblesParams

```ts
type UseListCollectiblesParams = Optional<ListCollectiblesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx#L12)

## Functions

### useListCollectibles()

```ts
function useListCollectibles(params): UseInfiniteQueryResult<InfiniteData<ListCollectiblesReturn, unknown>, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx:73](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibles.tsx#L73)

Hook to fetch a list of collectibles with infinite pagination support

Fetches collectibles from the marketplace with support for filtering, pagination,
and special handling for shop marketplace types and LAOS721 contracts.

#### Parameters

##### params

[`UseListCollectiblesParams`](#uselistcollectiblesparams)

Configuration parameters

#### Returns

`UseInfiniteQueryResult`\<`InfiniteData`\<`ListCollectiblesReturn`, `unknown`\>, `Error`\>

Infinite query result containing collectibles data with pagination

#### Examples

Basic usage:
```typescript
const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
  chainId: 137,
  collectionAddress: '0x...',
  side: OrderSide.listing
})
```

With filtering:
```typescript
const { data, fetchNextPage } = useListCollectibles({
  chainId: 1,
  collectionAddress: '0x...',
  side: OrderSide.listing,
  filter: {
    searchText: 'dragon',
    includeEmpty: false,
    marketplaces: [MarketplaceKind.sequence_marketplace_v2]
  }
})
```

For LAOS721 collections:
```typescript
const { data } = useListCollectibles({
  chainId: 137,
  collectionAddress: '0x...',
  side: OrderSide.listing,
  isLaos721: true,
  filter: {
    inAccounts: ['0x...']
  }
})
```

## References

### FetchListCollectiblesParams

Re-exports [FetchListCollectiblesParams](../collectibles.md#fetchlistcollectiblesparams)

***

### listCollectiblesQueryOptions

Re-exports [listCollectiblesQueryOptions](../collectibles.md#listcollectiblesqueryoptions-1)

***

### ListCollectiblesQueryOptions

Re-exports [ListCollectiblesQueryOptions](../collectibles.md#listcollectiblesqueryoptions)
