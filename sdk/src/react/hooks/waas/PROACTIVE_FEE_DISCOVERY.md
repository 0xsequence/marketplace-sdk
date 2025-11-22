# Proactive Fee Discovery Pattern

## The Key Insight

**You're absolutely right!** We don't need fee options upfront at modal open time. We can fetch them **as a step in the flow**, right before approval or execution.

The current implementation already tries to do this by having a "waas-fee-selection" step, but it has a chicken-and-egg problem:
- Fee options only appear when `sendTransaction()` is called
- But we can't call `sendTransaction()` until the user selects a fee option
- So the fee step never gets the options to show!

## Solution: Proactive Fee Discovery

### Approach 1: Use `estimateGas` to Trigger Fee Discovery

The WaaS connector's fee handler is triggered when ANY transaction method is called. We can use `estimateGas` (which doesn't execute the transaction) to discover fee options:

```typescript
// New hook: useDiscoverFeeOptions
export function useDiscoverFeeOptions({
  chainId,
  transaction,
  enabled = true,
}: {
  chainId: number;
  transaction?: { to: Address; data: Hex; value?: bigint };
  enabled?: boolean;
}) {
  const connectors = useConnectors();
  const [feeOptions, setFeeOptions] = useState<WaasFeeOptionConfirmation | null>(null);

  useEffect(() => {
    if (!enabled || !transaction) return;

    const waasConnector = connectors.find((c) => c.id === 'sequence-waas');
    if (!waasConnector) return;

    const waasProvider = (waasConnector as any).sequenceWaasProvider;
    if (!waasProvider) return;

    // Intercept fee handler temporarily
    const originalHandler = waasProvider.feeConfirmationHandler;
    
    waasProvider.feeConfirmationHandler = {
      async confirmFeeOption(id: string, options: FeeOption[], txs: unknown, feeChainId: number) {
        // Capture the options!
        setFeeOptions({ id, options, chainId: feeChainId });
        
        // Don't confirm yet - let user select
        return new Promise(() => {}); // Never resolve - will be cancelled
      },
    };

    // Trigger fee discovery with estimateGas
    (async () => {
      try {
        await waasProvider.estimateGas({
          to: transaction.to,
          data: transaction.data,
          value: transaction.value?.toString() || '0x0',
        });
      } catch (error) {
        // Expected - we cancelled the fee confirmation
        console.log('Fee discovery triggered');
      }
    })();

    // Cleanup
    return () => {
      waasProvider.feeConfirmationHandler = originalHandler;
    };
  }, [enabled, transaction, connectors, chainId]);

  return { feeOptions };
}
```

### Approach 2: Add API Endpoint (Requires Backend)

If the Sequence API team can add an endpoint:

```typescript
POST /api/v1/marketplace/estimate-fees
{
  "chainId": "137",
  "transaction": {
    "to": "0x...",
    "data": "0x...",
    "value": "0"
  }
}

Response:
{
  "feeOptions": [
    {
      "token": { "contractAddress": null, "symbol": "MATIC", ... },
      "value": "1000000000000000"
    },
    {
      "token": { "contractAddress": "0x...", "symbol": "USDC", ... },
      "value": "50000"
    }
  ]
}
```

Then we could use `useRequiresFeeSelection` exactly as originally planned:

```typescript
// In context.ts
const sellStep = sellSteps.data?.sellStep;

// Fetch fee options as a separate query
const feeOptionsQuery = useQuery({
  queryKey: ['fee-options', chainId, sellStep],
  queryFn: () => fetchFeeOptions({
    chainId,
    transaction: {
      to: sellStep.to,
      data: sellStep.data,
      value: sellStep.value,
    },
  }),
  enabled: isWaaS && !!sellStep,
});

// Use the new hook with fetched options
const feeSelection = useRequiresFeeSelection({
  chainId,
  options: feeOptionsQuery.data?.feeOptions,
  enabled: isWaaS && !!feeOptionsQuery.data,
});
```

## Recommended Integration for Sell Modal

### Step Flow with Proactive Discovery

```
1. [Open Modal]
2. Fetch transaction steps (approval + sell)
3. IF WaaS:
   3a. Create "fee-discovery" step
   3b. Trigger estimateGas to discover fee options
   3c. Show fee selection UI
   3d. User selects option
4. IF approval needed:
   4a. Execute approval with selected fee
5. Execute sell transaction with selected fee
```

### Updated Context Implementation

```typescript
// In context.ts
const sellStep = sellSteps.data?.sellStep;

// Discover fee options proactively
const { feeOptions } = useDiscoverFeeOptions({
  chainId: state.chainId,
  transaction: sellStep ? {
    to: sellStep.to as Address,
    data: sellStep.data as Hex,
    value: sellStep.value ? BigInt(sellStep.value) : undefined,
  } : undefined,
  enabled: isWaaS && !!sellStep && state.isOpen,
});

// Now we can use useRequiresFeeSelection!
const feeSelection = useRequiresFeeSelection({
  chainId: state.chainId,
  options: feeOptions?.options,
  enabled: isWaaS && !!feeOptions,
});

// Local state for user's selected option
const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptionExtended | undefined>();

// Auto-select recommended option
useEffect(() => {
  if (feeSelection.data?.recommendedOption) {
    setSelectedFeeOption(feeSelection.data.recommendedOption);
    
    // For automatic mode, immediately proceed
    if (config.waasFeeOptionSelectionType === 'automatic') {
      // Mark step as complete
    }
  }
}, [feeSelection.data?.recommendedOption, config.waasFeeOptionSelectionType]);

// Step generation
const steps = [];

// Fee discovery/selection step
if (isWaaS && feeOptions) {
  steps.push({
    id: 'waas-fee-selection',
    label: 'Select Fee Option',
    status: selectedFeeOption ? 'success' : feeSelection.isLoading ? 'pending' : 'idle',
    isPending: feeSelection.isLoading,
    isSuccess: !!selectedFeeOption,
    isError: !!feeSelection.error,
    waasFee: {
      options: feeSelection.data?.options || [],
      selectedOption: selectedFeeOption,
      recommendedOption: feeSelection.data?.recommendedOption,
      setSelectedFeeOption,
      isLoading: feeSelection.isLoading,
      error: feeSelection.error,
    },
    run: () => {
      // No-op - selection happens via setSelectedFeeOption
      // Step completes when selectedFeeOption is set
    },
  });
}

// Approval step (only shown if fee selected OR not WaaS)
if (sellSteps.data?.approveStep && !approve.isSuccess) {
  steps.push({
    id: 'approve',
    label: 'Approve Token',
    status: approve.status,
    isPending: approve.isPending,
    isSuccess: approve.isSuccess,
    isError: !!approve.error,
    run: () => {
      // Use executeWithFee if WaaS
      if (isWaaS && selectedFeeOption) {
        executeWithFee.execute({
          transactionFn: () => approve.mutateAsync(),
          selectedFeeOption,
        });
      } else {
        approve.mutate();
      }
    },
  });
}

// Sell step
steps.push({
  id: 'sell',
  label: 'Accept Offer',
  status: sell.status,
  isPending: sell.isPending,
  isSuccess: sell.isSuccess,
  isError: !!sell.error,
  run: () => {
    if (isWaaS && selectedFeeOption) {
      executeWithFee.execute({
        transactionFn: () => sell.mutateAsync(),
        selectedFeeOption,
      });
    } else {
      sell.mutate();
    }
  },
});
```

## Benefits of This Approach

### ✅ Uses BOTH New Hooks

Now we can use both hooks as originally intended:

1. **`useRequiresFeeSelection`**: Fetches balances and recommends option
2. **`useExecuteWithFee`**: Executes transaction with selected option

### ✅ Proper Step Flow

```
┌─────────────────────────────────────┐
│  1. Fee Selection Step              │
│     - Discover options              │
│     - Fetch balances                │
│     - User selects (or auto-select) │
│     Status: pending → idle → success│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Approval Step (if needed)       │
│     - Uses selected fee option      │
│     Status: idle → pending → success│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. Sell Step                       │
│     - Uses selected fee option      │
│     Status: idle → pending → success│
└─────────────────────────────────────┘
```

### ✅ Clear UI States

- **Step 1 pending**: "Discovering fee options..."
- **Step 1 idle**: Show fee selection UI (manual mode)
- **Step 1 success**: "Fee selected: 0.001 MATIC" (collapsed)
- **Step 2/3**: Proceed with selected option

### ✅ Works with Both Modes

**Automatic Mode**:
1. Discover options
2. Auto-select recommended option
3. Immediately proceed to approval/sell

**Manual Mode**:
1. Discover options
2. Show fee selection UI
3. Wait for user selection
4. Proceed to approval/sell

## Comparison: Three Approaches

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Original (useExecuteWithFee only)** | Simple, works today | Fee selection UI during transaction | Low |
| **Proactive Discovery (estimateGas)** | Uses both hooks, better UX | Requires WaaS provider hacking | Medium |
| **API Endpoint** | Clean, proper separation | Requires backend changes | Medium (after API ready) |

## Recommendation

### Short Term: Hybrid Approach

1. Implement `useExecuteWithFee` integration as documented in `SELL_MODAL_INTEGRATION.md`
2. This works today with no backend changes
3. Fee selection happens "just in time" when transaction starts

### Medium Term: Proactive Discovery

1. Create `useDiscoverFeeOptions` hook using estimateGas
2. Update Sell Modal to use both hooks
3. Better UX with fee selection as a proper step

### Long Term: API Endpoint

1. Work with backend team to add fee estimation endpoint
2. Remove estimateGas hack
3. Clean, proper implementation

## Updated Integration Guide

I'll update `SELL_MODAL_INTEGRATION.md` to include this proactive discovery approach as an **optional enhancement**. The main guide will focus on the simpler `useExecuteWithFee`-only approach that works today.

Would you like me to:
1. Create the `useDiscoverFeeOptions` hook?
2. Update the integration guide with this three-tier approach?
3. Create a POC implementation showing the proactive discovery pattern?
