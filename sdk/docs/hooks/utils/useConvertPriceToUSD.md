# utils/useConvertPriceToUSD

## Type Aliases

### UseConvertPriceToUSDArgs

```ts
type UseConvertPriceToUSDArgs = {
  amountRaw: string;
  chainId: number;
  currencyAddress: Address;
  query?: {
     enabled?: boolean;
  };
};
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:87](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L87)

#### Properties

##### amountRaw

```ts
amountRaw: string;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L90)

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:88](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L88)

##### currencyAddress

```ts
currencyAddress: Address;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:89](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L89)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:91](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L91)

###### enabled?

```ts
optional enabled: boolean;
```

***

### UseConvertPriceToUSDParams

```ts
type UseConvertPriceToUSDParams = Optional<ConvertPriceToUSDQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L14)

***

### UseConvertPriceToUSDReturn

```ts
type UseConvertPriceToUSDReturn = ConvertPriceToUSDReturn;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:96](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L96)

## Functions

### useConvertPriceToUSD()

```ts
function useConvertPriceToUSD(params): UseQueryResult<ConvertPriceToUSDReturn, Error>;
```

Defined in: [sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx:63](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx#L63)

Hook to convert a price amount from a specific currency to USD

Converts cryptocurrency amounts to their USD equivalent using current exchange rates.
Fetches currency data and calculates the USD value based on the provided amount
and currency address.

#### Parameters

##### params

[`UseConvertPriceToUSDParams`](#useconvertpricetousdparams)

Configuration parameters

#### Returns

`UseQueryResult`\<[`ConvertPriceToUSDReturn`](../index.md#convertpricetousdreturn), `Error`\>

Query result containing USD amount and formatted USD amount

#### Examples

Basic ETH to USD conversion:
```typescript
const { data: conversion, isLoading } = useConvertPriceToUSD({
  chainId: 1,
  currencyAddress: '0x0000000000000000000000000000000000000000', // ETH
  amountRaw: '1000000000000000000' // 1 ETH in wei
})

if (data) {
  console.log(`$${data.usdAmountFormatted}`); // e.g., "$2000.00"
  console.log(data.usdAmount); // e.g., 2000
}
```

ERC-20 token conversion with conditional enabling:
```typescript
const { data: conversion } = useConvertPriceToUSD({
  chainId: 137,
  currencyAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
  amountRaw: '1000000', // 1 USDC (6 decimals)
  query: {
    enabled: Boolean(userHasTokens),
    refetchInterval: 30000 // Update price every 30 seconds
  }
})
```

## References

### convertPriceToUSDQueryOptions

Re-exports [convertPriceToUSDQueryOptions](../index.md#convertpricetousdqueryoptions-1)

***

### ConvertPriceToUSDQueryOptions

Re-exports [ConvertPriceToUSDQueryOptions](../index.md#convertpricetousdqueryoptions)

***

### ConvertPriceToUSDReturn

Re-exports [ConvertPriceToUSDReturn](../index.md#convertpricetousdreturn)

***

### FetchConvertPriceToUSDParams

Re-exports [FetchConvertPriceToUSDParams](../index.md#fetchconvertpricetousdparams)
