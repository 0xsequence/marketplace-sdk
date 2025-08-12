# data/collections/useListCollections

## Type Aliases

### UseListCollectionsParams

```ts
type UseListCollectionsParams = Optional<ListCollectionsQueryOptions, "config" | "marketplaceConfig">;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollections.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollections.tsx#L13)

## Functions

### useListCollections()

```ts
function useListCollections(params): UseQueryResult<(
  | {
  bannerUrl: string;
  contractType: ContractType;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  feePercentage: number;
  filterSettings?: CollectionFilterSettings;
  itemsAddress: string;
  marketplaceType: MarketplaceType;
}
  | {
  bannerUrl: string;
  filterSettings?: CollectionFilterSettings;
  itemsAddress: string;
  marketplaceType: MarketplaceType;
  saleAddress: string;
})[], Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useListCollections.tsx:57](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useListCollections.tsx#L57)

Hook to fetch collections from marketplace configuration

Retrieves all collections configured in the marketplace, with optional filtering
by marketplace type. Combines metadata from the metadata API with marketplace
configuration to provide complete collection information.

#### Parameters

##### params

[`UseListCollectionsParams`](#uselistcollectionsparams) = `{}`

Configuration parameters

#### Returns

`UseQueryResult`\<(
  \| \{
  `bannerUrl`: `string`;
  `contractType`: `ContractType`;
  `currencyOptions`: `string`[];
  `destinationMarketplace`: `OrderbookKind`;
  `feePercentage`: `number`;
  `filterSettings?`: `CollectionFilterSettings`;
  `itemsAddress`: `string`;
  `marketplaceType`: `MarketplaceType`;
\}
  \| \{
  `bannerUrl`: `string`;
  `filterSettings?`: `CollectionFilterSettings`;
  `itemsAddress`: `string`;
  `marketplaceType`: `MarketplaceType`;
  `saleAddress`: `string`;
\})[], `Error`\>

Query result containing array of collections with metadata

#### Examples

Basic usage:
```typescript
const { data: collections, isLoading } = useListCollections();

if (isLoading) return <div>Loading collections...</div>;

return (
  <div>
    {collections?.map(collection => (
      <div key={collection.itemsAddress}>
        {collection.name}
      </div>
    ))}
  </div>
);
```

Filtering by marketplace type:
```typescript
const { data: marketCollections } = useListCollections({
  marketplaceType: 'market'
});
```

## References

### FetchListCollectionsParams

Re-exports [FetchListCollectionsParams](../collections.md#fetchlistcollectionsparams)

***

### listCollectionsQueryOptions

Re-exports [listCollectionsQueryOptions](../collections.md#listcollectionsqueryoptions-1)

***

### ListCollectionsQueryOptions

Re-exports [ListCollectionsQueryOptions](../collections.md#listcollectionsqueryoptions)
