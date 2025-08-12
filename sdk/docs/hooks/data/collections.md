# data/collections

## Interfaces

### CollectionBalanceFilter

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:8](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L8)

#### Properties

##### accountAddresses

```ts
accountAddresses: `0x${string}`[];
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:9](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L9)

##### contractWhitelist?

```ts
optional contractWhitelist: `0x${string}`[];
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:10](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L10)

##### omitNativeBalances

```ts
omitNativeBalances: boolean;
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:11](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L11)

***

### FetchCollectionBalanceDetailsParams

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L14)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L15)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:17](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L17)

##### filter

```ts
filter: CollectionBalanceFilter;
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L16)

***

### FetchCollectionDetailsParams

Defined in: [sdk/src/react/queries/collectionDetails.ts:8](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L8)

#### Extends

- `Omit`\<`GetCollectionDetailArgs`, `"chainId"` \| `"contractAddress"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/collectionDetails.ts:10](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L10)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/queries/collectionDetails.ts:11](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L11)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/collectionDetails.ts:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L12)

***

### FetchCollectionParams

Defined in: [sdk/src/react/queries/collection.ts:7](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L7)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/collection.ts:8](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L8)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/queries/collection.ts:9](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L9)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/collection.ts:10](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L10)

***

### FetchListCollectionActivitiesParams

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L14)

#### Extends

- `Omit`\<`ListCollectionActivitiesArgs`, `"chainId"` \| `"contractAddress"` \| `"page"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:19](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L19)

##### collectionAddress

```ts
collectionAddress: `0x${string}`;
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:20](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L20)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:24](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L24)

##### page?

```ts
optional page: number;
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:21](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L21)

##### pageSize?

```ts
optional pageSize: number;
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:22](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L22)

##### sort?

```ts
optional sort: SortBy[];
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L23)

***

### FetchListCollectionsParams

Defined in: [sdk/src/react/queries/listCollections.ts:24](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L24)

#### Properties

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/listCollections.ts:27](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L27)

##### marketplaceConfig

```ts
marketplaceConfig: MarketplaceConfig;
```

Defined in: [sdk/src/react/queries/listCollections.ts:26](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L26)

##### marketplaceType?

```ts
optional marketplaceType: MarketplaceType;
```

Defined in: [sdk/src/react/queries/listCollections.ts:25](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L25)

## Type Aliases

### CollectionBalanceDetailsQueryOptions

```ts
type CollectionBalanceDetailsQueryOptions = ValuesOptional<FetchCollectionBalanceDetailsParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:63](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L63)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### CollectionDetailsQueryOptions

```ts
type CollectionDetailsQueryOptions = ValuesOptional<FetchCollectionDetailsParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/collectionDetails.ts:35](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L35)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### CollectionQueryOptions

```ts
type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/collection.ts:29](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L29)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### ListCollectionActivitiesQueryOptions

```ts
type ListCollectionActivitiesQueryOptions = ValuesOptional<FetchListCollectionActivitiesParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:63](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L63)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### ListCollectionsQueryOptions

```ts
type ListCollectionsQueryOptions = ValuesOptional<FetchListCollectionsParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/listCollections.ts:111](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L111)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

## Functions

### collectionBalanceDetailsQueryOptions()

```ts
function collectionBalanceDetailsQueryOptions(params): OmitKeyof<UseQueryOptions<GetTokenBalancesDetailsReturn, Error, GetTokenBalancesDetailsReturn, (
  | string
  | CollectionBalanceDetailsQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/collectionBalanceDetails.ts:68](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionBalanceDetails.ts#L68)

#### Parameters

##### params

[`CollectionBalanceDetailsQueryOptions`](#collectionbalancedetailsqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`GetTokenBalancesDetailsReturn`, `Error`, `GetTokenBalancesDetailsReturn`, (
  \| `string`
  \| [`CollectionBalanceDetailsQueryOptions`](#collectionbalancedetailsqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### collectionDetailsQueryOptions()

```ts
function collectionDetailsQueryOptions(params): OmitKeyof<UseQueryOptions<Collection, Error, Collection, (
  | "collections"
  | "detail"
  | CollectionDetailsQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/collectionDetails.ts:40](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectionDetails.ts#L40)

#### Parameters

##### params

[`CollectionDetailsQueryOptions`](#collectiondetailsqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`Collection`, `Error`, `Collection`, (
  \| `"collections"`
  \| `"detail"`
  \| [`CollectionDetailsQueryOptions`](#collectiondetailsqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### collectionQueryOptions()

```ts
function collectionQueryOptions(params): OmitKeyof<UseQueryOptions<ContractInfo, Error, ContractInfo, (
  | "collections"
  | "detail"
  | CollectionQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/collection.ts:33](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collection.ts#L33)

#### Parameters

##### params

[`CollectionQueryOptions`](#collectionqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`ContractInfo`, `Error`, `ContractInfo`, (
  \| `"collections"`
  \| `"detail"`
  \| [`CollectionQueryOptions`](#collectionqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### listCollectionActivitiesQueryOptions()

```ts
function listCollectionActivitiesQueryOptions(params): OmitKeyof<UseQueryOptions<ListCollectionActivitiesReturn, Error, ListCollectionActivitiesReturn, (
  | "collections"
  | "collectionActivities"
  | ListCollectionActivitiesQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/listCollectionActivities.ts:68](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectionActivities.ts#L68)

#### Parameters

##### params

[`ListCollectionActivitiesQueryOptions`](#listcollectionactivitiesqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`ListCollectionActivitiesReturn`, `Error`, `ListCollectionActivitiesReturn`, (
  \| `"collections"`
  \| `"collectionActivities"`
  \| [`ListCollectionActivitiesQueryOptions`](#listcollectionactivitiesqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### listCollectionsQueryOptions()

```ts
function listCollectionsQueryOptions(params): UseQueryOptions<(
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
})[], Error, (
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
})[], (
  | "collections"
  | "list"
  | ListCollectionsQueryOptions)[]> & {
} & {
};
```

Defined in: [sdk/src/react/queries/listCollections.ts:116](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollections.ts#L116)

#### Parameters

##### params

[`ListCollectionsQueryOptions`](#listcollectionsqueryoptions)

#### Returns

`UseQueryOptions`\<(
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
\})[], `Error`, (
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
\})[], (
  \| `"collections"`
  \| `"list"`
  \| [`ListCollectionsQueryOptions`](#listcollectionsqueryoptions))[]\> & \{
\} & \{
\}

## References

### collectionDetailsPollingOptions

Re-exports [collectionDetailsPollingOptions](collections/useCollectionDetailsPolling.md#collectiondetailspollingoptions)

***

### useCollection

Re-exports [useCollection](collections/useCollection.md#usecollection)

***

### useCollectionBalanceDetails

Re-exports [useCollectionBalanceDetails](collections/useCollectionBalanceDetails.md#usecollectionbalancedetails)

***

### UseCollectionBalanceDetailsArgs

Re-exports [UseCollectionBalanceDetailsArgs](collections/useCollectionBalanceDetails.md#usecollectionbalancedetailsargs)

***

### UseCollectionBalanceDetailsParams

Re-exports [UseCollectionBalanceDetailsParams](collections/useCollectionBalanceDetails.md#usecollectionbalancedetailsparams)

***

### UseCollectionBalanceDetailsReturn

Re-exports [UseCollectionBalanceDetailsReturn](collections/useCollectionBalanceDetails.md#usecollectionbalancedetailsreturn)

***

### useCollectionDetails

Re-exports [useCollectionDetails](collections/useCollectionDetails.md#usecollectiondetails)

***

### UseCollectionDetailsParams

Re-exports [UseCollectionDetailsParams](collections/useCollectionDetails.md#usecollectiondetailsparams)

***

### useCollectionDetailsPolling

Re-exports [useCollectionDetailsPolling](collections/useCollectionDetailsPolling.md#usecollectiondetailspolling)

***

### UseCollectionParams

Re-exports [UseCollectionParams](collections/useCollection.md#usecollectionparams)

***

### useListCollectionActivities

Re-exports [useListCollectionActivities](collections/useListCollectionActivities.md#uselistcollectionactivities)

***

### UseListCollectionActivitiesArgs

Re-exports [UseListCollectionActivitiesArgs](collections/useListCollectionActivities.md#uselistcollectionactivitiesargs)

***

### UseListCollectionActivitiesParams

Re-exports [UseListCollectionActivitiesParams](collections/useListCollectionActivities.md#uselistcollectionactivitiesparams)

***

### UseListCollectionActivitiesReturn

Re-exports [UseListCollectionActivitiesReturn](collections/useListCollectionActivities.md#uselistcollectionactivitiesreturn)

***

### useListCollections

Re-exports [useListCollections](collections/useListCollections.md#uselistcollections)

***

### UseListCollectionsParams

Re-exports [UseListCollectionsParams](collections/useListCollections.md#uselistcollectionsparams)
