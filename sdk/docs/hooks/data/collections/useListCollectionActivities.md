# data/collections/useListCollectionActivities

## Type Aliases

### UseListCollectionActivitiesArgs

```ts
type UseListCollectionActivitiesArgs = UseListCollectionActivitiesParams;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx#L90)

***

### UseListCollectionActivitiesParams

```ts
type UseListCollectionActivitiesParams = Optional<ListCollectionActivitiesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx#L13)

***

### UseListCollectionActivitiesReturn

```ts
type UseListCollectionActivitiesReturn = Awaited<ReturnType<typeof fetchListCollectionActivities>>;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx:91](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx#L91)

## Functions

### useListCollectionActivities()

```ts
function useListCollectionActivities(params): UseQueryResult<ListCollectionActivitiesReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx:65](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollectionActivities.tsx#L65)

Hook to fetch a list of activities for an entire collection

Fetches activities (transfers, sales, offers, etc.) for all tokens
in a collection from the marketplace with support for pagination and sorting.

#### Parameters

##### params

[`UseListCollectionActivitiesParams`](#uselistcollectionactivitiesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ListCollectionActivitiesReturn`, `Error`\>

Query result containing activities data for the collection

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useListCollectionActivities({
  chainId: 137,
  collectionAddress: '0x...'
})
```

With pagination:
```typescript
const { data } = useListCollectionActivities({
  chainId: 1,
  collectionAddress: '0x...',
  page: 2,
  pageSize: 20
})
```

With sorting:
```typescript
const { data } = useListCollectionActivities({
  chainId: 137,
  collectionAddress: '0x...',
  sort: [{ column: 'createdAt', order: SortOrder.DESC }],
  pageSize: 50
})
```

## References

### FetchListCollectionActivitiesParams

Re-exports [FetchListCollectionActivitiesParams](../collections.md#fetchlistcollectionactivitiesparams)

***

### listCollectionActivitiesQueryOptions

Re-exports [listCollectionActivitiesQueryOptions](../collections.md#listcollectionactivitiesqueryoptions-1)

***

### ListCollectionActivitiesQueryOptions

Re-exports [ListCollectionActivitiesQueryOptions](../collections.md#listcollectionactivitiesqueryoptions)
