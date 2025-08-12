# data/primary-sales/useListPrimarySaleItems

## Type Aliases

### UseListPrimarySaleItemsParams

```ts
type UseListPrimarySaleItemsParams = Optional<ListPrimarySaleItemsQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx:11](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx#L11)

## Functions

### useListPrimarySaleItems()

```ts
function useListPrimarySaleItems(params): UseInfiniteQueryResult<InfiniteData<ListPrimarySaleItemsReturn, unknown>, Error>;
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx:54](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx#L54)

Hook to fetch primary sale items with pagination support

Retrieves a paginated list of primary sale items for a specific contract address
from the marketplace.

#### Parameters

##### params

[`UseListPrimarySaleItemsParams`](#uselistprimarysaleitemsparams)

Configuration parameters

#### Returns

`UseInfiniteQueryResult`\<`InfiniteData`\<`ListPrimarySaleItemsReturn`, `unknown`\>, `Error`\>

Infinite query result containing the primary sale items data

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useListPrimarySaleItems({
  chainId: 137,
  primarySaleContractAddress: '0x...',
})
```

With filters and pagination:
```typescript
const { data, isLoading } = useListPrimarySaleItems({
  chainId: 1,
  primarySaleContractAddress: '0x...',
  filter: { status: 'active' },
  page: { page: 1, pageSize: 20 },
  query: {
    enabled: isReady
  }
})
```

## References

### ListPrimarySaleItemsQueryOptions

Re-exports [ListPrimarySaleItemsQueryOptions](../../data.md#listprimarysaleitemsqueryoptions)
