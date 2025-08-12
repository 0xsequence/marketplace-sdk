# data/collectibles

## Interfaces

### FetchCollectibleParams

Defined in: [sdk/src/react/queries/collectible.ts:8](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L8)

#### Extends

- `Omit`\<`GetTokenMetadataArgs`, `"chainID"` \| `"contractAddress"` \| `"tokenIDs"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/collectible.ts:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L13)

##### collectibleId

```ts
collectibleId: string;
```

Defined in: [sdk/src/react/queries/collectible.ts:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L15)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/queries/collectible.ts:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L14)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/collectible.ts:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L16)

***

### FetchCountOfCollectablesParams

Defined in: [sdk/src/react/queries/countOfCollectables.ts:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L13)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L14)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L15)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L16)

##### filter?

```ts
optional filter: CollectiblesFilter;
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:17](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L17)

##### side?

```ts
optional side: OrderSide;
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L18)

***

### FetchListCollectibleActivitiesParams

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L13)

#### Extends

- `Omit`\<`ListCollectibleActivitiesArgs`, `"chainId"` \| `"contractAddress"` \| `"page"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L18)

##### collectionAddress

```ts
collectionAddress: `0x${string}`;
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:19](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L19)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L23)

##### page?

```ts
optional page: number;
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:20](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L20)

##### pageSize?

```ts
optional pageSize: number;
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:21](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L21)

##### sort?

```ts
optional sort: SortBy[];
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:22](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L22)

***

### FetchListCollectiblesPaginatedParams

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L12)

#### Extends

- `Omit`\<`ListCollectiblesArgs`, `"chainId"` \| `"contractAddress"` \| `"page"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L14)

##### collectionAddress

```ts
collectionAddress: `0x${string}`;
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L15)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L18)

##### page?

```ts
optional page: number;
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L16)

##### pageSize?

```ts
optional pageSize: number;
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:17](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L17)

***

### FetchListCollectiblesParams

Defined in: [sdk/src/react/queries/listCollectibles.ts:21](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L21)

#### Extends

- `Omit`\<`ListCollectiblesArgs`, `"chainId"` \| `"contractAddress"`\>

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L23)

##### collectionAddress

```ts
collectionAddress: `0x${string}`;
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:24](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L24)

##### config

```ts
config: SdkConfig;
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:27](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L27)

##### isLaos721?

```ts
optional isLaos721: boolean;
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:25](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L25)

##### marketplaceType?

```ts
optional marketplaceType: MarketplaceType;
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:26](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L26)

## Type Aliases

### CollectibleQueryOptions

```ts
type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/collectible.ts:37](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L37)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### CountOfCollectablesQueryOptions

```ts
type CountOfCollectablesQueryOptions = ValuesOptional<FetchCountOfCollectablesParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:52](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L52)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### ListCollectibleActivitiesQueryOptions

```ts
type ListCollectibleActivitiesQueryOptions = ValuesOptional<FetchListCollectibleActivitiesParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:62](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L62)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### ListCollectiblesPaginatedQueryOptions

```ts
type ListCollectiblesPaginatedQueryOptions = ValuesOptional<FetchListCollectiblesPaginatedParams> & {
  query?: StandardQueryOptions;
};
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:52](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L52)

#### Type declaration

##### query?

```ts
optional query: StandardQueryOptions;
```

***

### ListCollectiblesQueryOptions

```ts
type ListCollectiblesQueryOptions = ValuesOptional<FetchListCollectiblesParams> & {
  query?: StandardInfiniteQueryOptions;
};
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:128](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L128)

#### Type declaration

##### query?

```ts
optional query: StandardInfiniteQueryOptions;
```

## Functions

### collectibleQueryOptions()

```ts
function collectibleQueryOptions(params): OmitKeyof<UseQueryOptions<TokenMetadata, Error, TokenMetadata, (
  | "collectable"
  | "details"
  | CollectibleQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/collectible.ts:41](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/collectible.ts#L41)

#### Parameters

##### params

[`CollectibleQueryOptions`](#collectiblequeryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`TokenMetadata`, `Error`, `TokenMetadata`, (
  \| `"collectable"`
  \| `"details"`
  \| [`CollectibleQueryOptions`](#collectiblequeryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### countOfCollectablesQueryOptions()

```ts
function countOfCollectablesQueryOptions(params): OmitKeyof<UseQueryOptions<number, Error, number, (
  | "collectable"
  | "counts"
  | CountOfCollectablesQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/countOfCollectables.ts:57](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/countOfCollectables.ts#L57)

#### Parameters

##### params

[`CountOfCollectablesQueryOptions`](#countofcollectablesqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`number`, `Error`, `number`, (
  \| `"collectable"`
  \| `"counts"`
  \| [`CountOfCollectablesQueryOptions`](#countofcollectablesqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### listCollectibleActivitiesQueryOptions()

```ts
function listCollectibleActivitiesQueryOptions(params): OmitKeyof<UseQueryOptions<ListCollectibleActivitiesReturn, Error, ListCollectibleActivitiesReturn, (
  | "collectable"
  | "collectibleActivities"
  | ListCollectibleActivitiesQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/listCollectibleActivities.ts:67](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibleActivities.ts#L67)

#### Parameters

##### params

[`ListCollectibleActivitiesQueryOptions`](#listcollectibleactivitiesqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`ListCollectibleActivitiesReturn`, `Error`, `ListCollectibleActivitiesReturn`, (
  \| `"collectable"`
  \| `"collectibleActivities"`
  \| [`ListCollectibleActivitiesQueryOptions`](#listcollectibleactivitiesqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### listCollectiblesPaginatedQueryOptions()

```ts
function listCollectiblesPaginatedQueryOptions(params): OmitKeyof<UseQueryOptions<ListCollectiblesReturn, Error, ListCollectiblesReturn, (
  | string
  | ListCollectiblesPaginatedQueryOptions)[]>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/listCollectiblesPaginated.ts:57](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectiblesPaginated.ts#L57)

#### Parameters

##### params

[`ListCollectiblesPaginatedQueryOptions`](#listcollectiblespaginatedqueryoptions)

#### Returns

`OmitKeyof`\<`UseQueryOptions`\<`ListCollectiblesReturn`, `Error`, `ListCollectiblesReturn`, (
  \| `string`
  \| [`ListCollectiblesPaginatedQueryOptions`](#listcollectiblespaginatedqueryoptions))[]\>, `"queryFn"`\> & \{
\} & \{
\}

***

### listCollectiblesQueryOptions()

```ts
function listCollectiblesQueryOptions(params): OmitKeyof<UseInfiniteQueryOptions<ListCollectiblesReturn, Error, InfiniteData<ListCollectiblesReturn, unknown>, (
  | "collectable"
  | "list"
  | ListCollectiblesQueryOptions)[], Page>, "queryFn"> & {
} & {
};
```

Defined in: [sdk/src/react/queries/listCollectibles.ts:133](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/queries/listCollectibles.ts#L133)

#### Parameters

##### params

[`ListCollectiblesQueryOptions`](#listcollectiblesqueryoptions)

#### Returns

`OmitKeyof`\<`UseInfiniteQueryOptions`\<`ListCollectiblesReturn`, `Error`, `InfiniteData`\<`ListCollectiblesReturn`, `unknown`\>, (
  \| `"collectable"`
  \| `"list"`
  \| [`ListCollectiblesQueryOptions`](#listcollectiblesqueryoptions))[], `Page`\>, `"queryFn"`\> & \{
\} & \{
\}

## References

### useBalanceOfCollectible

Re-exports [useBalanceOfCollectible](collectibles/useBalanceOfCollectible.md#usebalanceofcollectible)

***

### useCollectible

Re-exports [useCollectible](collectibles/useCollectible.md#usecollectible)

***

### UseCollectibleParams

Re-exports [UseCollectibleParams](collectibles/useCollectible.md#usecollectibleparams)

***

### useCountOfCollectables

Re-exports [useCountOfCollectables](collectibles/useCountOfCollectables.md#usecountofcollectables)

***

### UseCountOfCollectablesParams

Re-exports [UseCountOfCollectablesParams](collectibles/useCountOfCollectables.md#usecountofcollectablesparams)

***

### useListCollectibleActivities

Re-exports [useListCollectibleActivities](collectibles/useListCollectibleActivities.md#uselistcollectibleactivities)

***

### UseListCollectibleActivitiesArgs

Re-exports [UseListCollectibleActivitiesArgs](collectibles/useListCollectibleActivities.md#uselistcollectibleactivitiesargs)

***

### UseListCollectibleActivitiesParams

Re-exports [UseListCollectibleActivitiesParams](collectibles/useListCollectibleActivities.md#uselistcollectibleactivitiesparams)

***

### UseListCollectibleActivitiesReturn

Re-exports [UseListCollectibleActivitiesReturn](collectibles/useListCollectibleActivities.md#uselistcollectibleactivitiesreturn)

***

### useListCollectibles

Re-exports [useListCollectibles](collectibles/useListCollectibles.md#uselistcollectibles)

***

### UseListCollectiblesArgs

Re-exports [UseListCollectiblesArgs](collectibles/useListCollectibles.md#uselistcollectiblesargs)

***

### useListCollectiblesPaginated

Re-exports [useListCollectiblesPaginated](collectibles/useListCollectiblesPaginated.md#uselistcollectiblespaginated)

***

### UseListCollectiblesPaginatedArgs

Re-exports [UseListCollectiblesPaginatedArgs](collectibles/useListCollectiblesPaginated.md#uselistcollectiblespaginatedargs)

***

### UseListCollectiblesPaginatedParams

Re-exports [UseListCollectiblesPaginatedParams](collectibles/useListCollectiblesPaginated.md#uselistcollectiblespaginatedparams)

***

### UseListCollectiblesPaginatedReturn

Re-exports [UseListCollectiblesPaginatedReturn](collectibles/useListCollectiblesPaginated.md#uselistcollectiblespaginatedreturn)

***

### UseListCollectiblesParams

Re-exports [UseListCollectiblesParams](collectibles/useListCollectibles.md#uselistcollectiblesparams)
