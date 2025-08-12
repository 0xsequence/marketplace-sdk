# data/orders/useCountOffersForCollectible

## Type Aliases

### UseCountOffersForCollectibleParams

```ts
type UseCountOffersForCollectibleParams = Optional<CountOffersForCollectibleQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useCountOffersForCollectible.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useCountOffersForCollectible.tsx#L12)

## Functions

### useCountOffersForCollectible()

```ts
function useCountOffersForCollectible(params): UseQueryResult<number, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useCountOffersForCollectible.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useCountOffersForCollectible.tsx#L53)

Hook to get the count of offers for a specific collectible

Counts the number of active offers for a given collectible in the marketplace.
Useful for displaying offer counts in UI components.

#### Parameters

##### params

[`UseCountOffersForCollectibleParams`](#usecountoffersforcollectibleparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`number`, `Error`\>

Query result containing the count of offers

#### Examples

Basic usage:
```typescript
const { data: offerCount, isLoading } = useCountOffersForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123'
})
```

With filter:
```typescript
const { data: filteredCount } = useCountOffersForCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123',
  filter: { priceRange: { min: '1000000000000000000' } }
})
```

## References

### countOffersForCollectibleQueryOptions

Re-exports [countOffersForCollectibleQueryOptions](../../data.md#countoffersforcollectiblequeryoptions-1)

***

### CountOffersForCollectibleQueryOptions

Re-exports [CountOffersForCollectibleQueryOptions](../../data.md#countoffersforcollectiblequeryoptions)

***

### FetchCountOffersForCollectibleParams

Re-exports [FetchCountOffersForCollectibleParams](../../data.md#fetchcountoffersforcollectibleparams)
