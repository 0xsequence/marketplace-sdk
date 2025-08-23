# data/market/useListMarketCardData

## Functions

### useListMarketCardData()

```ts
function useListMarketCardData(__namedParameters): {
  allCollectibles: CollectibleOrder[];
  collectibleCards: MarketCollectibleCardProps[];
  error: null | Error;
  fetchNextPage: (options?) => Promise<InfiniteQueryObserverResult<InfiniteData<ListCollectiblesReturn, unknown>, Error>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/market/useListMarketCardData.tsx:34](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/market/useListMarketCardData.tsx#L34)

#### Parameters

##### \_\_namedParameters

`UseListMarketCardDataProps`

#### Returns

```ts
{
  allCollectibles: CollectibleOrder[];
  collectibleCards: MarketCollectibleCardProps[];
  error: null | Error;
  fetchNextPage: (options?) => Promise<InfiniteQueryObserverResult<InfiniteData<ListCollectiblesReturn, unknown>, Error>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}
```

##### allCollectibles

```ts
allCollectibles: CollectibleOrder[];
```

##### collectibleCards

```ts
collectibleCards: MarketCollectibleCardProps[];
```

##### error

```ts
error: null | Error = collectiblesListError;
```

##### fetchNextPage()

```ts
fetchNextPage: (options?) => Promise<InfiniteQueryObserverResult<InfiniteData<ListCollectiblesReturn, unknown>, Error>>;
```

###### Parameters

###### options?

`FetchNextPageOptions`

###### Returns

`Promise`\<`InfiniteQueryObserverResult`\<`InfiniteData`\<`ListCollectiblesReturn`, `unknown`\>, `Error`\>\>

##### hasNextPage

```ts
hasNextPage: boolean;
```

##### isFetchingNextPage

```ts
isFetchingNextPage: boolean;
```

##### isLoading

```ts
isLoading: boolean;
```
