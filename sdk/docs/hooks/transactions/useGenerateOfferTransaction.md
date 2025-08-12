# transactions/useGenerateOfferTransaction

## Type Aliases

### GenerateOfferTransactionProps

```ts
type GenerateOfferTransactionProps = Omit<GenerateOfferTransactionArgs, "offer"> & {
  offer: CreateReqWithDateExpiry;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L23)

#### Type declaration

##### offer

```ts
offer: CreateReqWithDateExpiry;
```

***

### UseGenerateOfferTransactionArgs

```ts
type UseGenerateOfferTransactionArgs = {
  chainId: number;
  onSuccess?: (data?) => void;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:14](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L14)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L15)

##### onSuccess()?

```ts
optional onSuccess: (data?) => void;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L16)

###### Parameters

###### data?

`Step`[]

###### Returns

`void`

## Functions

### generateOfferTransaction()

```ts
function generateOfferTransaction(
   params, 
   config, 
walletKind?): Promise<Step[]>;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:38](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L38)

#### Parameters

##### params

`GenerateOfferTransactionArgsWithNumberChainId`

##### config

`SdkConfig`

##### walletKind?

`WalletKind`

#### Returns

`Promise`\<`Step`[]\>

***

### useGenerateOfferTransaction()

```ts
function useGenerateOfferTransaction(params): 
  | {
  generateOfferTransaction: UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateOfferTransaction: UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateOfferTransaction: UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateOfferTransaction: UseMutateFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateOfferTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateOfferTransactionArgsWithNumberChainId, "chainId">, unknown>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx#L53)

#### Parameters

##### params

[`UseGenerateOfferTransactionArgs`](#usegenerateoffertransactionargs)

#### Returns

  \| \{
  `generateOfferTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateOfferTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateOfferTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateOfferTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateOfferTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateOfferTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateOfferTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateOfferTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateOfferTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
