# WaaS Fee Selection: The Simple Solution

## The Key Discovery! 🎉

**There's already a hook that gets fee options proactively!**

```typescript
import { useCheckWaasFeeOptions } from '@0xsequence/connect';

const checkFeeOptions = useCheckWaasFeeOptions();

const { feeOptions, feeQuote, isSponsored } = await checkFeeOptions({
  transactions: [transaction],
  chainId: 137
});
```

This calls: `waasProvider.checkTransactionFeeOptions({ transactions, chainId })`

## The Revelation

You're absolutely right - this CAN be much simpler! We don't need:
- ❌ `useExecuteWithFee` (separate hook)
- ❌ `useRequiresFeeSelection` (separate hook)  
- ❌ Interceptor pattern
- ❌ Two different execution paths

## The Simple Solution

### Just add feeOption to transaction execution:

```typescript
// From @0xsequence/waas types:
export type TransactionFeeArgs = {
  transactionsFeeQuote?: string;
  transactionsFeeOption?: FeeOption;  // <-- THIS IS IT!
};

export type SendTransactionsArgs = TransactionFeeArgs & {
  transactions: Transaction[];
};
```

### How It Works

1. **Get fee options proactively** (before transaction):
   ```typescript
   const checkFeeOptions = useCheckWaasFeeOptions();
   const { feeOptions } = await checkFeeOptions({ transactions, chainId });
   ```

2. **Select one** (auto or manual):
   ```typescript
   const selectedOption = feeOptions.find(o => hasBalance) || feeOptions[0];
   ```

3. **Pass it to the transaction**:
   ```typescript
   await sendTransaction({
     transactions: [...],
     transactionsFeeOption: selectedOption  // <-- DONE!
   });
   ```

No handler, no interceptor, no polling. Just pass the option!

## Updated Sell Modal Flow

### Current (Complex):
```
1. Start transaction
2. Handler interrupts
3. Poll for selection
4. Confirm selection
5. Resume transaction
```

### New (Simple):
```
1. Check fee options (useCheckWaasFeeOptions)
2. Auto-select best option
3. Send transaction with selected option
```

## Implementation

### Step 1: Check Fee Options Before Transaction

```typescript
// context.ts
import { useCheckWaasFeeOptions } from '@0xsequence/connect';

export function useSellModalContext({ onSuccess } = {}) {
  const checkFeeOptions = useCheckWaasFeeOptions();
  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOption>();

  // When sell transaction is ready, check fee options
  useEffect(() => {
    if (!sellSteps.data?.sellStep || !isWaaS) return;

    const checkFees = async () => {
      const { feeOptions, isSponsored } = await checkFeeOptions({
        transactions: [sellSteps.data.sellStep],
        chainId: state.chainId
      });

      if (!isSponsored && feeOptions && feeOptions.length > 0) {
        // Auto-select first option with balance (requires balance check)
        const optionWithBalance = await findOptionWithBalance(feeOptions);
        setSelectedFeeOption(optionWithBalance || feeOptions[0]);
      }
    };

    checkFees();
  }, [sellSteps.data, isWaaS, checkFeeOptions]);

  // Pass selected fee option to mutations
  const { approve, sell } = useSellMutations({
    tx: sellSteps.data,
    onSuccess,
    selectedFeeOption, // <-- Pass it here
  });
}
```

### Step 2: Update Mutations to Use Fee Option

```typescript
// sell-mutations.ts
type UseSellMutationsParams = {
  tx: ReturnType<typeof useGenerateSellTransaction>['data'];
  onSuccess?: OnSuccessCallback;
  selectedFeeOption?: FeeOption; // <-- Not the whole confirmation state!
};

export const useSellMutations = (params: UseSellMutationsParams) => {
  const { tx, onSuccess, selectedFeeOption } = params;
  
  async function executeStepAndWait(step: Step, feeOption?: FeeOption) {
    const res = await processStep({
      step,
      chainId: state.chainId,
      feeOption, // <-- Pass the option
    });
    // ... rest
  }

  const sell = useMutation({
    mutationFn: async () => {
      if (!tx?.sellStep) throw new Error('No sell step available');
      return await executeStepAndWait(tx.sellStep, selectedFeeOption);
    },
    // ... rest
  });
};
```

### Step 3: Update useProcessStep

```typescript
// useProcessStep.ts
type ProcessStepParams = {
  step: Step;
  chainId: number;
  feeOption?: FeeOption; // <-- Simple!
};

export const useProcessStep = () => {
  const { sendTransactionAsync } = useSendTransaction();

  const processStep = async ({ step, chainId, feeOption }: ProcessStepParams) => {
    if (isTransactionStep(step)) {
      // NO MORE POLLING! Just pass the option
      const hash = await sendTransactionAsync({
        chainId,
        to: step.to as Hex,
        data: step.data as Hex,
        value: hexToBigInt((step.value as Hex) || '0x0'),
        // If WaaS, the connector will use the feeOption
        // This gets passed through wagmi -> connector -> waas provider
        ...(feeOption && { feeOption }), // <-- Somehow pass this through?
      });

      return { type: 'transaction', hash };
    }
    // ... signatures
  };
};
```

## Questions to Answer

### Q1: How does `sendTransactionAsync` receive the feeOption?

Looking at wagmi's `sendTransaction`, it doesn't have a `feeOption` parameter directly. 

**Two possibilities:**

**A)** The WaaS connector intercepts `sendTransaction` and checks if there's a pending fee option in some shared state

**B)** We need to call a WaaS-specific method instead of wagmi's `sendTransaction`

Let me check: Does the WaaS connector expose `sendTransaction` with `TransactionFeeArgs`?

### Q2: Do we still need `useWaasFeeOptions` at all?

**Maybe not!** If we can proactively get options with `useCheckWaasFeeOptions` and pass them directly to the transaction, we don't need the handler-based approach.

## Next Investigation Points

1. **Check WaaS connector's sendTransaction signature**:
   - Does it accept `transactionsFeeOption`?
   - Or do we need to call `connector.sequenceWaasProvider.sendTransaction()` directly?

2. **Understand the wagmi integration**:
   - How does wagmi's `sendTransaction` communicate with the WaaS connector?
   - Can we extend the parameters?

3. **Check existing Sequence examples**:
   - Do you have examples in sequence.js showing how to use `checkTransactionFeeOptions` + fee selection?

## The Core Question

**How do we pass the selected `FeeOption` from `useCheckWaasFeeOptions` to the actual transaction execution?**

If we can answer this, the solution becomes trivially simple:

```typescript
// 1. Get options
const { feeOptions } = await checkFeeOptions({ transactions, chainId });

// 2. Select
const selected = autoSelect(feeOptions);

// 3. Send with option
await sendTransaction({
  ...txParams,
  feeOption: selected  // <-- How does this work?
});
```

Can you point me to:
- WaaS connector source code?
- Example of using `checkTransactionFeeOptions` + sending tx with selected option?
- wagmi integration details?

Once I understand how to pass the fee option through, this becomes a 10-line change! 🚀
