# data/collections/useCollectionDetailsPolling

## Functions

### collectionDetailsPollingOptions()

```ts
function collectionDetailsPollingOptions(args, config): OmitKeyof<UseQueryOptions<Collection, Error, Collection, (
  | "collections"
  | "detail"
  | CollectionDetailsQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionDetailsPolling.tsx:28](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionDetailsPolling.tsx#L28)

#### Parameters

##### args

`UseCollectionDetailsPolling`

##### config

`SdkConfig`

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`Collection`, `Error`, `Collection`, (
  \| `"collections"`
  \| `"detail"`
  \| [`CollectionDetailsQueryOptions`](../collections.md#collectiondetailsqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### useCollectionDetailsPolling()

```ts
function useCollectionDetailsPolling(args): UseQueryResult<Collection, Error>;
```

Defined in: [sdk/src/react/hooks/data/collections/useCollectionDetailsPolling.tsx:59](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/collections/useCollectionDetailsPolling.tsx#L59)

#### Parameters

##### args

`UseCollectionDetailsPolling`

#### Returns

`UseQueryResult`\<`Collection`, `Error`\>
