# data/collectibles/useListCollectibleActivities

## Type Aliases

### UseListCollectibleActivitiesArgs

```ts
type UseListCollectibleActivitiesArgs = UseListCollectibleActivitiesParams;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx:94](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx#L94)

***

### UseListCollectibleActivitiesParams

```ts
type UseListCollectibleActivitiesParams = Optional<ListCollectibleActivitiesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx#L13)

***

### UseListCollectibleActivitiesReturn

```ts
type UseListCollectibleActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectibleActivities>>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx:96](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx#L96)

## Functions

### useListCollectibleActivities()

```ts
function useListCollectibleActivities(params): UseQueryResult<ListCollectibleActivitiesReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx:69](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectibleActivities.tsx#L69)

Hook to fetch a list of activities for a specific collectible

Fetches activities (transfers, sales, offers, etc.) for a specific token
from the marketplace with support for pagination and sorting.

#### Parameters

##### params

[`UseListCollectibleActivitiesParams`](#uselistcollectibleactivitiesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ListCollectibleActivitiesReturn`, `Error`\>

Query result containing activities data

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useListCollectibleActivities({
  chainId: 137,
  collectionAddress: '0x...',
  tokenId: '123'
})
```

With pagination:
```typescript
const { data } = useListCollectibleActivities({
  chainId: 1,
  collectionAddress: '0x...',
  tokenId: '456',
  page: 2,
  pageSize: 20
})
```

With sorting:
```typescript
const { data } = useListCollectibleActivities({
  chainId: 137,
  collectionAddress: '0x...',
  tokenId: '789',
  sort: 'timestamp_desc',
  pageSize: 50
})
```

## References

### FetchListCollectibleActivitiesParams

Re-exports [FetchListCollectibleActivitiesParams](../collectibles.md#fetchlistcollectibleactivitiesparams)

***

### listCollectibleActivitiesQueryOptions

Re-exports [listCollectibleActivitiesQueryOptions](../collectibles.md#listcollectibleactivitiesqueryoptions-1)

***

### ListCollectibleActivitiesQueryOptions

Re-exports [ListCollectibleActivitiesQueryOptions](../collectibles.md#listcollectibleactivitiesqueryoptions)
