# data/tokens/useSearchTokenMetadata

## Type Aliases

### UseSearchTokenMetadataParams

```ts
type UseSearchTokenMetadataParams = Optional<SearchTokenMetadataQueryOptions, "config"> & {
  onlyMinted?: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useSearchTokenMetadata.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useSearchTokenMetadata.tsx#L12)

#### Type declaration

##### onlyMinted?

```ts
optional onlyMinted: boolean;
```

If true, only return minted tokens (tokens with supply > 0)

## Functions

### useSearchTokenMetadata()

```ts
function useSearchTokenMetadata(params): 
  | {
  data: undefined;
  error: Error;
  isError: boolean;
}
  | {
  data: undefined;
  error: Error;
  isError: boolean;
}
  | {
  data: undefined;
  error: Error;
  isError: boolean;
}
  | {
  data: undefined;
  error: Error;
  isError: boolean;
}
  | {
  data: undefined;
  error: Error;
  isError: boolean;
}
  | {
  data:   | undefined
     | {
     page: Page;
     tokenMetadata: TokenMetadata[];
   };
}
  | {
  data:   | undefined
     | {
     page: Page;
     tokenMetadata: TokenMetadata[];
   };
}
  | {
  data:   | undefined
     | {
     page: Page;
     tokenMetadata: TokenMetadata[];
   };
}
  | {
  data:   | undefined
     | {
     page: Page;
     tokenMetadata: TokenMetadata[];
   };
}
  | {
  data:   | undefined
     | {
     page: Page;
     tokenMetadata: TokenMetadata[];
   };
}
  | {
  data:   | undefined
     | {
     page: undefined | Page;
     tokenMetadata: TokenMetadata[];
   };
  error: null | Error;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
  | {
  data:   | undefined
     | {
     page: undefined | Page;
     tokenMetadata: TokenMetadata[];
   };
  error: null | Error;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
  | {
  data:   | undefined
     | {
     page: undefined | Page;
     tokenMetadata: TokenMetadata[];
   };
  error: null | Error;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
  | {
  data:   | undefined
     | {
     page: undefined | Page;
     tokenMetadata: TokenMetadata[];
   };
  error: null | Error;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
  | {
  data:   | undefined
     | {
     page: undefined | Page;
     tokenMetadata: TokenMetadata[];
   };
  error: null | Error;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetching: boolean;
  isLoading: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useSearchTokenMetadata.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useSearchTokenMetadata.tsx#L90)

Hook to search token metadata using filters with infinite pagination support

Searches for tokens in a collection based on text and property filters.
Supports filtering by attributes, ranges, and text search.
Can optionally filter to only show minted tokens (tokens with supply > 0).

#### Parameters

##### params

[`UseSearchTokenMetadataParams`](#usesearchtokenmetadataparams)

Configuration parameters

#### Returns

  \| \{
  `data`: `undefined`;
  `error`: `Error`;
  `isError`: `boolean`;
\}
  \| \{
  `data`: `undefined`;
  `error`: `Error`;
  `isError`: `boolean`;
\}
  \| \{
  `data`: `undefined`;
  `error`: `Error`;
  `isError`: `boolean`;
\}
  \| \{
  `data`: `undefined`;
  `error`: `Error`;
  `isError`: `boolean`;
\}
  \| \{
  `data`: `undefined`;
  `error`: `Error`;
  `isError`: `boolean`;
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `undefined` \| `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
  `error`: `null` \| `Error`;
  `fetchNextPage`: () => `Promise`\<`void`\>;
  `hasNextPage`: `boolean`;
  `isFetching`: `boolean`;
  `isLoading`: `boolean`;
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `undefined` \| `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
  `error`: `null` \| `Error`;
  `fetchNextPage`: () => `Promise`\<`void`\>;
  `hasNextPage`: `boolean`;
  `isFetching`: `boolean`;
  `isLoading`: `boolean`;
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `undefined` \| `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
  `error`: `null` \| `Error`;
  `fetchNextPage`: () => `Promise`\<`void`\>;
  `hasNextPage`: `boolean`;
  `isFetching`: `boolean`;
  `isLoading`: `boolean`;
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `undefined` \| `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
  `error`: `null` \| `Error`;
  `fetchNextPage`: () => `Promise`\<`void`\>;
  `hasNextPage`: `boolean`;
  `isFetching`: `boolean`;
  `isLoading`: `boolean`;
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `page`: `undefined` \| `Page`;
     `tokenMetadata`: `TokenMetadata`[];
   \};
  `error`: `null` \| `Error`;
  `fetchNextPage`: () => `Promise`\<`void`\>;
  `hasNextPage`: `boolean`;
  `isFetching`: `boolean`;
  `isLoading`: `boolean`;
\}

Infinite query result containing matching token metadata with pagination support

#### Examples

Basic text search with pagination:
```typescript
const { data, isLoading, fetchNextPage, hasNextPage } = useSearchTokenMetadata({
  chainId: 137,
  collectionAddress: '0x...',
  filter: {
    text: 'dragon'
  }
})
```

Property filters:
```typescript
const { data, fetchNextPage } = useSearchTokenMetadata({
  chainId: 1,
  collectionAddress: '0x...',
  filter: {
    properties: [
      {
        name: 'Rarity',
        type: PropertyType.STRING,
        values: ['Legendary', 'Epic']
      },
      {
        name: 'Level',
        type: PropertyType.INT,
        min: 50,
        max: 100
      }
    ]
  }
})
```

Search only minted tokens:
```typescript
const { data, fetchNextPage } = useSearchTokenMetadata({
  chainId: 1,
  collectionAddress: '0x...',
  onlyMinted: true,
  filter: {
    text: 'dragon'
  }
})
```
