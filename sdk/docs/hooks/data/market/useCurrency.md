# data/market/useCurrency

## Type Aliases

### UseCurrencyParams

```ts
type UseCurrencyParams = Optional<CurrencyQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/market/useCurrency.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/market/useCurrency.tsx#L12)

## Functions

### useCurrency()

```ts
function useCurrency(params): UseQueryResult<undefined | Currency, Error>;
```

Defined in: [sdk/src/react/hooks/data/market/useCurrency.tsx:48](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/market/useCurrency.tsx#L48)

Hook to fetch currency details from the marketplace

Retrieves detailed information about a specific currency by its contract address.
The currency data is cached from previous currency list calls when possible.

#### Parameters

##### params

[`UseCurrencyParams`](#usecurrencyparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`undefined` \| `Currency`, `Error`\>

Query result containing currency details

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useCurrency({
  chainId: 137,
  currencyAddress: '0x...'
})
```

With custom query options:
```typescript
const { data, isLoading } = useCurrency({
  chainId: 1,
  currencyAddress: '0x...',
  query: {
    enabled: Boolean(selectedCurrency)
  }
})
```

## References

### currencyQueryOptions

Re-exports [currencyQueryOptions](../../data.md#currencyqueryoptions-1)

***

### CurrencyQueryOptions

Re-exports [CurrencyQueryOptions](../../data.md#currencyqueryoptions)

***

### FetchCurrencyParams

Re-exports [FetchCurrencyParams](../../data.md#fetchcurrencyparams)
