# transactions/useGenerateSellTransaction

## Functions

### generateSellTransaction()

```ts
function generateSellTransaction(args, config): Promise<Step[]>;
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateSellTransaction.tsx:20](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateSellTransaction.tsx#L20)

#### Parameters

##### args

`GenerateSellTransactionArgsWithNumberChainId`

##### config

`SdkConfig`

#### Returns

`Promise`\<`Step`[]\>

***

### useGenerateSellTransaction()

```ts
function useGenerateSellTransaction(params): 
  | {
  generateSellTransaction: UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateSellTransaction: UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateSellTransaction: UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
}
  | {
  generateSellTransaction: UseMutateFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
  generateSellTransactionAsync: UseMutateAsyncFunction<Step[], Error, Omit<GenerateSellTransactionArgsWithNumberChainId, "chainId">, unknown>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useGenerateSellTransaction.tsx:34](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useGenerateSellTransaction.tsx#L34)

#### Parameters

##### params

`UseGenerateSellTransactionArgs`

#### Returns

  \| \{
  `generateSellTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateSellTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateSellTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateSellTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateSellTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateSellTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
  \| \{
  `generateSellTransaction`: `UseMutateFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
  `generateSellTransactionAsync`: `UseMutateAsyncFunction`\<`Step`[], `Error`, `Omit`\<`GenerateSellTransactionArgsWithNumberChainId`, `"chainId"`\>, `unknown`\>;
\}
