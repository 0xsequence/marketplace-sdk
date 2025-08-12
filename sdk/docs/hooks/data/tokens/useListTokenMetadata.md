# data/tokens/useListTokenMetadata

## Type Aliases

### UseListTokenMetadataParams

```ts
type UseListTokenMetadataParams = Optional<ListTokenMetadataQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/tokens/useListTokenMetadata.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useListTokenMetadata.tsx#L12)

## Functions

### useListTokenMetadata()

```ts
function useListTokenMetadata(params): UseQueryResult<TokenMetadata[], Error>;
```

Defined in: [sdk/src/react/hooks/data/tokens/useListTokenMetadata.tsx:56](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useListTokenMetadata.tsx#L56)

Hook to fetch metadata for multiple tokens

Retrieves metadata for a batch of tokens from a specific contract using the metadata API.
This hook is optimized for fetching multiple token metadata in a single request.

#### Parameters

##### params

[`UseListTokenMetadataParams`](#uselisttokenmetadataparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`TokenMetadata`[], `Error`\>

Query result containing an array of token metadata

#### Examples

Basic usage:
```typescript
const { data: metadata, isLoading } = useListTokenMetadata({
  chainId: 137,
  contractAddress: '0x...',
  tokenIds: ['1', '2', '3']
})
```

With query options:
```typescript
const { data: metadata } = useListTokenMetadata({
  chainId: 1,
  contractAddress: '0x...',
  tokenIds: selectedTokenIds,
  query: {
    enabled: selectedTokenIds.length > 0,
    staleTime: 10 * 60 * 1000 // 10 minutes
  }
})
```

## References

### FetchListTokenMetadataParams

Re-exports [FetchListTokenMetadataParams](../../data.md#fetchlisttokenmetadataparams)

***

### listTokenMetadataQueryOptions

Re-exports [listTokenMetadataQueryOptions](../../data.md#listtokenmetadataqueryoptions-1)

***

### ListTokenMetadataQueryOptions

Re-exports [ListTokenMetadataQueryOptions](../../data.md#listtokenmetadataqueryoptions)
