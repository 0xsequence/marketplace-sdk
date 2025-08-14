# data/orders/useListOffersForCollectible

## Type Aliases

### UseListOffersForCollectibleReturn

```ts
type UseListOffersForCollectibleReturn = Awaited<ReturnType<typeof fetchListOffersForCollectible>>;
```

Defined in: [sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx:19](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx#L19)

## Functions

### listOffersForCollectibleOptions()

```ts
function listOffersForCollectibleOptions(args, config): OmitKeyof<UseQueryOptions<ListCollectibleOffersReturn, Error, ListCollectibleOffersReturn, ("offers" | "collectable" | SdkConfig | UseListOffersForCollectibleArgs)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx:39](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx#L39)

#### Parameters

##### args

`UseListOffersForCollectibleArgs`

##### config

`SdkConfig`

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`ListCollectibleOffersReturn`, `Error`, `ListCollectibleOffersReturn`, (`"offers"` \| `"collectable"` \| `SdkConfig` \| `UseListOffersForCollectibleArgs`)[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### useListOffersForCollectible()

```ts
function useListOffersForCollectible(args): UseQueryResult<ListCollectibleOffersReturn, Error>;
```

Defined in: [sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx:49](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/orders/useListOffersForCollectible.tsx#L49)

#### Parameters

##### args

`UseListOffersForCollectibleArgs`

#### Returns

`UseQueryResult`\<`ListCollectibleOffersReturn`, `Error`\>
