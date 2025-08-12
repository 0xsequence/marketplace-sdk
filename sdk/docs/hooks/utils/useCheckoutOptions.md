# utils/useCheckoutOptions

## Type Aliases

### UseCheckoutOptionsArgs

```ts
type UseCheckoutOptionsArgs = {
  chainId: number;
  orders: {
     collectionAddress: string;
     marketplace: MarketplaceKind;
     orderId: string;
  }[];
  query?: {
     enabled?: boolean;
  };
};
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:82](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L82)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:83](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L83)

##### orders

```ts
orders: {
  collectionAddress: string;
  marketplace: MarketplaceKind;
  orderId: string;
}[];
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:84](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L84)

###### collectionAddress

```ts
collectionAddress: string;
```

###### marketplace

```ts
marketplace: MarketplaceKind;
```

###### orderId

```ts
orderId: string;
```

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:89](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L89)

###### enabled?

```ts
optional enabled: boolean;
```

***

### UseCheckoutOptionsParams

```ts
type UseCheckoutOptionsParams = Optional<CheckoutOptionsQueryOptions, "config" | "walletAddress">;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L14)

***

### UseCheckoutOptionsReturn

```ts
type UseCheckoutOptionsReturn = Awaited<ReturnType<fetchCheckoutOptions>>;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:94](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L94)

## Functions

### useCheckoutOptions()

```ts
function useCheckoutOptions(params): UseQueryResult<CheckoutOptionsMarketplaceReturn, Error>;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptions.tsx:60](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptions.tsx#L60)

Hook to fetch checkout options for marketplace orders

Retrieves checkout options including available payment methods, fees, and transaction details
for a set of marketplace orders. Requires a connected wallet to calculate wallet-specific options.

#### Parameters

##### params

[`UseCheckoutOptionsParams`](#usecheckoutoptionsparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`CheckoutOptionsMarketplaceReturn`, `Error`\>

Query result containing checkout options with payment methods and fees

#### Examples

Basic usage:
```typescript
const { data: checkoutOptions, isLoading } = useCheckoutOptions({
  chainId: 137,
  orders: [{
    collectionAddress: '0x1234...',
    orderId: '123',
    marketplace: MarketplaceKind.sequence_marketplace_v2
  }],
  additionalFee: 0
})
```

With custom query options:
```typescript
const { data: checkoutOptions } = useCheckoutOptions({
  chainId: 1,
  orders: orders,
  query: {
    enabled: orders.length > 0,
    staleTime: 30000
  }
})
```

## References

### checkoutOptionsQueryOptions

Re-exports [checkoutOptionsQueryOptions](../index.md#checkoutoptionsqueryoptions-1)

***

### CheckoutOptionsQueryOptions

Re-exports [CheckoutOptionsQueryOptions](../index.md#checkoutoptionsqueryoptions)

***

### FetchCheckoutOptionsParams

Re-exports [FetchCheckoutOptionsParams](../index.md#fetchcheckoutoptionsparams)
