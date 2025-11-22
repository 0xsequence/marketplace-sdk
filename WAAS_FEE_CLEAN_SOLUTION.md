# WaaS Fee Selection: Clean Solution for Headless Flows

## Executive Summary

After investigating how Sequence WaaS fee selection works, here's the clean solution for headless flows like the Sell Modal.

## How WaaS Fee Selection Actually Works

### The Core Mechanism

Fee options come from the **WaaS connector at runtime**, NOT from any API endpoint. Here's the exact flow:

```
1. App calls sendTransaction() or estimateGas()
2. WaaS Connector intercepts and analyzes the transaction
3. Connector determines which tokens can pay for gas on this chain
4. Connector calls: feeConfirmationHandler.confirmFeeOption(id, options, txs, chainId)
5. Handler must return: Promise<string> (selected token address)
6. Transaction continues with selected fee token
```

### Key Insight

There is **no JSON-RPC method or API endpoint** to get fee options beforehand. The `feeConfirmationHandler` pattern is the only mechanism provided by Sequence.

This is accessed via:
```typescript
const waasConnector = connectors.find(c => c.id === 'sequence-waas');
const waasProvider = waasConnector.sequenceWaasProvider;
waasProvider.feeConfirmationHandler = {
  async confirmFeeOption(id, options, txs, chainId): Promise<string> {
    // Return selected token address
  }
};
```

## Current Problems

### 1. Manual State Management (50+ lines)
```typescript
// context.ts - Lines 86-117
const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptionExtended>();
const [optionConfirmed, setOptionConfirmed] = useState(false);
const [waasFeeSelectionError, setWaasFeeSelectionError] = useState<Error>();
const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] = useWaasFeeOptions();

// Complex effects to auto-select and confirm
useEffect(() => { /* ... */ }, [autoSelectFeeOption, confirmFeeOption, feeOptionConfirmation]);
useEffect(() => { /* ... */ }, [feeOptionConfirmation]);
```

### 2. Polling Loop (useProcessStep.ts - Lines 37-71)
```typescript
// Wait for fee confirmation with 1-second polling
await new Promise<void>((resolve) => {
  const checkConfirmation = () => {
    if (waasFeeConfirmation?.selectedOption && waasFeeConfirmation.optionConfirmed) {
      waasFeeConfirmation.confirmFeeOption(confirmationId, currencyAddress);
      resolve();
    } else {
      setTimeout(checkConfirmation, 1000); // POLL EVERY SECOND 😱
    }
  };
  checkConfirmation();
});
```

### 3. State Threading
Passing `waasFeeConfirmation` object through mutation chain adds complexity.

## Clean Solution: Interceptor Pattern

### The Approach

Instead of manually managing state and polling, **intercept the handler and auto-confirm** the pre-selected option.

### New Hook: `useExecuteWithFee`

```typescript
export function useExecuteWithFee({ chainId, onSuccess, onError }) {
  const connectors = useConnectors();
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const confirmationCallbackRef = useRef(null);

  const waasConnector = connectors.find(c => c.id === 'sequence-waas');

  // Set up interceptor
  useEffect(() => {
    if (!waasConnector) return;
    
    const waasProvider = waasConnector.sequenceWaasProvider;
    if (!waasProvider) return;

    const originalHandler = waasProvider.feeConfirmationHandler;

    // Intercept the handler
    waasProvider.feeConfirmationHandler = {
      async confirmFeeOption(id, options, txs, feeChainId): Promise<string> {
        if (feeChainId !== chainId) {
          return originalHandler?.confirmFeeOption?.(id, options, txs, feeChainId) 
            || options[0]?.token.contractAddress || '';
        }

        setPendingConfirmation({ id, options, chainId: feeChainId });

        // Return promise that resolves when user confirms
        return new Promise<string>((resolve) => {
          confirmationCallbackRef.current = (contractAddress: string) => {
            resolve(contractAddress);
            setPendingConfirmation(null);
            confirmationCallbackRef.current = null;
          };
        });
      },
    };

    return () => {
      if (waasProvider.feeConfirmationHandler) {
        waasProvider.feeConfirmationHandler = originalHandler;
      }
    };
  }, [waasConnector, chainId]);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async ({ transactionFn, selectedFeeOption }) => {
      // Start transaction (triggers handler)
      const transactionPromise = transactionFn();

      // Wait for handler to be called
      await new Promise(resolve => setTimeout(resolve, 100));

      // Auto-confirm the pre-selected option
      if (confirmationCallbackRef.current) {
        confirmationCallbackRef.current(
          selectedFeeOption.token.contractAddress || '0x0000000000000000000000000000000000000000'
        );
      }

      return await transactionPromise;
    },
    onSuccess,
    onError,
  });

  return {
    execute: mutation.mutate,
    isExecuting: mutation.isPending,
    error: mutation.error,
    pendingConfirmation,
  };
}
```

### Usage in Sell Modal

```typescript
// context.ts - SIMPLIFIED VERSION
export function useSellModalContext({ onSuccess } = {}) {
  const state = useSellModalState();
  const config = useConfig();
  const { isWaaS } = useConnectorMetadata();
  const { address } = useAccount();

  // Just one state variable!
  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptionExtended>();

  // Get available fee options (if using React Query approach)
  const feeSelection = useRequiresFeeSelection({
    chainId: state.chainId,
    options: [], // Empty initially, populated when transaction starts
    enabled: isWaaS,
  });

  // Wrap sell mutation with fee handling
  const executeWithFee = useExecuteWithFee({
    chainId: state.chainId,
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  const { approve, sell } = useSellMutations({
    tx: sellSteps.data,
    onSuccess,
    // NO MORE waasFeeConfirmation prop needed!
  });

  // Auto-select fee option when options become available
  useEffect(() => {
    if (executeWithFee.pendingConfirmation?.options) {
      const options = executeWithFee.pendingConfirmation.options;
      const firstWithBalance = options.find(o => o.hasEnoughBalanceForFee);
      setSelectedFeeOption(firstWithBalance || options[0]);
    }
  }, [executeWithFee.pendingConfirmation]);

  // Wrap sell mutation if WaaS
  const wrappedSell = () => {
    if (isWaaS && selectedFeeOption) {
      executeWithFee.execute({
        transactionFn: () => sell.mutate(),
        selectedFeeOption,
      });
    } else {
      sell.mutate();
    }
  };

  // Build steps (no more manual fee step needed!)
  const steps = [];
  
  if (sellSteps.data?.approveStep && !approve.isSuccess) {
    steps.push({
      id: 'approve',
      label: 'Approve Token',
      status: approve.status,
      isPending: approve.isPending,
      isSuccess: approve.isSuccess,
      isError: !!approve.error,
      run: () => approve.mutate(),
    });
  }

  steps.push({
    id: 'sell',
    label: 'Accept Offer',
    status: sell.status,
    isPending: sell.isPending,
    isSuccess: sell.isSuccess,
    isError: !!sell.error,
    run: wrappedSell,
  });

  return { /* ... */ };
}
```

## Benefits of This Approach

### 1. Drastically Simplified State
- **Before**: 3 state variables + 2 complex effects
- **After**: 1 state variable + 1 simple effect

### 2. No More Polling
- Handler intercepts and auto-confirms
- No 1-second polling loop

### 3. Works for Headless Flows
- Fee selection happens automatically during transaction
- No UI state blocking the flow
- Perfect for programmatic use

### 4. Clean API
```typescript
// Old way
const [feeOptions, confirm, reject] = useWaasFeeOptions();
// ... manual state management ...
// ... threading through mutations ...

// New way
const { execute } = useExecuteWithFee({ chainId });
execute({ transactionFn, selectedFeeOption });
```

### 5. Removes ~50 Lines of Code
- No manual polling loop
- No complex state synchronization
- No threading state through mutation chain

## For Truly Proactive Discovery

If we want to discover fee options **before** starting the transaction (for better UX), we have two options:

### Option A: estimateGas Trick
Call `estimateGas()` to trigger the handler without executing the transaction:

```typescript
useEffect(() => {
  if (!transaction) return;

  // Intercept handler
  waasProvider.feeConfirmationHandler = {
    async confirmFeeOption(id, options, txs, chainId) {
      // Capture options but don't resolve (cancel the estimate)
      setFeeOptions({ id, options, chainId });
      return new Promise(() => {}); // Never resolve
    }
  };

  // Trigger handler via estimateGas
  estimateGas(transaction).catch(() => {
    // Expected to fail since we never confirm
  });
}, [transaction]);
```

**Pros**: Works with existing infrastructure  
**Cons**: Hacky, uses gas estimation for discovery

### Option B: Request API Endpoint
Ask Sequence team to add a proper fee estimation endpoint:

```
POST /v1/waas/fee-options
Body: { chainId, transaction }
Response: { options: FeeOption[] }
```

**Pros**: Clean, proper solution  
**Cons**: Requires backend work

## Recommendation

### Immediate: Use Interceptor Pattern (Option B from original docs)

1. Implement `useExecuteWithFee` hook
2. Simplify Sell Modal to use it
3. Remove polling loop from `useProcessStep`
4. Remove manual state management

**Benefits**:
- Works today
- ~50 lines of code removed
- Clean, maintainable solution
- Headless-friendly

### Future: Investigate Proper API

1. Check with Sequence team about fee estimation API
2. If it exists, great! Use it.
3. If it doesn't exist, propose it as feature request
4. When available, enhance `useRequiresFeeSelection` to use it

## Implementation Files

### To Modify
1. `sdk/src/react/ui/modals/SellModal/internal/context.ts` - Simplify state management
2. `sdk/src/react/hooks/transactions/useProcessStep.ts` - Remove polling loop
3. `sdk/src/react/ui/modals/SellModal/internal/sell-mutations.ts` - Remove waasFeeConfirmation param

### To Use
1. `sdk/src/react/hooks/waas/useExecuteWithFee.tsx` - Already created!
2. `sdk/src/react/hooks/waas/useRequiresFeeSelection.tsx` - For balance enhancement (optional)

## Questions Answered

**Q: Is there a JSON-RPC call to get fee options?**  
A: No. The `feeConfirmationHandler` pattern is the only mechanism.

**Q: Can we do this headless?**  
A: Yes! The interceptor pattern auto-confirms the pre-selected option without blocking.

**Q: What about proactive discovery?**  
A: Two options: `estimateGas` trick (works now) or proper API endpoint (future).

**Q: Which approach is cleanest?**  
A: The interceptor pattern (`useExecuteWithFee`) is cleanest for the current architecture.
