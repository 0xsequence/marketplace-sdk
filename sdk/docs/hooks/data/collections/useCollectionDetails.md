# data/collections/useCollectionDetails

## Type Aliases

### UseCollectionDetailsParams

```ts
type UseCollectionDetailsParams = Optional<CollectionDetailsQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionDetails.ts:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionDetails.ts#L12)

## Functions

### useCollectionDetails()

```ts
function useCollectionDetails(params): UseQueryResult<Collection, Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionDetails.ts:52](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionDetails.ts#L52)

Hook to fetch detailed information about a collection

This hook retrieves comprehensive metadata and details for an NFT collection,
including collection name, description, banner, avatar, social links, stats, etc.

#### Parameters

##### params

[`UseCollectionDetailsParams`](#usecollectiondetailsparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`Collection`, `Error`\>

Query result containing the collection details

#### Examples

Basic usage:
```typescript
const { data: collection, isLoading } = useCollectionDetails({
  chainId: 137,
  collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
})
```

With custom query options:
```typescript
const { data } = useCollectionDetails({
  chainId: 137,
  collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
  query: {
    enabled: Boolean(collectionAddress),
    staleTime: 60_000
  }
})
```

## References

### collectionDetailsQueryOptions

Re-exports [collectionDetailsQueryOptions](../collections.md#collectiondetailsqueryoptions-1)

***

### CollectionDetailsQueryOptions

Re-exports [CollectionDetailsQueryOptions](../collections.md#collectiondetailsqueryoptions)

***

### FetchCollectionDetailsParams

Re-exports [FetchCollectionDetailsParams](../collections.md#fetchcollectiondetailsparams)
