# data/collections/useCollection

## Type Aliases

### UseCollectionParams

```ts
type UseCollectionParams = Optional<CollectionQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollection.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollection.tsx#L12)

## Functions

### useCollection()

```ts
function useCollection(params): UseQueryResult<ContractInfo, Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollection.tsx:49](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollection.tsx#L49)

Hook to fetch collection information from the metadata API

Retrieves basic contract information including name, symbol, type,
and extension data for a given collection contract.

#### Parameters

##### params

[`UseCollectionParams`](#usecollectionparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`ContractInfo`, `Error`\>

Query result containing contract information

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useCollection({
  chainId: 137,
  collectionAddress: '0x...'
})
```

With custom query options:
```typescript
const { data, isLoading } = useCollection({
  chainId: 1,
  collectionAddress: '0x...',
  query: {
    refetchInterval: 30000,
    enabled: userWantsToFetch
  }
})
```

## References

### collectionQueryOptions

Re-exports [collectionQueryOptions](../collections.md#collectionqueryoptions-1)

***

### CollectionQueryOptions

Re-exports [CollectionQueryOptions](../collections.md#collectionqueryoptions)

***

### FetchCollectionParams

Re-exports [FetchCollectionParams](../collections.md#fetchcollectionparams)
