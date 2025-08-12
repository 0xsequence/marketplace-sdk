# data/collectibles/useBalanceOfCollectible

## Functions

### useBalanceOfCollectible()

```ts
function useBalanceOfCollectible(args): UseQueryResult<TokenBalance, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useBalanceOfCollectible.tsx:30](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useBalanceOfCollectible.tsx#L30)

Hook to fetch the balance of a specific collectible for a user

#### Parameters

##### args

`UseBalanceOfCollectibleArgs`

The arguments for fetching the balance

#### Returns

`UseQueryResult`\<`TokenBalance`, `Error`\>

Query result containing the balance data

#### Example

```tsx
const { data, isLoading, error } = useBalanceOfCollectible({
  collectionAddress: '0x123...',
  collectableId: '1',
  userAddress: '0x456...',
  chainId: 1,
  query: {
    enabled: true,
    refetchInterval: 10000,
  }
});
```
