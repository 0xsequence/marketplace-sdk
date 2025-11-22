# WaaS Fee Selection Integration - Summary

## TL;DR

Your question "Why is this separate from useRequiresFeeSelection?" revealed a key insight:

**We should have ONE unified hook, not two separate hooks!**

## What We Discovered Through This Conversation

### Discovery 1: Fee Options Come at Runtime
Fee options are provided by the WaaS connector when a transaction is attempted, not from the API upfront.

### Discovery 2: Fee Selection Should Be a Step
You correctly identified that we don't need options "at modal open" - we just need them "before transaction execution" as a proper step in the flow.

### Discovery 3: Discovery + Balances Should Be Unified
Instead of having two hooks (`useDiscoverFeeOptions` + `useRequiresFeeSelection`), we should have ONE hook with two modes:
- **Auto-discovery mode**: Provide transaction details
- **Pre-provided mode**: Provide options array

## Recommended Architecture

### Single Unified Hook

```typescript
// Mode 1: Auto-discover from transaction
const feeSelection = useRequiresFeeSelection({
  chainId: 137,
  transaction: { to, data, value },
});

// Mode 2: Use pre-provided options
const feeSelection = useRequiresFeeSelection({
  chainId: 137,
  options: feeOptionsFromAPI,
});
```

**Returns:**
```typescript
{
  data: {
    isRequired: boolean,
    options: FeeOptionExtended[], // With balance info
    recommendedOption: FeeOptionExtended | null,
  },
  isLoading: boolean,
  isDiscovering: boolean, // Only for Mode 1
  // ... standard React Query properties
}
```

### Transaction Execution Hook

```typescript
const { execute } = useExecuteWithFee({
  chainId: 137,
  onSuccess: () => {},
});

execute({
  transactionFn: () => sellMutation.mutateAsync(),
  selectedFeeOption: selectedOption,
});
```

## Integration Approaches

### Approach A: Proactive Discovery (Best UX)

**Step flow:**
```
1. Fee Discovery & Selection
   - Auto-discover options via estimateGas
   - Fetch balances
   - User selects (or auto-select)
   
2. Approval (if needed)
   - Execute with selected fee
   
3. Sell Transaction
   - Execute with selected fee
```

**Code:**
```typescript
const feeSelection = useRequiresFeeSelection({
  chainId,
  transaction: sellStep, // Auto-discover!
});

const [selected, setSelected] = useState(feeSelection.data?.recommendedOption);

const { execute } = useExecuteWithFee({ chainId });

// Create steps
steps.push({
  id: 'fee-selection',
  status: selected ? 'success' : 'pending',
  run: () => {}, // Selection happens via setSelected
});

steps.push({
  id: 'sell',
  run: () => execute({
    transactionFn: () => sell.mutateAsync(),
    selectedFeeOption: selected,
  }),
});
```

### Approach B: Just-in-Time (Simpler)

**Flow:**
```
1. Start transaction
2. Fee options appear during execution
3. User selects
4. Transaction continues
```

**Code:**
```typescript
const { execute, pendingConfirmation } = useExecuteWithFee({ chainId });

// Fee options appear in pendingConfirmation when transaction starts
if (pendingConfirmation) {
  return <FeeSelector options={pendingConfirmation.options} />;
}
```

## Documents Created

1. **`README.md`** - Overview and approach comparison
2. **`SELL_MODAL_INTEGRATION.md`** - Detailed integration guide (Approach B focus)
3. **`PROACTIVE_FEE_DISCOVERY.md`** - Deep dive on Approach A
4. **`UNIFIED_HOOK_PROPOSAL.md`** - Rationale for merging discovery + balances into one hook
5. **`SUMMARY.md`** - This document

## Key Insights & Decisions

### ✅ Unified Hook is Better
Instead of:
```typescript
const { feeOptions } = useDiscoverFeeOptions({ transaction });
const { data } = useRequiresFeeSelection({ options: feeOptions });
```

Do this:
```typescript
const { data } = useRequiresFeeSelection({ transaction }); // Auto-discovers!
```

### ✅ Fee Selection as a Step
The current Sell Modal already has a fee selection step concept, but it can't get options. With auto-discovery, it can be a proper step.

### ✅ Two Approaches for Different Needs
- **Approach A**: Better UX, more complex (auto-discovery with estimateGas)
- **Approach B**: Simpler, works today (just-in-time during transaction)

Both are valid! Choose based on your priorities.

## Implementation Recommendations

### Short Term (Now)
1. **Enhance `useRequiresFeeSelection`** to support auto-discovery mode
   - Add transaction parameter option
   - Add estimateGas interceptor logic
   - Keep backward compatible

2. **Implement Approach B in Sell Modal** (simpler, immediate benefit)
   - Use only `useExecuteWithFee`
   - Remove manual confirmation logic
   - ~50 lines of code removed

### Medium Term (Next Sprint)
1. **Upgrade to Approach A in Sell Modal**
   - Use unified `useRequiresFeeSelection` with auto-discovery
   - Proper step flow
   - Better UX

### Long Term (Future)
1. **Add API endpoint** for fee estimation
2. **Remove estimateGas workaround**
3. **Use API mode** in `useRequiresFeeSelection`:
   ```typescript
   const feeSelection = useRequiresFeeSelection({
     chainId,
     transaction,
     useAPI: true, // New flag
   });
   ```

## Questions Answered

### Q: Why is discovery separate from useRequiresFeeSelection?
**A**: It shouldn't be! They should be one unified hook with two modes. See `UNIFIED_HOOK_PROPOSAL.md`.

### Q: Can we show fee selection as a step before transaction?
**A**: Yes! Use auto-discovery mode with `estimateGas` interceptor (Approach A).

### Q: Do we need fee options upfront at modal open?
**A**: No! We just need them before the transaction executes. Discovery can be a step in the flow.

### Q: Which approach should we use?
**A**: 
- For immediate deployment: **Approach B** (simpler, works today)
- For best UX: **Approach A** (better flow, worth the complexity)
- Long term: **Approach A with API** (clean, no hacks)

## Next Steps

1. **Review this summary** with the team
2. **Choose an approach** based on timeline and priorities
3. **Implement unified hook** (`useRequiresFeeSelection` with auto-discovery)
4. **Integrate into Sell Modal** following the chosen approach
5. **Apply pattern** to other modals (Cancel, Transfer, etc.)

## Files to Review

- **`UNIFIED_HOOK_PROPOSAL.md`** - Why merge discovery + balances (IMPORTANT!)
- **`README.md`** - Approach comparison matrix
- **`SELL_MODAL_INTEGRATION.md`** - Detailed implementation steps

---

**Bottom Line**: You asked the right question! Merging discovery and balance fetching into one hook with two modes is the superior design. 🎯
