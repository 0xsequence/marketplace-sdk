# utils/useComparePrices

## Type Aliases

### UseComparePricesArgs

```ts
type UseComparePricesArgs = {
  chainId: number;
  compareToPriceAmountRaw: string;
  compareToPriceCurrencyAddress: Address;
  priceAmountRaw: string;
  priceCurrencyAddress: Address;
  query?: {
     enabled?: boolean;
  };
};
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:87](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L87)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:88](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L88)

##### compareToPriceAmountRaw

```ts
compareToPriceAmountRaw: string;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:91](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L91)

##### compareToPriceCurrencyAddress

```ts
compareToPriceCurrencyAddress: Address;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:92](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L92)

##### priceAmountRaw

```ts
priceAmountRaw: string;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:89](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L89)

##### priceCurrencyAddress

```ts
priceCurrencyAddress: Address;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L90)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:93](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L93)

###### enabled?

```ts
optional enabled: boolean;
```

***

### UseComparePricesParams

```ts
type UseComparePricesParams = Optional<ComparePricesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L13)

***

### UseComparePricesReturn

```ts
type UseComparePricesReturn = {
  percentageDifference: number;
  percentageDifferenceFormatted: string;
  status: "above" | "same" | "below";
};
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:98](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L98)

#### Properties

##### percentageDifference

```ts
percentageDifference: number;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:99](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L99)

##### percentageDifferenceFormatted

```ts
percentageDifferenceFormatted: string;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:100](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L100)

##### status

```ts
status: "above" | "same" | "below";
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:101](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L101)

## Functions

### useComparePrices()

```ts
function useComparePrices(params): UseQueryResult<ComparePricesReturn, Error>;
```

Defined in: [sdk/src/react/hooks/utils/useComparePrices.tsx:67](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useComparePrices.tsx#L67)

Hook to compare prices between different currencies by converting both to USD

Compares two prices by converting both to USD using real-time exchange rates
and returns the percentage difference with comparison status.

#### Parameters

##### params

[`UseComparePricesParams`](#usecomparepricesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ComparePricesReturn`, `Error`\>

Query result containing percentage difference and comparison status

#### Examples

Basic usage:
```typescript
const { data: comparison, isLoading } = useComparePrices({
  chainId: 1,
  priceAmountRaw: '1000000000000000000', // 1 ETH in wei
  priceCurrencyAddress: '0x0000000000000000000000000000000000000000', // ETH
  compareToPriceAmountRaw: '2000000000', // 2000 USDC in wei (6 decimals)
  compareToPriceCurrencyAddress: '0xA0b86a33E6B8DbF5E71Eaa9bfD3F6fD8e8Be3F69' // USDC
})

if (data) {
  console.log(`${data.percentageDifferenceFormatted}% ${data.status}`);
  // e.g., "25.50% above" or "10.25% below"
}
```

With custom query options:
```typescript
const { data: comparison } = useComparePrices({
  chainId: 137,
  priceAmountRaw: price1,
  priceCurrencyAddress: currency1Address,
  compareToPriceAmountRaw: price2,
  compareToPriceCurrencyAddress: currency2Address,
  query: {
    enabled: Boolean(price1 && price2),
    refetchInterval: 30000 // Refresh every 30 seconds
  }
})
```

## References

### comparePricesQueryOptions

Re-exports [comparePricesQueryOptions](../index.md#comparepricesqueryoptions-1)

***

### ComparePricesQueryOptions

Re-exports [ComparePricesQueryOptions](../index.md#comparepricesqueryoptions)

***

### FetchComparePricesParams

Re-exports [FetchComparePricesParams](../index.md#fetchcomparepricesparams)
