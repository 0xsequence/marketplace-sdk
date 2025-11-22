# WaaS Fee Selection: The Final, Simple Solution

## The Complete Picture! 🎯

After reviewing the sequence.js source code, here's how it actually works:

### How Fee Options Work

1. **Get fee options proactively**:
   ```typescript
   const checkFeeOptions = useCheckWaasFeeOptions();
   const { feeOptions, isSponsored } = await checkFeeOptions({
     transactions: [tx],
     chainId: 137
   });
   ```

2. **Pass the selected option to transaction**:
   ```typescript
   await waasProvider.sendTransaction({
     transactions: [...],
     transactionsFeeOption: selectedFeeOption  // <-- Adds fee payment to transactions!
   });
   ```

3. **What happens internally** (from `transactions.ts:153-197`):
   ```typescript
   function withTransactionFee(transactions: Transaction[], feeOption?: FeeOption): Transaction[] {
     const extendedTransactions = [...transactions];
     if (feeOption) {
       // Adds a payment transaction to the batch!
       switch (feeOption.token.type) {
         case 'erc20Token':
           extendedTransactions.push(erc20({
             tokenAddress: feeOption.token.contractAddress,
             to: feeOption.to,
             value: feeOption.value
           }));
           break;
         case 'unknown': // Native token
           extendedTransactions.push({
             to: feeOption.to,
             value: feeOption.value
           });
           break;
       }
     }
     return extendedTransactions;
   }
   ```

**The Key Insight**: When you provide `transactionsFeeOption`, the WaaS SDK automatically appends a fee payment transaction to your transaction batch. The fee handler pattern is just a fallback UI flow!

## The Problem with Our Current Integration

We're using **wagmi's `sendTransaction`**, which doesn't know about `transactionsFeeOption`. We need to use the **WaaS provider directly** or find where wagmi connector bridges to it.

### Current Flow (Complex):
```
App → wagmi.sendTransaction()
    → WaaS Connector intercepts
    → Triggers feeConfirmationHandler
    → We poll/wait for user selection
    → Handler returns selection
    → WaaS adds fee payment
    → Transaction executes
```

### Desired Flow (Simple):
```
App → Get fee options (useCheckWaasFeeOptions)
    → Auto-select best option
    → sendTransaction({ ..., transactionsFeeOption })
    → WaaS adds fee payment automatically
    → Transaction executes
```

## The Missing Link: How to Pass FeeOption Through Wagmi?

Looking at the code, there are two approaches:

### Approach A: Use WaaS Provider Directly (Bypassing Wagmi)

Instead of wagmi's `sendTransaction`, call the WaaS provider directly:

```typescript
const waasConnector = connectors.find(c => c.id === 'sequence-waas');
const waasProvider = waasConnector.sequenceWaasProvider;

// Get fee options
const { feeOptions } = await waasProvider.checkTransactionFeeOptions({
  transactions: [tx],
  chainId
});

// Select
const selected = feeOptions.find(o => hasBalance) || feeOptions[0];

// Send with option
const result = await waasProvider.sendTransaction({
  transactions: [tx],
  transactionsFeeOption: selected,
  network: chainId,
  identifier: 'unique-id'
});
```

**Problem**: This bypasses wagmi completely, loses React Query integration, state management, etc.

### Approach B: Set Fee Option in Shared State Before Transaction

The `useWaasFeeOptions` hook uses shared state:

```typescript
// From useWaasFeeOptions.js
let sharedPendingConfirmation = undefined;
let sharedDeferred = undefined;
```

The fee confirmation handler checks this shared state. So maybe:

```typescript
// 1. Get options proactively
const { feeOptions } = await checkFeeOptions({ transactions, chainId });

// 2. Auto-select
const selected = autoSelect(feeOptions);

// 3. Set up handler to auto-confirm
const [pending, confirm, reject] = useWaasFeeOptions();

useEffect(() => {
  if (pending && selected) {
    // Auto-confirm immediately
    confirm(pending.id, selected.token.contractAddress);
  }
}, [pending, selected, confirm]);

// 4. Send transaction normally through wagmi
await sendTransaction({ ... });
```

This still uses the handler pattern, but auto-confirms instantly.

### Approach C: Extend Wagmi Connector (Best Long-term)

The WaaS connector could expose a method to set the fee option:

```typescript
// In WaaS connector
connector.setNextTransactionFeeOption(feeOption);

// Then when sendTransaction is called
await sendTransaction({ ... }); // Uses the pre-set fee option
```

##The Practical Solution for Sell Modal

Given the current architecture, here's the **simplest working solution**:

### 1. Use `useCheckWaasFeeOptions` to get options proactively

```typescript
// context.ts
import { useCheckWaasFeeOptions } from '@0xsequence/connect';

const checkFeeOptions = useCheckWaasFeeOptions();
const [feeOptions, setFeeOptions] = useState<FeeOption[]>();
const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOption>();

// Check fee options when transaction is ready
useEffect(() => {
  if (!sellSteps.data?.sellStep || !isWaaS) return;

  checkFeeOptions({
    transactions: [sellSteps.data.sellStep],
    chainId: state.chainId
  }).then(result => {
    if (!result.isSponsored && result.feeOptions) {
      setFeeOptions(result.feeOptions);
      // Auto-select first option (or enhance with balance check)
      setSelectedFeeOption(result.feeOptions[0]);
    }
  });
}, [sellSteps.data, isWaaS]);
```

### 2. Use existing `useWaasFeeOptions` handler for auto-confirmation

```typescript
// Keep the handler but simplify
const [pendingConfirmation, confirmFeeOption, rejectFeeOption] = useWaasFeeOptions();

// Auto-confirm when options appear
useEffect(() => {
  if (pendingConfirmation && selectedFeeOption) {
    confirmFeeOption(
      pendingConfirmation.id,
      selectedFeeOption.token.contractAddress || null
    );
  }
}, [pendingConfirmation, selectedFeeOption, confirmFeeOption]);
```

### 3. Remove polling from useProcessStep

Delete lines 37-71 in `useProcessStep.ts` - we're confirming immediately, no need to poll!

## Benefits of This Solution

✅ **Proactive**: Get fee options before transaction starts  
✅ **Simple**: Reuses existing hooks, minimal changes  
✅ **Headless**: Auto-confirms immediately, no UI blocking  
✅ **Works Today**: No changes to wagmi connector needed  
✅ **Clean**: Removes ~40 lines of polling logic  

## Code Changes Required

### 1. `context.ts` - Add proactive fee checking
```typescript
import { useCheckWaasFeeOptions } from '@0xsequence/connect';

const checkFeeOptions = useCheckWaasFeeOptions();
const [feeOptions, setFeeOptions] = useState<FeeOption[]>();

// Get fee options proactively
useEffect(() => {
  if (!sellSteps.data?.sellStep || !isWaaS) return;

  checkFeeOptions({
    transactions: [sellSteps.data.sellStep],
    chainId: state.chainId
  }).then(result => {
    if (!result.isSponsored && result.feeOptions) {
      setFeeOptions(result.feeOptions);
      // Auto-select (can enhance with balance check)
      const firstOption = result.feeOptions[0];
      setSelectedFeeOption(firstOption);
    }
  });
}, [sellSteps.data, isWaaS]);

// Auto-confirm immediately when handler is triggered
useEffect(() => {
  if (feeOptionConfirmation && selectedFeeOption) {
    confirmFeeOption(
      feeOptionConfirmation.id,
      selectedFeeOption.token.contractAddress || null
    );
    setOptionConfirmed(true);
  }
}, [feeOptionConfirmation, selectedFeeOption, confirmFeeOption]);
```

### 2. `useProcessStep.ts` - Remove polling
```typescript
// DELETE lines 37-71 (the entire polling block)

// Just send the transaction - handler will be called and auto-confirmed
const hash = await sendTransactionAsync({
  chainId,
  to: step.to as Hex,
  data: step.data as Hex,
  value: hexToBigInt((step.value as Hex) || '0x0'),
  // ... gas params
});
```

## Future Enhancement: Balance-Based Auto-Select

```typescript
// Add balance checking to auto-select
const selectBestFeeOption = async (options: FeeOption[]) => {
  const indexerClient = useIndexerClient(chainId);
  const accountAddress = address;

  for (const option of options) {
    let balance: bigint;
    
    if (option.token.contractAddress) {
      // ERC20
      const result = await indexerClient.getTokenBalancesByContract({
        filter: {
          accountAddresses: [accountAddress],
          contractAddresses: [option.token.contractAddress]
        }
      });
      balance = BigInt(result.balances[0]?.balance || '0');
    } else {
      // Native token
      const result = await indexerClient.getNativeTokenBalance({ accountAddress });
      balance = BigInt(result.balance.balance);
    }

    if (balance >= BigInt(option.value)) {
      return option; // First option with sufficient balance
    }
  }

  return options[0]; // Fallback to first option
};
```

## Summary

The solution is **much simpler** than our original complex approach:

1. ✅ **Use `useCheckWaasFeeOptions`** to get options proactively
2. ✅ **Auto-select** the best option (first with balance, or first option)
3. ✅ **Keep `useWaasFeeOptions`** but auto-confirm immediately
4. ✅ **Remove polling** from `useProcessStep`

This gives us a headless, automatic fee selection flow while working with the existing infrastructure!

The key insight: **We don't need to pass feeOption through wagmi** - the handler pattern works fine if we just auto-confirm immediately instead of waiting for user input.

## Next Steps

1. Implement proactive fee checking in `context.ts`
2. Add auto-confirmation logic
3. Remove polling from `useProcessStep.ts`
4. Test with WaaS wallet
5. Optional: Add balance-based selection for better UX

Total changes: ~30 lines added, ~40 lines removed = Net simplification! 🎉
