# data/collectibles/useCollectible

## Type Aliases

### UseCollectibleParams

```ts
type UseCollectibleParams = Optional<CollectibleQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useCollectible.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useCollectible.tsx#L12)

## Functions

### useCollectible()

```ts
function useCollectible(params): UseQueryResult<TokenMetadata, Error>;
```

Defined in: [sdk/src/react/hooks/data/collectibles/useCollectible.tsx:52](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collectibles/useCollectible.tsx#L52)

Hook to fetch metadata for a specific collectible

This hook retrieves metadata for an individual NFT from a collection,
including properties like name, description, image, attributes, etc.

#### Parameters

##### params

[`UseCollectibleParams`](#usecollectibleparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`TokenMetadata`, `Error`\>

Query result containing the collectible metadata

#### Examples

Basic usage:
```typescript
const { data: collectible, isLoading } = useCollectible({
  chainId: 137,
  collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
  collectibleId: '12345'
})
```

With custom query options:
```typescript
const { data } = useCollectible({
  chainId: 137,
  collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
  collectibleId: '12345',
  query: {
    enabled: Boolean(collectionAddress && tokenId),
    staleTime: 30_000
  }
})
```

## References

### collectibleQueryOptions

Re-exports [collectibleQueryOptions](../collectibles.md#collectiblequeryoptions-1)

***

### CollectibleQueryOptions

Re-exports [CollectibleQueryOptions](../collectibles.md#collectiblequeryoptions)

***

### FetchCollectibleParams

Re-exports [FetchCollectibleParams](../collectibles.md#fetchcollectibleparams)
