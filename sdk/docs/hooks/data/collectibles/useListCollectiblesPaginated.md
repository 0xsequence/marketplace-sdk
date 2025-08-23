# data/collectibles/useListCollectiblesPaginated

## Type Aliases

### UseListCollectiblesPaginatedArgs

```ts
type UseListCollectiblesPaginatedArgs = UseListCollectiblesPaginatedParams;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx:103](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx#L103)

***

### UseListCollectiblesPaginatedParams

```ts
type UseListCollectiblesPaginatedParams = Optional<ListCollectiblesPaginatedQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx#L13)

***

### UseListCollectiblesPaginatedReturn

```ts
type UseListCollectiblesPaginatedReturn = Awaited<ReturnType<typeof fetchListCollectiblesPaginated>>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx:105](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx#L105)

## Functions

### useListCollectiblesPaginated()

```ts
function useListCollectiblesPaginated(params): UseQueryResult<ListCollectiblesReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx:78](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx#L78)

Hook to fetch a list of collectibles with pagination support

Fetches collectibles from the marketplace with support for filtering and pagination.
Unlike the infinite query version, this hook fetches a specific page of results.

#### Parameters

##### params

[`UseListCollectiblesPaginatedParams`](#uselistcollectiblespaginatedparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ListCollectiblesReturn`, `Error`\>

Query result containing collectibles data for the specific page

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useListCollectiblesPaginated({
  chainId: 137,
  collectionAddress: '0x...',
  side: OrderSide.listing,
  page: 1,
  pageSize: 20
})
```

With filtering:
```typescript
const { data } = useListCollectiblesPaginated({
  chainId: 1,
  collectionAddress: '0x...',
  side: OrderSide.listing,
  page: 2,
  pageSize: 50,
  filter: {
    searchText: 'rare',
    includeEmpty: false
  }
})
```

Controlled pagination:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const { data, isLoading } = useListCollectiblesPaginated({
  chainId: 137,
  collectionAddress: '0x...',
  side: OrderSide.listing,
  page: currentPage,
  pageSize: 25
});

const hasMorePages = data?.page?.more;
```

## References

### FetchListCollectiblesPaginatedParams

Re-exports [FetchListCollectiblesPaginatedParams](../collectibles.md#fetchlistcollectiblespaginatedparams)

***

### listCollectiblesPaginatedQueryOptions

Re-exports [listCollectiblesPaginatedQueryOptions](../collectibles.md#listcollectiblespaginatedqueryoptions-1)

***

### ListCollectiblesPaginatedQueryOptions

Re-exports [ListCollectiblesPaginatedQueryOptions](../collectibles.md#listcollectiblespaginatedqueryoptions)
