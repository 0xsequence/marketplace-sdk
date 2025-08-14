# ui/useFilters

## Type Aliases

### UseFilterReturn

```ts
type UseFilterReturn = PropertyFilter[];
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:178](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L178)

***

### UseFiltersArgs

```ts
type UseFiltersArgs = {
  chainId: number;
  collectionAddress: string;
  excludePropertyValues?: boolean;
  query?: {
     enabled?: boolean;
  };
  showAllFilters?: boolean;
};
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:168](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L168)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:169](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L169)

##### collectionAddress

```ts
collectionAddress: string;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:170](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L170)

##### excludePropertyValues?

```ts
optional excludePropertyValues: boolean;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:172](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L172)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:173](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L173)

###### enabled?

```ts
optional enabled: boolean;
```

##### showAllFilters?

```ts
optional showAllFilters: boolean;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:171](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L171)

***

### UseFiltersParams

```ts
type UseFiltersParams = Optional<FiltersQueryOptions, "config">;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L13)

## Functions

### useFilters()

```ts
function useFilters(params): UseQueryResult<PropertyFilter[], Error>;
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:74](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L74)

Hook to fetch metadata filters for a collection

Retrieves property filters for a collection from the metadata service,
with support for marketplace-specific filter configuration including
exclusion rules and custom ordering.

#### Parameters

##### params

[`UseFiltersParams`](#usefiltersparams)

Configuration parameters

#### Returns

`UseQueryResult`\<`PropertyFilter`[], `Error`\>

Query result containing property filters for the collection

#### Examples

Basic usage:
```typescript
const { data: filters, isLoading } = useFilters({
  chainId: 137,
  collectionAddress: '0x1234...'
})

if (data) {
  console.log(`Found ${data.length} filters`);
  data.forEach(filter => {
    console.log(`${filter.name}: ${filter.values?.join(', ')}`);
  });
}
```

With marketplace filtering disabled:
```typescript
const { data: allFilters } = useFilters({
  chainId: 1,
  collectionAddress: '0x5678...',
  showAllFilters: true, // Bypass marketplace filter rules
  query: {
    enabled: Boolean(selectedCollection),
    staleTime: 300000 // Cache for 5 minutes
  }
})
```

Exclude property values for faster loading:
```typescript
const { data: filterNames } = useFilters({
  chainId: 137,
  collectionAddress: collectionAddress,
  excludePropertyValues: true, // Only get filter names, not values
  query: {
    enabled: Boolean(collectionAddress)
  }
})
```

***

### useFiltersProgressive()

```ts
function useFiltersProgressive(params): 
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
}
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
}
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
}
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
}
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
}
  | {
  isFetchingValues: boolean;
  isLoadingNames: boolean;
};
```

Defined in: [sdk/src/react/hooks/ui/useFilters.tsx:132](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilters.tsx#L132)

Hook to progressively load collection filters

First loads filter names only for fast initial display, then loads full filter
data with values. Uses placeholder data to provide immediate feedback while
full data loads in the background.

#### Parameters

##### params

[`UseFiltersParams`](#usefiltersparams)

Configuration parameters (same as useFilters)

#### Returns

  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}
  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}
  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}
  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}
  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}
  \| \{
  `isFetchingValues`: `boolean`;
  `isLoadingNames`: `boolean`;
\}

Query result with additional loading states

#### Example

Progressive filter loading:
```typescript
const {
  data: filters,
  isLoadingNames,
  isFetchingValues,
  isLoading
} = useFiltersProgressive({
  chainId: 137,
  collectionAddress: '0x1234...'
})

if (isLoadingNames) {
  return <div>Loading filters...</div>;
}

return (
  <div>
    {filters?.map(filter => (
      <FilterComponent
        key={filter.name}
        filter={filter}
        isLoadingValues={isFetchingValues}
      />
    ))}
  </div>
);
```

## References

### FetchFiltersParams

Re-exports [FetchFiltersParams](../index.md#fetchfiltersparams)

***

### filtersQueryOptions

Re-exports [filtersQueryOptions](../index.md#filtersqueryoptions-1)

***

### FiltersQueryOptions

Re-exports [FiltersQueryOptions](../index.md#filtersqueryoptions)
