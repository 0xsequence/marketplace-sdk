# data/tokens/useTokenSupplies

## Type Aliases

### UseTokenSuppliesParams

```ts
type UseTokenSuppliesParams = Optional<TokenSuppliesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/tokens/useTokenSupplies.ts:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useTokenSupplies.ts#L12)

## Functions

### useTokenSupplies()

```ts
function useTokenSupplies(params): UseInfiniteQueryResult<InfiniteData<GetTokenSuppliesReturn, unknown>, Error>;
```

Defined in: [sdk/src/react/hooks/data/tokens/useTokenSupplies.ts:64](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useTokenSupplies.ts#L64)

Hook to fetch token supplies from the indexer or LAOS API

Retrieves supply information for tokens from a specific collection.
Automatically chooses between indexer and LAOS APIs based on the isLaos721 flag.

#### Parameters

##### params

[`UseTokenSuppliesParams`](#usetokensuppliesparams)

Configuration parameters

#### Returns

`UseInfiniteQueryResult`\<`InfiniteData`\<`GetTokenSuppliesReturn`, `unknown`\>, `Error`\>

Query result containing token supplies

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useTokenSupplies({
  chainId: 137,
  collectionAddress: '0x...'
})
```

With LAOS API:
```typescript
const { data, isLoading } = useTokenSupplies({
  chainId: 1,
  collectionAddress: '0x...',
  isLaos721: true
})
```

With conditional fetching:
```typescript
const { data, isLoading } = useTokenSupplies({
  chainId: 1,
  collectionAddress: selectedCollection,
  query: {
    enabled: !!selectedCollection
  }
})
```

## References

### FetchTokenSuppliesParams

Re-exports [FetchTokenSuppliesParams](../../data.md#fetchtokensuppliesparams)

***

### tokenSuppliesQueryOptions

Re-exports [tokenSuppliesQueryOptions](../../data.md#tokensuppliesqueryoptions-1)

***

### TokenSuppliesQueryOptions

Re-exports [TokenSuppliesQueryOptions](../../data.md#tokensuppliesqueryoptions)
