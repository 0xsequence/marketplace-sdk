# utils/useRoyalty

## Interfaces

### UseRoyaltyArgs

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:9](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L9)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:10](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L10)

##### collectibleId

```ts
collectibleId: string;
```

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:12](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L12)

##### collectionAddress

```ts
collectionAddress: `0x${string}`;
```

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:11](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L11)

##### query?

```ts
optional query: QueryArg;
```

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:13](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L13)

## Functions

### useRoyalty()

```ts
function useRoyalty(args): 
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
}
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
}
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
}
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
}
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
}
  | {
  data:   | null
     | {
     percentage: bigint;
     recipient: `0x${string}`;
   };
};
```

Defined in: [sdk/src/react/hooks/utils/useRoyalty.tsx:59](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useRoyalty.tsx#L59)

Hook to fetch royalty information for a collectible

Reads royalty information from the blockchain using the EIP-2981 standard.
This hook queries the contract directly to get royalty percentage and recipient
address for a specific token.

#### Parameters

##### args

[`UseRoyaltyArgs`](#useroyaltyargs)

Configuration parameters

#### Returns

  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}
  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}
  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}
  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}
  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}
  \| \{
  `data`:   \| `null`
     \| \{
     `percentage`: `bigint`;
     `recipient`: `` `0x${string}` ``;
   \};
\}

Query result containing royalty information (percentage and recipient) or null

#### Examples

Basic usage:
```typescript
const { data, isLoading } = useRoyalty({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '1'
})

if (data) {
  console.log('Royalty:', data.percentage, 'Recipient:', data.recipient)
}
```

With custom query options:
```typescript
const { data, isLoading } = useRoyalty({
  chainId: 1,
  collectionAddress: '0x...',
  collectibleId: '42',
  query: {
    refetchInterval: 60000,
    enabled: hasTokenId
  }
})
```
