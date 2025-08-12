# data/primary-sales/useErc721SalesData

## Functions

### useErc721SaleDetails()

```ts
function useErc721SaleDetails(__namedParameters): {
  error: null | Error;
  isLoading: boolean;
  quantityMinted: undefined | bigint;
  quantityRemaining: undefined | bigint;
  quantityTotal: undefined | bigint;
  saleDetails:   | undefined
     | {
     cost: bigint;
     endTime: bigint;
     merkleRoot: `0x${string}`;
     paymentToken: `0x${string}`;
     remainingSupply: bigint;
     startTime: bigint;
   }
     | {
     cost: bigint;
     endTime: bigint;
     merkleRoot: `0x${string}`;
     paymentToken: `0x${string}`;
     startTime: bigint;
     supplyCap: bigint;
   };
};
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useErc721SalesData.tsx:21](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useErc721SalesData.tsx#L21)

#### Parameters

##### \_\_namedParameters

`UseErc721CollectionDataProps`

#### Returns

```ts
{
  error: null | Error;
  isLoading: boolean;
  quantityMinted: undefined | bigint;
  quantityRemaining: undefined | bigint;
  quantityTotal: undefined | bigint;
  saleDetails:   | undefined
     | {
     cost: bigint;
     endTime: bigint;
     merkleRoot: `0x${string}`;
     paymentToken: `0x${string}`;
     remainingSupply: bigint;
     startTime: bigint;
   }
     | {
     cost: bigint;
     endTime: bigint;
     merkleRoot: `0x${string}`;
     paymentToken: `0x${string}`;
     startTime: bigint;
     supplyCap: bigint;
   };
}
```

##### error

```ts
error: null | Error;
```

##### isLoading

```ts
isLoading: boolean;
```

##### quantityMinted

```ts
quantityMinted: undefined | bigint;
```

##### quantityRemaining

```ts
quantityRemaining: undefined | bigint;
```

##### quantityTotal

```ts
quantityTotal: undefined | bigint;
```

##### saleDetails

```ts
saleDetails: 
  | undefined
  | {
  cost: bigint;
  endTime: bigint;
  merkleRoot: `0x${string}`;
  paymentToken: `0x${string}`;
  remainingSupply: bigint;
  startTime: bigint;
}
  | {
  cost: bigint;
  endTime: bigint;
  merkleRoot: `0x${string}`;
  paymentToken: `0x${string}`;
  startTime: bigint;
  supplyCap: bigint;
};
```
