# WaaS Fee Selection Hooks - Integration Guide

## Overview

This directory contains new React Query-based hooks for WaaS fee selection:

- **`useRequiresFeeSelection.tsx`** - Discovers fee options (or accepts pre-provided), fetches balances, recommends best option
- **`useExecuteWithFee.tsx`** - Executes transactions with automatic fee confirmation
- **`UNIFIED_HOOK_PROPOSAL.md`** - Proposal to enhance `useRequiresFeeSelection` with auto-discovery mode

### Design Note

Originally, we considered separate hooks for discovery vs. balance fetching. However, **they should be one unified hook** with two modes:
- **Mode 1**: Auto-discover from transaction (uses `estimateGas` interceptor)
- **Mode 2**: Accept pre-provided options (from API or elsewhere)

See `UNIFIED_HOOK_PROPOSAL.md` for detailed rationale.

## Integration Approaches

### The Core Question

**When should fee selection happen?**

1. **As a Step** (before transaction) - Better UX, proper flow
2. **Just-in-Time** (during transaction) - Simpler, works today

### Approach A: Fee Selection as a Proper Step 🌟

**Use case**: When you want fee selection to be a visible step in a multi-step flow.

**Flow:**
```
1. Discover fee options (estimateGas)
2. Show fee selection step
3. Execute approval (if needed) with selected fee
4. Execute transaction with selected fee
```

**Hooks used:**
- `useDiscoverFeeOptions` - Trigger fee discovery before transaction
- `useRequiresFeeSelection` - Enhance options with balances, get recommendation
- `useExecuteWithFee` - Execute with selected option

**Example:**
```typescript
function SellModal() {
  // 1. Discover options proactively
  const { feeOptions } = useDiscoverFeeOptions({
    chainId,
    transaction: sellStep,
    enabled: isWaaS && !!sellStep,
  });

  // 2. Enhance with balances
  const feeSelection = useRequiresFeeSelection({
    chainId,
    options: feeOptions,
  });

  // 3. User selects option
  const [selected, setSelected] = useState(feeSelection.data?.recommendedOption);

  // 4. Execute with selected option
  const { execute } = useExecuteWithFee({ chainId });

  const handleSell = () => {
    execute({
      transactionFn: () => sellMutation.mutateAsync(),
      selectedFeeOption: selected,
    });
  };
}
```

**Benefits:**
- ✅ Clear step-by-step flow
- ✅ User sees all steps upfront
- ✅ Can warn about insufficient balance before transaction
- ✅ Better accessibility (clear progress)

**Trade-offs:**
- Requires `useDiscoverFeeOptions` hook (uses estimateGas workaround)
- More complex state management
- OR requires backend API endpoint for fee estimation

### Approach B: Just-in-Time Fee Selection ⚡

**Use case**: When you want simpler implementation and can accept fee selection during transaction.

**Flow:**
```
1. Start transaction
2. WaaS connector requests fee selection (intercepted)
3. Show fee UI
4. User selects
5. Transaction continues
```

**Hooks used:**
- `useExecuteWithFee` only

**Example:**
```typescript
function TransferModal() {
  const { execute, pendingConfirmation } = useExecuteWithFee({ chainId });
  const [selected, setSelected] = useState();

  // Fee options appear in pendingConfirmation when transaction starts
  useEffect(() => {
    if (pendingConfirmation?.options[0]) {
      setSelected(pendingConfirmation.options[0]);
    }
  }, [pendingConfirmation]);

  const handleTransfer = () => {
    execute({
      transactionFn: () => transferMutation.mutateAsync(),
      selectedFeeOption: selected,
    });
  };

  // Show fee UI when pendingConfirmation exists
  if (pendingConfirmation) {
    return <FeeSelectionUI options={pendingConfirmation.options} />;
  }
}
```

**Benefits:**
- ✅ Simpler implementation
- ✅ Works today (no backend changes)
- ✅ One hook instead of three

**Trade-offs:**
- Fee selection interrupts transaction flow
- Cannot pre-validate balances
- Less predictable UX

## Detailed Integration Guides

- **[SELL_MODAL_INTEGRATION.md](./SELL_MODAL_INTEGRATION.md)** - Full guide for Sell Modal integration (both approaches)
- **[PROACTIVE_FEE_DISCOVERY.md](./PROACTIVE_FEE_DISCOVERY.md)** - Details on Approach A and `useDiscoverFeeOptions` hook

## Comparison Matrix

| Feature | Approach A: Proactive | Approach B: Just-in-Time |
|---------|----------------------|--------------------------|
| **UX** | ⭐⭐⭐⭐⭐ Clear steps | ⭐⭐⭐ Interrupts flow |
| **Complexity** | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Simple |
| **Balance warnings** | ✅ Before transaction | ❌ During transaction |
| **Backend changes** | ⚠️ Needs estimateGas hack or API | ✅ None needed |
| **Hooks used** | 3 hooks | 1 hook |
| **Auto-selection** | ✅ Via `recommendedOption` | ⚠️ Needs custom logic |
| **Accessibility** | ✅ Clear progress | ⚠️ Less clear |

## Recommendation

### For New Implementations
**Use Approach A (Proactive)** - Better UX is worth the complexity.

1. Start with `estimateGas` workaround (create `useDiscoverFeeOptions`)
2. Later: Work with backend team to add proper fee estimation API
3. Update hook to use API instead of estimateGas

### For Existing Code
**Start with Approach B (Just-in-Time)** - Get immediate benefits with less risk.

1. Replace `useWaasFeeOptions` with `useExecuteWithFee`
2. Remove manual confirmation logic
3. Later: Upgrade to Approach A when ready

## Next Steps

1. **Sell Modal**: Choose approach and follow integration guide
2. **Create `useDiscoverFeeOptions`**: If choosing Approach A
3. **Apply pattern**: To CancelOrder, Transfer, and other modals
4. **API endpoint**: Coordinate with backend team for proper fee estimation

## Questions?

- Check [SELL_MODAL_INTEGRATION.md](./SELL_MODAL_INTEGRATION.md) for detailed steps
- Check [PROACTIVE_FEE_DISCOVERY.md](./PROACTIVE_FEE_DISCOVERY.md) for Approach A details
- Review existing hooks for implementation examples
