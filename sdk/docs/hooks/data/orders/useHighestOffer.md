# data/orders/useHighestOffer

## Type Aliases

### UseHighestOfferParams

```ts
type UseHighestOfferParams = Optional<HighestOfferQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useHighestOffer.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useHighestOffer.tsx#L12)

## Functions

### useHighestOffer()

```ts
function useHighestOffer(params): UseQueryResult<null | Order, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useHighestOffer.tsx:55](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useHighestOffer.tsx#L55)

Hook to fetch the highest offer for a collectible

Retrieves the highest offer currently available for a specific token
in a collection from the marketplace.

#### Parameters

##### params

[`UseHighestOfferParams`](#usehighestofferparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`null` \| `Order`, `Error`\>

Query result containing the highest offer data or null if no offers exist

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useHighestOffer({
  chainId: 137,
  collectionAddress: '0x...',
  tokenId: '1'
})
```

With custom query options:
```typescript
const { data, isLoading } = useHighestOffer({
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

### FetchHighestOfferParams

Re-exports [FetchHighestOfferParams](../../data.md#fetchhighestofferparams)

***

### highestOfferQueryOptions

Re-exports [highestOfferQueryOptions](../../data.md#highestofferqueryoptions-1)

***

### HighestOfferQueryOptions

Re-exports [HighestOfferQueryOptions](../../data.md#highestofferqueryoptions)
