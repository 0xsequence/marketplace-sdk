# data/orders/useCountListingsForCollectible

## Type Aliases

### UseCountListingsForCollectibleParams

```ts
type UseCountListingsForCollectibleParams = Optional<CountListingsForCollectibleQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useCountListingsForCollectible.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useCountListingsForCollectible.tsx#L12)

## Functions

### useCountListingsForCollectible()

```ts
function useCountListingsForCollectible(params): UseQueryResult<number, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useCountListingsForCollectible.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useCountListingsForCollectible.tsx#L53)

Hook to get the count of listings for a specific collectible

Counts the number of active listings for a given collectible in the marketplace.
Useful for displaying listing counts in UI components.

#### Parameters

##### params

[`UseCountListingsForCollectibleParams`](#usecountlistingsforcollectibleparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`number`, `Error`\>

Query result containing the count of listings

#### Examples

Basic usage:
```typescript
const { data: listingCount, isLoading } = useCountListingsForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123'
})
```

With filter:
```typescript
const { data: filteredCount } = useCountListingsForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123',
  filter: { priceRange: { min: '1000000000000000000' } }
})
```

## References

### countListingsForCollectibleQueryOptions

Re-exports [countListingsForCollectibleQueryOptions](../../data.md#countlistingsforcollectiblequeryoptions-1)

***

### CountListingsForCollectibleQueryOptions

Re-exports [CountListingsForCollectibleQueryOptions](../../data.md#countlistingsforcollectiblequeryoptions)

***

### FetchCountListingsForCollectibleParams

Re-exports [FetchCountListingsForCollectibleParams](../../data.md#fetchcountlistingsforcollectibleparams)
