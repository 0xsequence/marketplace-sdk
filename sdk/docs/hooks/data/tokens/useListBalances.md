# data/tokens/useListBalances

## Functions

### useListBalances()

```ts
function useListBalances(args): UseInfiniteQueryResult<InfiniteData<GetTokenBalancesReturn, unknown>, Error>;
```

Defined in: [sdk/src/react/hooks/data/tokens/useListBalances.tsx:27](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useListBalances.tsx#L27)

Hook to fetch a list of token balances with pagination support

#### Parameters

##### args

`UseListBalancesArgs`

The arguments for fetching the balances

#### Returns

`UseInfiniteQueryResult`\<`InfiniteData`\<`GetTokenBalancesReturn`, `unknown`\>, `Error`\>

Infinite query result containing the balances data

#### Example

```tsx
const { data, isLoading, error, fetchNextPage } = useListBalances({
  chainId: 1,
  accountAddress: '0x123...',
  includeMetadata: true,
  query: {
    enabled: true,
    refetchInterval: 10000,
  }
});
```
