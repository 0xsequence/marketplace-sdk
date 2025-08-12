# transactions/useTransferTokens

## Type Aliases

### TransferTokensParams

```ts
type TransferTokensParams = ERC721TransferParams | ERC1155TransferParams;
```

Defined in: [sdk/src/react/hooks/transactions/useTransferTokens.tsx:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useTransferTokens.tsx#L23)

## Functions

### useTransferTokens()

```ts
function useTransferTokens(): {
  hash: undefined | `0x${string}`;
  transferFailed: boolean;
  transferring: boolean;
  transferSuccess: boolean;
  transferTokensAsync: (params) => Promise<`0x${string}`>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useTransferTokens.tsx:56](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useTransferTokens.tsx#L56)

#### Returns

```ts
{
  hash: undefined | `0x${string}`;
  transferFailed: boolean;
  transferring: boolean;
  transferSuccess: boolean;
  transferTokensAsync: (params) => Promise<`0x${string}`>;
}
```

##### hash

```ts
hash: undefined | `0x${string}`;
```

##### transferFailed

```ts
transferFailed: boolean = isError;
```

##### transferring

```ts
transferring: boolean = isPending;
```

##### transferSuccess

```ts
transferSuccess: boolean = isSuccess;
```

##### transferTokensAsync()

```ts
transferTokensAsync: (params) => Promise<`0x${string}`>;
```

###### Parameters

###### params

[`TransferTokensParams`](#transfertokensparams)

###### Returns

`Promise`\<`` `0x${string}` ``\>
