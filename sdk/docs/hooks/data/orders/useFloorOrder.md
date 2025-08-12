# data/orders/useFloorOrder

## Type Aliases

### UseFloorOrderParams

```ts
type UseFloorOrderParams = Optional<FloorOrderQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/data/orders/useFloorOrder.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useFloorOrder.tsx#L12)

## Functions

### useFloorOrder()

```ts
function useFloorOrder(params): UseQueryResult<CollectibleOrder, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useFloorOrder.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useFloorOrder.tsx#L53)

Hook to fetch the floor order for a collection

Retrieves the lowest priced order (listing) currently available for any token
in the specified collection from the marketplace.

#### Parameters

##### params

[`UseFloorOrderParams`](#usefloororderparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`CollectibleOrder`, `Error`\>

Query result containing the floor order data for the collection

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useFloorOrder({
  chainId: 137,
  collectionAddress: '0x...'
})
```

With filters and custom query options:
```typescript
const { data, isLoading } = useFloorOrder({
  chainId: 1,
  collectionAddress: '0x...',
  filter: {
    minPrice: '1000000000000000000' // 1 ETH in wei
  },
  query: {
    refetchInterval: 30000,
    enabled: hasCollectionAddress
  }
})
```

## References

### FetchFloorOrderParams

Re-exports [FetchFloorOrderParams](../../data.md#fetchfloororderparams)

***

### floorOrderQueryOptions

Re-exports [floorOrderQueryOptions](../../data.md#floororderqueryoptions-1)

***

### FloorOrderQueryOptions

Re-exports [FloorOrderQueryOptions](../../data.md#floororderqueryoptions)
