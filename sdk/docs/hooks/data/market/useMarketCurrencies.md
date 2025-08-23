# data/market/useMarketCurrencies

## Type Aliases

### UseMarketCurrenciesParams

```ts
type UseMarketCurrenciesParams = Optional<MarketCurrenciesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/market/useMarketCurrencies.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/market/useMarketCurrencies.tsx#L12)

## Functions

### useMarketCurrencies()

```ts
function useMarketCurrencies(params): UseQueryResult<{
  contractAddress: string;
}[], Error>;
```

Defined in: [sdk/src/react/hooks/data/market/useMarketCurrencies.tsx:48](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/market/useMarketCurrencies.tsx#L48)

Hook to fetch supported currencies for a marketplace

Retrieves the list of currencies supported by the marketplace for a specific chain.
Can optionally filter to exclude native currency or filter by collection.

#### Parameters

##### params

[`UseMarketCurrenciesParams`](#usemarketcurrenciesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<\{
  `contractAddress`: `string`;
\}[], `Error`\>

Query result containing supported currencies

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useMarketCurrencies({
  chainId: 137
})
```

Exclude native currency:
```typescript
const { data, isLoading } = useMarketCurrencies({
  chainId: 1,
  includeNativeCurrency: false
})
```

## References

### FetchMarketCurrenciesParams

Re-exports [FetchMarketCurrenciesParams](../../data.md#fetchmarketcurrenciesparams)

***

### marketCurrenciesQueryOptions

Re-exports [marketCurrenciesQueryOptions](../../data.md#marketcurrenciesqueryoptions-1)

***

### MarketCurrenciesQueryOptions

Re-exports [MarketCurrenciesQueryOptions](../../data.md#marketcurrenciesqueryoptions)
