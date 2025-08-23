# data/primary-sales/useList1155ShopCardData

## Functions

### useList1155ShopCardData()

```ts
function useList1155ShopCardData(__namedParameters): {
  collectibleCards: {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC1155;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: undefined | string;
     quantityRemaining: undefined | string;
     saleEndsAt: undefined | string;
     salePrice: {
        amount: string;
        currencyAddress: `0x${string}`;
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: undefined | string;
     tokenMetadata: TokenMetadata;
     unlimitedSupply: undefined | boolean;
  }[];
  isLoading: boolean;
  tokenMetadataError: null | Error;
  tokenSaleDetailsError: null;
};
```

Defined in: [sdk/src/react/hooks/data/primary-sales/useList1155ShopCardData.tsx:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/primary-sales/useList1155ShopCardData.tsx#L18)

#### Parameters

##### \_\_namedParameters

`UseList1155ShopCardDataProps`

#### Returns

```ts
{
  collectibleCards: {
     cardLoading: boolean;
     chainId: number;
     collectibleId: string;
     collectionAddress: `0x${string}`;
     collectionType: ERC1155;
     marketplaceType: "shop";
     quantityDecimals: number;
     quantityInitial: undefined | string;
     quantityRemaining: undefined | string;
     saleEndsAt: undefined | string;
     salePrice: {
        amount: string;
        currencyAddress: `0x${string}`;
     };
     salesContractAddress: `0x${string}`;
     saleStartsAt: undefined | string;
     tokenMetadata: TokenMetadata;
     unlimitedSupply: undefined | boolean;
  }[];
  isLoading: boolean;
  tokenMetadataError: null | Error;
  tokenSaleDetailsError: null;
}
```

##### collectibleCards

```ts
collectibleCards: {
  cardLoading: boolean;
  chainId: number;
  collectibleId: string;
  collectionAddress: `0x${string}`;
  collectionType: ERC1155;
  marketplaceType: "shop";
  quantityDecimals: number;
  quantityInitial: undefined | string;
  quantityRemaining: undefined | string;
  saleEndsAt: undefined | string;
  salePrice: {
     amount: string;
     currencyAddress: `0x${string}`;
  };
  salesContractAddress: `0x${string}`;
  saleStartsAt: undefined | string;
  tokenMetadata: TokenMetadata;
  unlimitedSupply: undefined | boolean;
}[];
```

##### isLoading

```ts
isLoading: boolean;
```

##### tokenMetadataError

```ts
tokenMetadataError: null | Error = primarySaleItemsError;
```

##### tokenSaleDetailsError

```ts
tokenSaleDetailsError: null = null;
```
