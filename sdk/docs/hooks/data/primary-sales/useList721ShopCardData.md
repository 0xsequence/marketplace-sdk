# data/primary-sales/useList721ShopCardData

## Functions

### useList721ShopCardData()

```ts
function useList721ShopCardData(__namedParameters): {
  collectibleCards: (
     | {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC721;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: string;
     quantityRemaining: string;
     saleEndsAt: string;
     salePrice: {
        amount: string;
        currencyAddress: `0x${string}`;
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: string;
     tokenMetadata: TokenMetadata;
   }
     | {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC721;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: undefined;
     quantityRemaining: undefined;
     saleEndsAt: undefined;
     salePrice: {
        amount: string;
        currencyAddress: "0x0000000000000000000000000000000000000000";
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: undefined;
     tokenMetadata: TokenMetadata;
  })[];
  isLoading: boolean;
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
  saleDetailsError: null | ReadContractErrorType;
  salePrice:   | {
     amount: string;
     currencyAddress: `0x${string}`;
   }
     | {
     amount: string;
     currencyAddress: "0x0000000000000000000000000000000000000000";
   };
  tokenSuppliesData: undefined | InfiniteData<GetTokenSuppliesReturn, unknown>;
};
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useList721ShopCardData.tsx:22](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useList721ShopCardData.tsx#L22)

#### Parameters

##### \_\_namedParameters

`UseList721ShopCardDataProps`

#### Returns

```ts
{
  collectibleCards: (
     | {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC721;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: string;
     quantityRemaining: string;
     saleEndsAt: string;
     salePrice: {
        amount: string;
        currencyAddress: `0x${string}`;
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: string;
     tokenMetadata: TokenMetadata;
   }
     | {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC721;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: undefined;
     quantityRemaining: undefined;
     saleEndsAt: undefined;
     salePrice: {
        amount: string;
        currencyAddress: "0x0000000000000000000000000000000000000000";
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: undefined;
     tokenMetadata: TokenMetadata;
  })[];
  isLoading: boolean;
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
  saleDetailsError: null | ReadContractErrorType;
  salePrice:   | {
     amount: string;
     currencyAddress: `0x${string}`;
   }
     | {
     amount: string;
     currencyAddress: "0x0000000000000000000000000000000000000000";
   };
  tokenSuppliesData: undefined | InfiniteData<GetTokenSuppliesReturn, unknown>;
}
```

##### collectibleCards

```ts
collectibleCards: (
  | {
  cardLoading: boolean;
  chainId: number;
  collectibleId: string;
  collectionAddress: `0x${string}`;
  collectionType: ERC721;
  marketplaceType: "shop";
  quantityDecimals: number;
  quantityInitial: string;
  quantityRemaining: string;
  saleEndsAt: string;
  salePrice: {
     amount: string;
     currencyAddress: `0x${string}`;
  };
  salesContractAddress: `0x${string}`;
  saleStartsAt: string;
  tokenMetadata: TokenMetadata;
}
  | {
  cardLoading: boolean;
  chainId: number;
  collectibleId: string;
  collectionAddress: `0x${string}`;
  collectionType: ERC721;
  marketplaceType: "shop";
  quantityDecimals: number;
  quantityInitial: undefined;
  quantityRemaining: undefined;
  saleEndsAt: undefined;
  salePrice: {
     amount: string;
     currencyAddress: "0x0000000000000000000000000000000000000000";
  };
  salesContractAddress: `0x${string}`;
  saleStartsAt: undefined;
  tokenMetadata: TokenMetadata;
})[];
```

##### isLoading

```ts
isLoading: boolean;
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

##### saleDetailsError

```ts
saleDetailsError: null | ReadContractErrorType;
```

##### salePrice

```ts
salePrice: 
  | {
  amount: string;
  currencyAddress: `0x${string}`;
}
  | {
  amount: string;
  currencyAddress: "0x0000000000000000000000000000000000000000";
};
```

##### tokenSuppliesData

```ts
tokenSuppliesData: undefined | InfiniteData<GetTokenSuppliesReturn, unknown>;
```
