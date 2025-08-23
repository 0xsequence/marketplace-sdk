# data/orders/useListListingsForCollectible

## Type Aliases

### UseListListingsForCollectibleArgs

```ts
type UseListListingsForCollectibleArgs = UseListListingsForCollectibleParams;
```

Defined in: [sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx:97](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx#L97)

***

### UseListListingsForCollectibleParams

```ts
type UseListListingsForCollectibleParams = Optional<ListListingsForCollectibleQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx#L13)

***

### UseListListingsForCollectibleReturn

```ts
type UseListListingsForCollectibleReturn = Awaited<ReturnType<typeof fetchListListingsForCollectible>>;
```

Defined in: [sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx:99](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx#L99)

## Functions

### useListListingsForCollectible()

```ts
function useListListingsForCollectible(params): UseQueryResult<ListCollectibleListingsReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx:72](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListListingsForCollectible.tsx#L72)

Hook to fetch listings for a specific collectible

Fetches active listings (sales) for a specific token from the marketplace
with support for filtering and pagination.

#### Parameters

##### params

[`UseListListingsForCollectibleParams`](#uselistlistingsforcollectibleparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ListCollectibleListingsReturn`, `Error`\>

Query result containing listings data for the collectible

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useListListingsForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123'
})
```

With pagination:
```typescript
const { data } = useListListingsForCollectible({
  chainId: 1,
  collectionAddress: '0x...',
  collectibleId: '456',
  page: {
    page: 2,
    pageSize: 20
  }
})
```

With filtering:
```typescript
const { data } = useListListingsForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '789',
  filter: {
    marketplace: [MarketplaceKind.sequence_marketplace_v2],
    currencies: ['0x...'] // Specific currency addresses
  }
})
```

## References

### FetchListListingsForCollectibleParams

Re-exports [FetchListListingsForCollectibleParams](../../data.md#fetchlistlistingsforcollectibleparams)

***

### listListingsForCollectibleQueryOptions

Re-exports [listListingsForCollectibleQueryOptions](../../data.md#listlistingsforcollectiblequeryoptions-1)

***

### ListListingsForCollectibleQueryOptions

Re-exports [ListListingsForCollectibleQueryOptions](../../data.md#listlistingsforcollectiblequeryoptions)
