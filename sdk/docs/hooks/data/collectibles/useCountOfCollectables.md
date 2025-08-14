# data/collectibles/useCountOfCollectables

## Type Aliases

### UseCountOfCollectablesParams

```ts
type UseCountOfCollectablesParams = Optional<CountOfCollectablesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useCountOfCollectables.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useCountOfCollectables.tsx#L12)

## Functions

### useCountOfCollectables()

```ts
function useCountOfCollectables(params): UseQueryResult<number, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useCountOfCollectables.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useCountOfCollectables.tsx#L53)

Hook to get the count of collectibles in a market collection

Counts either all collectibles or filtered collectibles based on provided parameters.
When filter and side parameters are provided, returns count of filtered collectibles.
Otherwise returns count of all collectibles in the collection.

#### Parameters

##### params

[`UseCountOfCollectablesParams`](#usecountofcollectablesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`number`, `Error`\>

Query result containing the count of collectibles

#### Examples

Basic usage (count all collectibles):
```typescript
const { data: totalCount, isLoading } = useCountOfCollectables({
  chainId: 137,
  collectionAddress: '0x...'
})
```

With filters (count filtered collectibles):
```typescript
const { data: filteredCount } = useCountOfCollectables({
  chainId: 137,
  collectionAddress: '0x...',
  filter: { priceRange: { min: '1000000000000000000' } },
  side: OrderSide.SELL
})
```

## References

### countOfCollectablesQueryOptions

Re-exports [countOfCollectablesQueryOptions](../collectibles.md#countofcollectablesqueryoptions-1)

***

### CountOfCollectablesQueryOptions

Re-exports [CountOfCollectablesQueryOptions](../collectibles.md#countofcollectablesqueryoptions)

***

### FetchCountOfCollectablesParams

Re-exports [FetchCountOfCollectablesParams](../collectibles.md#fetchcountofcollectablesparams)
