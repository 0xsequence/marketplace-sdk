# data/tokens/useGetTokenRanges

## Type Aliases

### UseGetTokenRangesParams

```ts
type UseGetTokenRangesParams = Optional<GetTokenRangesQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L13)

***

### UseGetTokenRangesProps

```ts
type UseGetTokenRangesProps = {
  chainId: number;
  collectionAddress: Address;
  query?: {
     enabled?: boolean;
  };
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:82](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L82)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:83](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L83)

##### collectionAddress

```ts
collectionAddress: Address;
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:84](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L84)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:85](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L85)

###### enabled?

```ts
optional enabled: boolean;
```

***

### UseGetTokenRangesReturn

```ts
type UseGetTokenRangesReturn = Awaited<ReturnType<fetchGetTokenRanges>>;
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L90)

## Functions

### useGetTokenRanges()

```ts
function useGetTokenRanges(params): UseQueryResult<GetTokenIDRangesReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx:62](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useGetTokenRanges.tsx#L62)

Hook to fetch token ID ranges for a collection

Retrieves the available token ID ranges for a specific collection,
which is useful for understanding the token distribution and
available tokens within a collection.

#### Parameters

##### params

[`UseGetTokenRangesParams`](#usegettokenrangesparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`GetTokenIDRangesReturn`, `Error`\>

Query result containing token ID ranges for the collection

#### Examples

Basic usage:
```typescript
const { data: tokenRanges, isLoading } = useGetTokenRanges({
  chainId: 137,
  collectionAddress: '0x1234...'
})

if (data) {
  console.log(`Token ranges: ${JSON.stringify(data.tokenIDRanges)}`);
  data.tokenIDRanges?.forEach(range => {
    console.log(`Range: ${range.start} - ${range.end}`);
  });
}
```

With conditional enabling:
```typescript
const { data: tokenRanges } = useGetTokenRanges({
  chainId: 1,
  collectionAddress: selectedCollection?.address,
  query: {
    enabled: Boolean(selectedCollection?.address),
    staleTime: 300000, // Cache for 5 minutes
    refetchInterval: 60000 // Refresh every minute
  }
})
```

## References

### FetchGetTokenRangesParams

Re-exports [FetchGetTokenRangesParams](../../data.md#fetchgettokenrangesparams)

***

### getTokenRangesQueryOptions

Re-exports [getTokenRangesQueryOptions](../../data.md#gettokenrangesqueryoptions-1)

***

### GetTokenRangesQueryOptions

Re-exports [GetTokenRangesQueryOptions](../../data.md#gettokenrangesqueryoptions)
