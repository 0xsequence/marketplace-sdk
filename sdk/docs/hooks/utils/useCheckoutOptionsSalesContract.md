# utils/useCheckoutOptionsSalesContract

## Type Aliases

### UseCheckoutOptionsSalesContractArgs

```ts
type UseCheckoutOptionsSalesContractArgs = {
  chainId: number;
  collectionAddress: string;
  contractAddress: string;
  items: CheckoutOptionsItem[];
};
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:99](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L99)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:100](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L100)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:102](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L102)

##### contractAddress

```ts
contractAddress: string;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:101](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L101)

##### items

```ts
items: CheckoutOptionsItem[];
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:103](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L103)

***

### UseCheckoutOptionsSalesContractParams

```ts
type UseCheckoutOptionsSalesContractParams = Optional<CheckoutOptionsSalesContractQueryOptions, "config" | "walletAddress">;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L15)

***

### UseCheckoutOptionsSalesContractReturn

```ts
type UseCheckoutOptionsSalesContractReturn = Awaited<ReturnType<typeof fetchCheckoutOptionsSalesContract>>;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:106](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L106)

## Functions

### useCheckoutOptionsSalesContract()

```ts
function useCheckoutOptionsSalesContract(params): UseQueryResult<CheckoutOptionsSalesContractReturn, Error>;
```

Defined in: [sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx:62](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx#L62)

Hook to fetch checkout options for sales contract items

Retrieves checkout options including available payment methods, fees, and transaction details
for items from a sales contract. Requires a connected wallet to calculate wallet-specific options.

#### Parameters

##### params

Configuration parameters or skipToken to skip the query

*typeof* `skipToken` | [`UseCheckoutOptionsSalesContractParams`](#usecheckoutoptionssalescontractparams)

#### Returns

`UseQueryResult`\<`CheckoutOptionsSalesContractReturn`, `Error`\>

Query result containing checkout options with payment methods and fees

#### Examples

Basic usage:
```typescript
const { data: checkoutOptions, isLoading } = useCheckoutOptionsSalesContract({
  chainId: 137,
  contractAddress: '0x1234...',
  collectionAddress: '0x5678...',
  items: [{
    tokenId: '1',
    quantity: '1'
  }]
})
```

With skipToken to conditionally skip:
```typescript
const { data: checkoutOptions } = useCheckoutOptionsSalesContract(
  items.length > 0 ? {
    chainId: 1,
    contractAddress: contractAddress,
    collectionAddress: collectionAddress,
    items: items
  } : skipToken
)
```

## References

### checkoutOptionsSalesContractQueryOptions

Re-exports [checkoutOptionsSalesContractQueryOptions](../index.md#checkoutoptionssalescontractqueryoptions-1)

***

### CheckoutOptionsSalesContractQueryOptions

Re-exports [CheckoutOptionsSalesContractQueryOptions](../index.md#checkoutoptionssalescontractqueryoptions)

***

### FetchCheckoutOptionsSalesContractParams

Re-exports [FetchCheckoutOptionsSalesContractParams](../index.md#fetchcheckoutoptionssalescontractparams)
