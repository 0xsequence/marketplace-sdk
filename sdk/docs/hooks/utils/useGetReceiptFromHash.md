# utils/useGetReceiptFromHash

## Functions

### useGetReceiptFromHash()

```ts
function useGetReceiptFromHash(): {
  waitForReceipt: (transactionHash) => Promise<TransactionReceipt>;
};
```

Defined in: [sdk/src/react/hooks/utils/useGetReceiptFromHash.tsx:41](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useGetReceiptFromHash.tsx#L41)

Hook to get transaction receipt from hash

Provides a function to wait for a transaction receipt using a transaction hash.
This is a wagmi-based hook for direct blockchain interaction.

#### Returns

```ts
{
  waitForReceipt: (transactionHash) => Promise<TransactionReceipt>;
}
```

Object containing waitForReceipt function

##### waitForReceipt()

```ts
waitForReceipt: (transactionHash) => Promise<TransactionReceipt>;
```

###### Parameters

###### transactionHash

`` `0x${string}` ``

###### Returns

`Promise`\<`TransactionReceipt`\>

#### Examples

Basic usage:
```typescript
const { waitForReceipt } = useGetReceiptFromHash();

// Wait for transaction receipt
const receipt = await waitForReceipt('0x123...');
console.log('Transaction status:', receipt.status);
```

In transaction flow:
```typescript
const { waitForReceipt } = useGetReceiptFromHash();

const handleTransaction = async () => {
  try {
    const hash = await writeContract({ ... });
    const receipt = await waitForReceipt(hash);
    if (receipt.status === 'success') {
      console.log('Transaction confirmed!');
    }
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};
```
