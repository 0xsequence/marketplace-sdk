# data/collections/useCollectionBalanceDetails

## Type Aliases

### UseCollectionBalanceDetailsArgs

```ts
type UseCollectionBalanceDetailsArgs = {
  chainId: number;
  filter: CollectionBalanceFilter;
  query?: {
     enabled?: boolean;
  };
};
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:96](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L96)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:97](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L97)

##### filter

```ts
filter: CollectionBalanceFilter;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:98](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L98)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:99](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L99)

###### enabled?

```ts
optional enabled: boolean;
```

***

### UseCollectionBalanceDetailsParams

```ts
type UseCollectionBalanceDetailsParams = Optional<CollectionBalanceDetailsQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L14)

***

### UseCollectionBalanceDetailsReturn

```ts
type UseCollectionBalanceDetailsReturn = Awaited<ReturnType<typeof fetchCollectionBalanceDetails>>;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:104](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L104)

## Functions

### useCollectionBalanceDetails()

```ts
function useCollectionBalanceDetails(params): UseQueryResult<GetTokenBalancesDetailsReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx:70](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionBalanceDetails.tsx#L70)

Hook to fetch detailed balance information for multiple accounts

Retrieves token balances and native balances for multiple account addresses,
with support for contract whitelisting and optional native balance exclusion.
Aggregates results from multiple account addresses into a single response.

#### Parameters

##### params

[`UseCollectionBalanceDetailsParams`](#usecollectionbalancedetailsparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`GetTokenBalancesDetailsReturn`, `Error`\>

Query result containing aggregated balance details for all accounts

#### Examples

Basic usage:
```typescript
const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
  chainId: 137,
  filter: {
    accountAddresses: ['0x1234...', '0x5678...'],
    omitNativeBalances: false
  }
})

if (data) {
  console.log(`Found ${data.balances.length} token balances`);
  console.log(`Found ${data.nativeBalances.length} native balances`);
}
```

With contract whitelist:
```typescript
const { data: balanceDetails } = useCollectionBalanceDetails({
  chainId: 1,
  filter: {
    accountAddresses: [userAddress],
    contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
    omitNativeBalances: true
  },
  query: {
    enabled: Boolean(userAddress),
    refetchInterval: 60000 // Refresh every minute
  }
})
```

## References

### collectionBalanceDetailsQueryOptions

Re-exports [collectionBalanceDetailsQueryOptions](../collections.md#collectionbalancedetailsqueryoptions-1)

***

### CollectionBalanceDetailsQueryOptions

Re-exports [CollectionBalanceDetailsQueryOptions](../collections.md#collectionbalancedetailsqueryoptions)

***

### CollectionBalanceFilter

Re-exports [CollectionBalanceFilter](../collections.md#collectionbalancefilter)

***

### FetchCollectionBalanceDetailsParams

Re-exports [FetchCollectionBalanceDetailsParams](../collections.md#fetchcollectionbalancedetailsparams)
