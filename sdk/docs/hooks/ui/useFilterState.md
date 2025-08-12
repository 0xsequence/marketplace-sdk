# ui/useFilterState

## Functions

### useFilterState()

```ts
function useFilterState(): {
  clearAllFilters: () => void;
  deleteFilter: (name) => void;
  filterOptions: PropertyFilter[];
  getFilter: (name) => undefined | PropertyFilter;
  getFilterValues: (name) => undefined | FilterValues;
  getIntFilterRange: (name) => undefined | [number, number];
  isFilterActive: (name) => boolean;
  isIntFilterActive: (name) => boolean;
  isStringValueSelected: (name, value) => boolean;
  searchText: string;
  serialize: {
     (values): string;
     (base, values): string;
  };
  setFilterOptions: (value, options?) => Promise<URLSearchParams>;
  setIntFilterValue: (name, min, max) => void;
  setSearchText: (value, options?) => Promise<URLSearchParams>;
  setShowListedOnly: (value, options?) => Promise<URLSearchParams>;
  showListedOnly: boolean;
  toggleStringFilterValue: (name, value) => void;
};
```

Defined in: [sdk/src/react/hooks/ui/useFilterState.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/ui/useFilterState.tsx#L53)

#### Returns

```ts
{
  clearAllFilters: () => void;
  deleteFilter: (name) => void;
  filterOptions: PropertyFilter[];
  getFilter: (name) => undefined | PropertyFilter;
  getFilterValues: (name) => undefined | FilterValues;
  getIntFilterRange: (name) => undefined | [number, number];
  isFilterActive: (name) => boolean;
  isIntFilterActive: (name) => boolean;
  isStringValueSelected: (name, value) => boolean;
  searchText: string;
  serialize: {
     (values): string;
     (base, values): string;
  };
  setFilterOptions: (value, options?) => Promise<URLSearchParams>;
  setIntFilterValue: (name, min, max) => void;
  setSearchText: (value, options?) => Promise<URLSearchParams>;
  setShowListedOnly: (value, options?) => Promise<URLSearchParams>;
  showListedOnly: boolean;
  toggleStringFilterValue: (name, value) => void;
}
```

##### clearAllFilters()

```ts
clearAllFilters: () => void;
```

###### Returns

`void`

##### deleteFilter()

```ts
deleteFilter: (name) => void;
```

###### Parameters

###### name

`string`

###### Returns

`void`

##### filterOptions

```ts
filterOptions: PropertyFilter[];
```

##### getFilter()

```ts
getFilter: (name) => undefined | PropertyFilter;
```

###### Parameters

###### name

`string`

###### Returns

`undefined` \| `PropertyFilter`

##### getFilterValues()

```ts
getFilterValues: (name) => undefined | FilterValues;
```

###### Parameters

###### name

`string`

###### Returns

`undefined` \| `FilterValues`

##### getIntFilterRange()

```ts
getIntFilterRange: (name) => undefined | [number, number];
```

###### Parameters

###### name

`string`

###### Returns

`undefined` \| \[`number`, `number`\]

##### isFilterActive()

```ts
isFilterActive: (name) => boolean;
```

###### Parameters

###### name

`string`

###### Returns

`boolean`

##### isIntFilterActive()

```ts
isIntFilterActive: (name) => boolean;
```

###### Parameters

###### name

`string`

###### Returns

`boolean`

##### isStringValueSelected()

```ts
isStringValueSelected: (name, value) => boolean;
```

###### Parameters

###### name

`string`

###### value

`string`

###### Returns

`boolean`

##### searchText

```ts
searchText: string;
```

##### serialize()

```ts
serialize: {
  (values): string;
  (base, values): string;
};
```

###### Call Signature

```ts
(values): string;
```

###### Parameters

###### values

`Partial`\<`inferParserType`\<`Parsers`\> *extends* infer T ? \{ \[K in keyof T\]: inferParserType\<Parsers\>\[K\] \| null \} : `never`\>

###### Returns

`string`

###### Call Signature

```ts
(base, values): string;
```

###### Parameters

###### base

`Base`

###### values

`null` | `Partial`\<\{
`filters`: `null` \| `PropertyFilter`[];
`listedOnly`: `null` \| `boolean`;
`search`: `null` \| `string`;
\}\>

###### Returns

`string`

##### setFilterOptions()

```ts
setFilterOptions: (value, options?) => Promise<URLSearchParams>;
```

###### Parameters

###### value

`null` | `PropertyFilter`[] | (`old`) => `null` \| `PropertyFilter`[]

###### options?

`Options`

###### Returns

`Promise`\<`URLSearchParams`\>

##### setIntFilterValue()

```ts
setIntFilterValue: (name, min, max) => void;
```

###### Parameters

###### name

`string`

###### min

`number`

###### max

`number`

###### Returns

`void`

##### setSearchText()

```ts
setSearchText: (value, options?) => Promise<URLSearchParams>;
```

###### Parameters

###### value

`null` | `string` | (`old`) => `null` \| `string`

###### options?

`Options`

###### Returns

`Promise`\<`URLSearchParams`\>

##### setShowListedOnly()

```ts
setShowListedOnly: (value, options?) => Promise<URLSearchParams>;
```

###### Parameters

###### value

`null` | `boolean` | (`old`) => `null` \| `boolean`

###### options?

`Options`

###### Returns

`Promise`\<`URLSearchParams`\>

##### showListedOnly

```ts
showListedOnly: boolean;
```

##### toggleStringFilterValue()

```ts
toggleStringFilterValue: (name, value) => void;
```

###### Parameters

###### name

`string`

###### value

`string`

###### Returns

`void`
