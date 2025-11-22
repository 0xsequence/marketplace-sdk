# Unified Hook Proposal: Merge Discovery + Balance Fetching

## The Problem

Currently, fee discovery and balance fetching are (or would be) separated:

```typescript
// AWKWARD: Two separate hooks
const { feeOptions } = useDiscoverFeeOptions({ chainId, transaction });
const { data } = useRequiresFeeSelection({ chainId, options: feeOptions });
```

This is unnecessary complexity! They should be **ONE hook** with two modes.

## Proposed Solution

### Single Hook with Two Modes

```typescript
// Mode 1: Auto-discover from transaction
const { data, isLoading, isDiscovering } = useRequiresFeeSelection({
  chainId: 137,
  transaction: {
    to: '0x...',
    data: '0x...',
    value: 0n,
  },
});

// Mode 2: Use pre-provided options (from API)
const { data, isLoading } = useRequiresFeeSelection({
  chainId: 137,
  options: feeOptionsFromAPI,
});
```

### Hook Behavior

**Mode 1 (Auto-discovery):**
1. Intercept WaaS connector's fee handler
2. Call `estimateGas()` on transaction
3. Capture fee options when connector asks for confirmation
4. Cancel the estimation (we only wanted the options)
5. Fetch balances for discovered options
6. Return enhanced options with balance info

**Mode 2 (Pre-provided):**
1. Skip discovery (options already provided)
2. Fetch balances for provided options
3. Return enhanced options with balance info

### API Design

```typescript
type UseRequiresFeeSelectionArgs =
  | {
      chainId: number;
      transaction: { to: Address; data: Hex; value?: bigint };
      enabled?: boolean;
    }
  | {
      chainId: number;
      options: FeeOption[];
      enabled?: boolean;
    };

function useRequiresFeeSelection(args: UseRequiresFeeSelectionArgs) {
  // Auto-detect mode based on args
  const mode = 'transaction' in args ? 'discover' : 'provided';
  
  // Discovery logic (only in discover mode)
  const discoveredOptions = useDiscovery(
    mode === 'discover' ? args.transaction : null
  );
  
  // Use either discovered or provided options
  const options = mode === 'discover' ? discoveredOptions : args.options;
  
  // Balance fetching (always done)
  const balanceData = useBalances(options);
  
  // Enhancement (always done)
  const enhancedData = useEnhancement(options, balanceData);
  
  return {
    ...enhancedData,
    isDiscovering: mode === 'discover' ? /* ... */ : false,
    discoveryError: mode === 'discover' ? /* ... */ : null,
  };
}
```

### Return Type

```typescript
{
  // Standard React Query properties
  data: {
    isRequired: boolean;
    options: FeeOptionExtended[];
    recommendedOption: FeeOptionExtended | null;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Auto-discovery specific (only populated in Mode 1)
  isDiscovering: boolean;
  discoveryError: Error | null;
}
```

## Benefits

### ✅ Simpler API
One hook instead of two = easier to use and understand.

### ✅ Flexible
Supports both "I have options" and "discover options for me" use cases.

### ✅ Consistent
Same return type regardless of mode - just enhanced options with balances.

### ✅ Future-Proof
When API endpoint for fee estimation is added:
```typescript
// Mode 3: Auto-fetch from API (future)
const { data } = useRequiresFeeSelection({
  chainId: 137,
  transaction: { /* ... */ },
  useAPI: true, // New flag
});
```

## Usage Examples

### Sell Modal (Auto-discovery)

```typescript
function SellModalContext() {
  const sellStep = sellSteps.data?.sellStep;
  
  // Single hook call!
  const feeSelection = useRequiresFeeSelection({
    chainId: state.chainId,
    transaction: sellStep ? {
      to: sellStep.to as Address,
      data: sellStep.data as Hex,
      value: sellStep.value ? BigInt(sellStep.value) : undefined,
    } : undefined,
    enabled: isWaaS && !!sellStep,
  });
  
  // Auto-select recommended option
  const [selected, setSelected] = useState(feeSelection.data?.recommendedOption);
  
  // Create fee selection step
  if (isWaaS && (feeSelection.isDiscovering || feeSelection.data)) {
    steps.push({
      id: 'waas-fee-selection',
      label: 'Select Fee Option',
      status: selected ? 'success' : feeSelection.isDiscovering ? 'pending' : 'idle',
      isPending: feeSelection.isDiscovering,
      isSuccess: !!selected,
      run: () => {},
    });
  }
}
```

### Custom Flow with API (Future)

```typescript
function CustomCheckout() {
  // Fetch from custom API
  const apiQuery = useQuery({
    queryKey: ['my-fee-options', txHash],
    queryFn: () => myBackend.getFeeOptions(txHash),
  });
  
  // Enhance with balances
  const feeSelection = useRequiresFeeSelection({
    chainId: 137,
    options: apiQuery.data?.feeOptions,
    enabled: !!apiQuery.data,
  });
  
  return (
    <div>
      {feeSelection.isLoading ? (
        <Spinner />
      ) : (
        <FeeSelector options={feeSelection.data?.options} />
      )}
    </div>
  );
}
```

## Implementation Plan

### Phase 1: Update Existing Hook
1. Modify `useRequiresFeeSelection.tsx` to support both modes
2. Add discovery logic with `estimateGas` interceptor
3. Make it backward compatible (mode auto-detected from args)

### Phase 2: Update Documentation
1. Update hook JSDoc with both modes
2. Add examples to integration guides
3. Update README.md

### Phase 3: Migrate Usage
1. Update any code using the old signature
2. Add auto-discovery mode to Sell Modal
3. Test thoroughly with WaaS wallets

## Alternative: Keep Separate (Not Recommended)

If we really want to keep them separate:

**Reasons to keep separate:**
- Clearer separation of concerns
- Discovery logic might be reused elsewhere
- Smaller, more focused hooks

**Reasons to merge (better):**
- They're always used together
- Simpler API for consumers
- Less boilerplate
- Discovery is an implementation detail

**Verdict**: Merge them! The unified API is much better.

## Questions?

1. **What about non-WaaS wallets?**
   - Hook checks for WaaS connector, returns early if not found
   - Can still use Mode 2 with pre-provided options

2. **What if estimateGas fails?**
   - Hook catches error and stores in `discoveryError`
   - Consumer can decide to fallback or retry

3. **Performance concerns with estimateGas?**
   - Only called once (results cached)
   - Can be skipped by providing options (Mode 2)
   - Future: Use API endpoint instead (no estimateGas needed)

4. **Why not a separate `useFeeDiscovery` hook?**
   - Discovery without balances is not useful
   - Always need both together
   - Unified hook is simpler

## Recommendation

✅ **Merge `useDiscoverFeeOptions` into `useRequiresFeeSelection`**

This creates a single, powerful hook that:
- Auto-discovers OR accepts pre-provided options
- Fetches balances
- Recommends best option
- Returns everything you need for fee selection UI

Much better developer experience! 🎉
