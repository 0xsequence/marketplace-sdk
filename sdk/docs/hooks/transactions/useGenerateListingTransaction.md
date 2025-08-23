# transactions/useGenerateListingTransaction

## Type Aliases

### CreateReqWithDateExpiry

```ts
type CreateReqWithDateExpiry = Omit<CreateReq, "expiry"> & {
  expiry: Date;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L18)

#### Type declaration

##### expiry

```ts
expiry: Date;
```

***

### GenerateListingTransactionProps

```ts
type GenerateListingTransactionProps = Omit<GenerateListingTransactionArgs, "listing"> & {
  listing: CreateReqWithDateExpiry;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:22](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L22)

#### Type declaration

##### listing

```ts
listing: CreateReqWithDateExpiry;
```

***

### UseGenerateListingTransactionArgs

```ts
type UseGenerateListingTransactionArgs = {
  chainId: number;
  onSuccess?: (data?) => void;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:4](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L4)

#### Properties

##### chainId

```ts
chainId: number;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:5](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L5)

##### onSuccess()?

```ts
optional onSuccess: (data?) => void;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:6](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L6)

###### Parameters

###### data?

`Step`[]

###### Returns

`void`

## Functions

### generateListingTransaction()

```ts
function generateListingTransaction(params, config): Promise<Step[]>;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:37](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L37)

#### Parameters

##### params

`GenerateListingTransactionArgsWithNumberChainId`

##### config

`SdkConfig`

#### Returns

`Promise`\<`Step`[]\>

***

### useGenerateListingTransaction()

```ts
function useGenerateListingTransaction(params): 
  | {
  generateListingTransaction: UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateListingTransaction: UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateListingTransaction: UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateListingTransaction: UseMutateFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateListingTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateListingTransactionArgsWithNumberChainId, "chainId">, unknown>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx:53](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx#L53)

#### Parameters

##### params

[`UseGenerateListingTransactionArgs`](#usegeneratelistingtransactionargs)

#### Returns

  \| \{
  `generateListingTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateListingTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateListingTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateListingTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateListingTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateListingTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateListingTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateListingTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateListingTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
