# transactions/useGenerateCancelTransaction

## Functions

### generateCancelTransaction()

```ts
function generateCancelTransaction(args, config): Promise<Step[]>;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateCancelTransaction.tsx:23](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateCancelTransaction.tsx#L23)

#### Parameters

##### args

`GenerateCancelTransactionArgsWithNumberChainId`

##### config

`SdkConfig`

#### Returns

`Promise`\<`Step`[]\>

***

### useGenerateCancelTransaction()

```ts
function useGenerateCancelTransaction(params): 
  | {
  generateCancelTransaction: UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
}
  | {
  generateCancelTransaction: UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
}
  | {
  generateCancelTransaction: UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
}
  | {
  generateCancelTransaction: UseMutateFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
  generateCancelTransactionAsync: UseMutateAsyncFunction<Step[], Error, GenerateCancelTransactionArgsWithNumberChainId, unknown>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateCancelTransaction.tsx:33](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateCancelTransaction.tsx#L33)

#### Parameters

##### params

`UseGenerateCancelTransactionArgs`

#### Returns

  \| \{
  `generateCancelTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
  `generateCancelTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
\}
  \| \{
  `generateCancelTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
  `generateCancelTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
\}
  \| \{
  `generateCancelTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
  `generateCancelTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
\}
  \| \{
  `generateCancelTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
  `generateCancelTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `GenerateCancelTransactionArgsWithNumberChainId`, `unknown`\>;
\}
