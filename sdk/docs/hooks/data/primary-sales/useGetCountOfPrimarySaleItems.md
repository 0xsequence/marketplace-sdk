# data/primary-sales/useGetCountOfPrimarySaleItems

## Type Aliases

### UseGetCountParams

```ts
type UseGetCountParams = Optional<ListPrimarySaleItemsQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx:9](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx#L9)

## Functions

### useGetCountOfPrimarySaleItems()

```ts
function useGetCountOfPrimarySaleItems(params): UseQueryResult<GetCountOfPrimarySaleItemsReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx:36](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx#L36)

Hook to get the total count of primary sale items

Retrieves the total count of primary sale items for a specific contract address
from the marketplace.

#### Parameters

##### params

[`UseGetCountParams`](#usegetcountparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`GetCountOfPrimarySaleItemsReturn`, `Error`\>

Query result containing the count of primary sale items

#### Example

```typescript
const { data: count, isLoading } = useGetCountOfPrimarySaleItems({
  chainId: 137,
  primarySaleContractAddress: '0x...',
})
```

## References

### ListPrimarySaleItemsQueryOptions

Re-exports [ListPrimarySaleItemsQueryOptions](../../data.md#listprimarysaleitemsqueryoptions)
