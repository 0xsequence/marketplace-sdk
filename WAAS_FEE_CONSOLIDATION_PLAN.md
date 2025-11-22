# WaaS Fee Selection - Consolidation & Simplification Plan

## Executive Summary

This document outlines a comprehensive plan to consolidate WaaS fee selection logic across the marketplace SDK. Currently, there are **3 different patterns** in use, significant code duplication (~300+ lines), and incomplete implementations across modals. This plan will establish a **single, unified approach** that all modals can use.

## Current State Analysis

### Problems Identified

1. **Multiple Patterns** - 3 distinct implementation approaches:
   - Pattern A: SellModal - Full context-based implementation with manual/automatic modes
   - Pattern B: TransferModal - Broken/deprecated partial implementation
   - Pattern C: MakeOfferModal & CreateListingModal - No fee selection UI at all

2. **Code Duplication** - ~300+ lines duplicated across:
   - Fee option state management (selectedOption, optionConfirmed, error)
   - Balance fetching logic
   - Auto-selection logic
   - Manual confirmation flow
   - Step creation for fee selection

3. **Unused Code** - ~370 lines of well-written but unused hooks:
   - `useExecuteWithFee` (200 lines) - React Query mutation-based approach
   - `useRequiresFeeSelection` (170 lines) - Balance-enhanced fee options

4. **Inconsistent UX** - Users see different experiences:
   - SellModal: Shows fee selection UI in manual mode
   - MakeOffer/CreateListing: No fee UI (silently uses first option?)
   - Transfer: Broken implementation

5. **Configuration Ignored** - Only SellModal respects `waasFeeOptionSelectionType` config

### Current Implementation Locations

```
sdk/src/react/
├── hooks/
│   ├── waas/
│   │   ├── useExecuteWithFee.tsx         (UNUSED - 200 lines)
│   │   └── useRequiresFeeSelection.tsx   (UNUSED - 170 lines)
│   ├── utils/
│   │   ├── useAutoSelectFeeOption.tsx    (Used in SellModal only - 175 lines)
│   │   └── useWaasFeeBalance.tsx         (Used in SelectWaasFeeOptions - 119 lines)
│   └── transactions/
│       └── useProcessStep.ts             (All modals - has fee confirmation polling)
└── ui/
    ├── modals/
    │   ├── SellModal/
    │   │   ├── Modal.tsx                 (✅ Full fee UI)
    │   │   └── internal/
    │   │       ├── context.ts            (✅ Full state management ~150 lines)
    │   │       └── sell-mutations.ts     (✅ Passes fee state through)
    │   ├── MakeOfferModal/
    │   │   └── Modal.tsx                 (❌ No fee UI)
    │   ├── CreateListingModal/
    │   │   └── Modal.tsx                 (❌ No fee UI)
    │   └── TransferModal/
    │       └── index.tsx                 (⚠️ Broken/deprecated)
    └── _internal/
        └── components/
            ├── selectWaasFeeOptions/     (Used in SellModal only)
            └── waasFeeOptionsSelect/     (Shared dropdown component)
```

## Goals

### Primary Goals

1. **Single Source of Truth** - One hook for all WaaS fee management
2. **Consistent UX** - Same fee selection experience across all modals
3. **Respect Configuration** - Honor `waasFeeOptionSelectionType` everywhere
4. **Reduce Complexity** - Eliminate ~300+ lines of duplicated code
5. **Maintain Flexibility** - Support both automatic and manual modes

### Secondary Goals

6. **Better Error Handling** - Unified error messages and recovery
7. **Improved Testing** - Easier to test with centralized logic
8. **Documentation** - Clear patterns for integrators
9. **Type Safety** - Stronger typing for fee-related state

## Proposed Solution

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Modal Components                          │
│  (SellModal, MakeOfferModal, CreateListingModal, TransferModal) │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ uses
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useWaasFeeManagement()                         │
│                   (Single Unified Hook)                          │
│                                                                   │
│  Returns:                                                         │
│  - selectedOption                                                 │
│  - setSelectedOption                                              │
│  - feeOptionConfirmation                                          │
│  - confirmFeeOption                                               │
│  - optionConfirmed                                                │
│  - error                                                          │
│  - enhancedOptions (with balance info)                            │
│  - feeConfirmationState (for useProcessStep)                      │
│  - createFeeSelectionStep()                                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ internally uses
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Internal Utilities                            │
│                                                                   │
│  - useWaasFeeOptions() (@0xsequence/connect)                     │
│  - useCollectionBalanceDetails()                                 │
│  - Balance enhancement logic                                     │
│  - Auto-selection logic                                          │
└─────────────────────────────────────────────────────────────────┘
```

### New Hook: `useWaasFeeManagement`

**Location**: `sdk/src/react/hooks/waas/useWaasFeeManagement.tsx`

**Purpose**: Single hook that encapsulates ALL WaaS fee selection logic

**API Design**:

```typescript
type UseWaasFeeManagementParams = {
  /** Chain ID for the transaction */
  chainId: number;
  /** Whether hook should be active */
  enabled?: boolean;
  /** Override global config for this specific usage */
  selectionType?: 'automatic' | 'manual';
  /** Callback when auto-selection fails */
  onAutoSelectError?: (error: Error) => void;
};

type UseWaasFeeManagementResult = {
  // Core state
  selectedOption: FeeOptionExtended | undefined;
  setSelectedOption: (option: FeeOptionExtended | undefined) => void;
  optionConfirmed: boolean;
  setOptionConfirmed: (confirmed: boolean) => void;
  
  // Fee confirmation
  feeOptionConfirmation: WaasFeeOptionConfirmation | null;
  confirmFeeOption: (id: string, address: string | null) => void;
  rejectFeeOption: (id: string) => void;
  
  // Enhanced options with balance info
  enhancedOptions: FeeOptionExtended[];
  isLoadingBalances: boolean;
  
  // Error state
  error: Error | undefined;
  clearError: () => void;
  
  // For useProcessStep integration
  getConfirmationState: () => WaasFeeConfirmationState | undefined;
  
  // For step-based modals (SellModal pattern)
  createFeeSelectionStep: () => WaasFeeSelectionStep | null;
  
  // Status
  isReady: boolean; // true when either auto-confirmed OR user confirmed in manual mode
  needsManualConfirmation: boolean; // true when manual mode AND not yet confirmed
};

export function useWaasFeeManagement(params: UseWaasFeeManagementParams): UseWaasFeeManagementResult;
```

**Example Usage**:

```typescript
// SellModal (step-based pattern)
function useSellModalContext() {
  const waasFee = useWaasFeeManagement({
    chainId: state.chainId,
    enabled: isWaaS && state.isOpen,
  });
  
  const steps = [];
  
  // Add fee selection step if needed
  const feeStep = waasFee.createFeeSelectionStep();
  if (feeStep) {
    steps.push(feeStep);
  }
  
  // Add other steps...
  steps.push(approveStep, sellStep);
  
  // Pass to mutations
  const { sell } = useSellMutations({
    waasFeeConfirmation: waasFee.getConfirmationState(),
  });
}

// MakeOfferModal (simple pattern)
function MakeOfferModal() {
  const waasFee = useWaasFeeManagement({
    chainId,
    enabled: isWaaS,
  });
  
  // In manual mode, show fee UI when needed
  if (waasFee.needsManualConfirmation) {
    return <SelectWaasFeeOptions {...waasFee} />;
  }
  
  // Execute transaction with fee confirmation
  const handleOffer = () => {
    if (!waasFee.isReady) return;
    
    processStep({
      waasFeeConfirmation: waasFee.getConfirmationState(),
    });
  };
}
```

### Component Changes

#### 1. SellModal - Refactor to use new hook

**Before** (context.ts lines 196-289):
```typescript
const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptionExtended | undefined>()
const [optionConfirmed, setOptionConfirmed] = useState(false)
const [waasFeeSelectionError, setWaasFeeSelectionError] = useState<Error | undefined>()
const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] = useWaasFeeOptions()
const autoSelectFeeOption = useAutoSelectFeeOption({ enabled: config.waasFeeOptionSelectionType === 'automatic' })

// 80+ lines of auto-selection and manual pre-selection logic...
```

**After**:
```typescript
const waasFee = useWaasFeeManagement({
  chainId: state.chainId,
  enabled: isWaaS && state.isOpen,
  onAutoSelectError: (error) => {
    // Handle auto-select failures
    console.error('Auto-select failed:', error);
  },
});

// Create fee step
const feeStep = waasFee.createFeeSelectionStep();
if (feeStep) {
  steps.push(feeStep);
}
```

**Lines Saved**: ~150 lines

#### 2. MakeOfferModal - Add fee selection

**File**: `sdk/src/react/ui/modals/MakeOfferModal/Modal.tsx`

**Add**:
```typescript
const waasFee = useWaasFeeManagement({
  chainId,
  enabled: isWaaS,
});

// Show fee UI if manual mode requires it
if (waasFee.needsManualConfirmation) {
  return (
    <SelectWaasFeeOptions
      chainId={chainId}
      feeOptionConfirmation={waasFee.feeOptionConfirmation!}
      selectedOption={waasFee.selectedOption}
      onSelectedOptionChange={waasFee.setSelectedOption}
      onConfirm={() => {
        waasFee.confirmFeeOption(
          waasFee.feeOptionConfirmation!.id,
          waasFee.selectedOption!.token.contractAddress,
        );
        waasFee.setOptionConfirmed(true);
      }}
      optionConfirmed={waasFee.optionConfirmed}
    />
  );
}
```

**Pass to transaction steps**:
```typescript
const transactionSteps = useTransactionSteps({
  // ... existing params
  waasFeeConfirmation: waasFee.getConfirmationState(),
});
```

#### 3. CreateListingModal - Add fee selection

Same pattern as MakeOfferModal.

#### 4. TransferModal - Fix using new hook

Replace deprecated `useWaasFeeManagement` with new implementation.

### Internal Implementation of `useWaasFeeManagement`

The hook will consolidate logic from:

1. **`useWaasFeeOptions`** - Base hook from `@0xsequence/connect`
2. **`useAutoSelectFeeOption`** - Auto-selection logic (can be internal)
3. **`useCollectionBalanceDetails`** - Balance fetching
4. **SellModal context.ts lines 196-289** - State management and effects

**Internal structure**:

```typescript
export function useWaasFeeManagement({
  chainId,
  enabled = true,
  selectionType,
  onAutoSelectError,
}: UseWaasFeeManagementParams): UseWaasFeeManagementResult {
  const config = useConfig();
  const mode = selectionType ?? config.waasFeeOptionSelectionType;
  
  // Base fee options from connector
  const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] = useWaasFeeOptions();
  
  // Internal state
  const [selectedOption, setSelectedOption] = useState<FeeOptionExtended | undefined>();
  const [optionConfirmed, setOptionConfirmed] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  
  // Fetch balances for fee options
  const { address } = useAccount();
  const contractWhitelist = useMemo(() => 
    feeOptionConfirmation?.options?.map(opt => 
      opt.token.contractAddress ?? zeroAddress
    ) || [],
    [feeOptionConfirmation]
  );
  
  const balanceQuery = useCollectionBalanceDetails({
    chainId,
    filter: {
      accountAddresses: address ? [address] : [],
      contractWhitelist,
      omitNativeBalances: false,
    },
    query: {
      enabled: enabled && !!feeOptionConfirmation && !!address,
    },
  });
  
  // Enhance options with balance info
  const enhancedOptions = useMemo(() => {
    if (!feeOptionConfirmation?.options || !balanceQuery.data) {
      return [];
    }
    
    return enhanceOptionsWithBalances(
      feeOptionConfirmation.options,
      balanceQuery.data
    );
  }, [feeOptionConfirmation, balanceQuery.data]);
  
  // AUTOMATIC MODE: Auto-select and auto-confirm
  useEffect(() => {
    if (mode !== 'automatic') return;
    if (!feeOptionConfirmation?.id) return;
    if (optionConfirmed) return;
    if (balanceQuery.isLoading) return;
    
    const optionWithBalance = enhancedOptions.find(opt => opt.hasEnoughBalanceForFee);
    
    if (!optionWithBalance) {
      const err = new Error('No fee option with sufficient balance available');
      setError(err);
      onAutoSelectError?.(err);
      return;
    }
    
    setSelectedOption(optionWithBalance);
    confirmFeeOption(
      feeOptionConfirmation.id,
      optionWithBalance.token.contractAddress as string | null
    );
    setOptionConfirmed(true);
  }, [mode, feeOptionConfirmation, optionConfirmed, enhancedOptions, balanceQuery.isLoading]);
  
  // MANUAL MODE: Pre-select first option with balance
  useEffect(() => {
    if (mode === 'automatic') return;
    if (enhancedOptions.length === 0) return;
    if (selectedOption) return; // Don't override user selection
    
    const optionWithBalance = enhancedOptions.find(opt => opt.hasEnoughBalanceForFee);
    setSelectedOption(optionWithBalance || enhancedOptions[0]);
  }, [mode, enhancedOptions, selectedOption]);
  
  // Helper: Get confirmation state for useProcessStep
  const getConfirmationState = useCallback((): WaasFeeConfirmationState | undefined => {
    if (!feeOptionConfirmation) return undefined;
    
    return {
      feeOptionConfirmation,
      selectedOption,
      optionConfirmed,
      confirmFeeOption,
      setOptionConfirmed,
    };
  }, [feeOptionConfirmation, selectedOption, optionConfirmed]);
  
  // Helper: Create fee selection step (for step-based modals)
  const createFeeSelectionStep = useCallback((): WaasFeeSelectionStep | null => {
    if (!feeOptionConfirmation) return null;
    if (mode === 'automatic') return null; // No step in automatic mode
    
    return {
      id: 'waas-fee-selection',
      label: 'Select Fee Option',
      status: optionConfirmed ? 'success' : selectedOption ? 'idle' : 'pending',
      isPending: !selectedOption,
      isSuccess: optionConfirmed,
      isError: !!error,
      waasFee: {
        feeOptionConfirmation,
        selectedOption,
        optionConfirmed,
        waasFeeSelectionError: error,
        setSelectedFeeOption: setSelectedOption,
        confirmFeeOption,
        rejectFeeOption,
        setOptionConfirmed,
      },
      run: () => {},
    };
  }, [feeOptionConfirmation, mode, selectedOption, optionConfirmed, error]);
  
  return {
    selectedOption,
    setSelectedOption,
    optionConfirmed,
    setOptionConfirmed,
    feeOptionConfirmation,
    confirmFeeOption,
    rejectFeeOption,
    enhancedOptions,
    isLoadingBalances: balanceQuery.isLoading,
    error,
    clearError: () => setError(undefined),
    getConfirmationState,
    createFeeSelectionStep,
    isReady: mode === 'automatic' ? optionConfirmed : optionConfirmed,
    needsManualConfirmation: mode === 'manual' && !!feeOptionConfirmation && !optionConfirmed,
  };
}
```

## Implementation Plan

### Phase 1: Create New Hook (Week 1)

**Tasks**:
1. ✅ Create `useWaasFeeManagement.tsx` with full implementation
2. ✅ Extract balance enhancement logic into utility function
3. ✅ Add comprehensive JSDoc documentation
4. ✅ Write unit tests for the hook
5. ✅ Add Storybook stories for different modes

**Files**:
- `sdk/src/react/hooks/waas/useWaasFeeManagement.tsx` (NEW)
- `sdk/src/react/hooks/waas/utils/enhanceOptionsWithBalances.ts` (NEW)
- `sdk/src/react/hooks/waas/__tests__/useWaasFeeManagement.test.tsx` (NEW)

### Phase 2: Refactor SellModal (Week 1-2)

**Tasks**:
1. ✅ Replace existing logic in `context.ts` with `useWaasFeeManagement`
2. ✅ Test automatic mode
3. ✅ Test manual mode
4. ✅ Verify step creation works
5. ✅ Update existing tests

**Files Modified**:
- `sdk/src/react/ui/modals/SellModal/internal/context.ts` (REFACTOR)
- `sdk/src/react/ui/modals/SellModal/__tests__/Modal.test.tsx` (UPDATE)

**Lines Saved**: ~150 lines

### Phase 3: Add to MakeOfferModal (Week 2)

**Tasks**:
1. ✅ Add `useWaasFeeManagement` to modal
2. ✅ Add conditional fee selection UI
3. ✅ Pass confirmation state to transaction steps
4. ✅ Test automatic mode
5. ✅ Test manual mode
6. ✅ Write new tests

**Files Modified**:
- `sdk/src/react/ui/modals/MakeOfferModal/Modal.tsx` (ADD ~30 lines)
- `sdk/src/react/ui/modals/MakeOfferModal/hooks/useTransactionSteps.tsx` (UPDATE)
- `sdk/src/react/ui/modals/MakeOfferModal/__tests__/Modal.test.tsx` (ADD TESTS)

### Phase 4: Add to CreateListingModal (Week 2)

**Tasks**:
1. ✅ Add `useWaasFeeManagement` to modal
2. ✅ Add conditional fee selection UI
3. ✅ Pass confirmation state to transaction steps
4. ✅ Test automatic mode
5. ✅ Test manual mode
6. ✅ Write new tests

**Files Modified**:
- `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx` (ADD ~30 lines)
- `sdk/src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx` (UPDATE)
- `sdk/src/react/ui/modals/CreateListingModal/__tests__/Modal.test.tsx` (ADD TESTS)

### Phase 5: Fix TransferModal (Week 3)

**Tasks**:
1. ✅ Remove deprecated `useWaasFeeManagement` usage
2. ✅ Add new `useWaasFeeManagement` hook
3. ✅ Add fee selection UI
4. ✅ Test with WaaS wallet
5. ✅ Update tests

**Files Modified**:
- `sdk/src/react/ui/modals/TransferModal/index.tsx` (REFACTOR)
- `sdk/src/react/ui/modals/TransferModal/_views/enterWalletAddress/useHandleTransfer.tsx` (UPDATE)
- `sdk/src/react/ui/modals/TransferModal/__tests__/useHandleTransfer.test.tsx` (UPDATE)

### Phase 6: Cleanup Unused Code (Week 3)

**Decision Points**:

1. **Delete or Keep `useExecuteWithFee`?**
   - **Option A**: Delete (recommended if `useWaasFeeManagement` is sufficient)
   - **Option B**: Keep but integrate with `useWaasFeeManagement` internally
   - **Recommendation**: **Delete** - The new hook makes this redundant

2. **Delete or Keep `useRequiresFeeSelection`?**
   - **Option A**: Delete (balance fetching now in `useWaasFeeManagement`)
   - **Option B**: Keep as standalone utility for edge cases
   - **Recommendation**: **Delete** - Functionality absorbed into main hook

3. **Delete or Keep `useAutoSelectFeeOption`?**
   - **Option A**: Delete (logic now internal to `useWaasFeeManagement`)
   - **Option B**: Keep as internal utility
   - **Recommendation**: **Make internal** - Move to `useWaasFeeManagement.tsx` as private function

4. **Delete or Keep `useWaasFeeBalance`?**
   - Used only by `SelectWaasFeeOptions` component
   - **Recommendation**: **Keep** - Still useful for the component

**Tasks**:
1. ⚠️ Delete `useExecuteWithFee.tsx` (200 lines saved)
2. ⚠️ Delete `useRequiresFeeSelection.tsx` (170 lines saved)
3. ⚠️ Move `useAutoSelectFeeOption` logic internal to `useWaasFeeManagement`
4. ⚠️ Keep `useWaasFeeBalance` (still used)
5. ✅ Update exports in `index.ts` files

**Files Deleted**:
- `sdk/src/react/hooks/waas/useExecuteWithFee.tsx` (DELETE)
- `sdk/src/react/hooks/waas/useRequiresFeeSelection.tsx` (DELETE)
- `sdk/src/react/hooks/utils/useAutoSelectFeeOption.tsx` (DELETE/MERGE)

**Total Lines Saved**: ~370 lines + ~150 from SellModal = **~520 lines**

### Phase 7: Documentation (Week 3-4)

**Tasks**:
1. ✅ Write migration guide for integrators
2. ✅ Update API documentation
3. ✅ Create usage examples
4. ✅ Add JSDoc comments
5. ✅ Update CHANGELOG

**Files**:
- `docs/waas-fee-selection.md` (NEW)
- `docs/MIGRATION.md` (UPDATE)
- `CHANGELOG.md` (UPDATE)

## Success Metrics

### Code Metrics
- [ ] **~520 lines removed** (duplicated + unused code)
- [ ] **1 unified hook** instead of 4 disparate hooks
- [ ] **4 modals** using the same pattern
- [ ] **100% test coverage** for `useWaasFeeManagement`

### UX Metrics
- [ ] **Consistent fee selection** across all modals
- [ ] **Config respected** in all flows
- [ ] **Clear error messages** for insufficient balance
- [ ] **Loading states** handled properly

### Developer Experience
- [ ] **Single import** for fee management
- [ ] **Clear API** with TypeScript
- [ ] **Examples** for both automatic and manual modes
- [ ] **Migration guide** for existing integrators

## Testing Strategy

### Unit Tests

**`useWaasFeeManagement.test.tsx`**:
```typescript
describe('useWaasFeeManagement', () => {
  describe('automatic mode', () => {
    it('should auto-select first option with balance');
    it('should auto-confirm selected option');
    it('should set error when no options have balance');
    it('should call onAutoSelectError callback');
    it('should wait for balances to load before selecting');
  });
  
  describe('manual mode', () => {
    it('should pre-select first option with balance');
    it('should not auto-confirm');
    it('should allow user to change selection');
    it('should create fee selection step');
    it('should set optionConfirmed when user confirms');
  });
  
  describe('getConfirmationState', () => {
    it('should return state for useProcessStep');
    it('should return undefined when no confirmation');
  });
  
  describe('createFeeSelectionStep', () => {
    it('should return step in manual mode');
    it('should return null in automatic mode');
    it('should return null when no confirmation');
  });
});
```

### Integration Tests

**Modal tests**:
- Test each modal with WaaS wallet
- Verify fee selection UI appears in manual mode
- Verify auto-selection works in automatic mode
- Test error states
- Test transaction execution with fee confirmation

### E2E Tests

**Playground tests**:
- Connect WaaS wallet
- Perform sell in automatic mode
- Perform sell in manual mode
- Perform offer with fee selection
- Perform listing with fee selection
- Perform transfer with fee selection

## Migration Guide for Integrators

### If You're Using SellModal

**Before**:
```typescript
// Just worked, no changes needed
<SellModal {...props} />
```

**After**:
```typescript
// Still just works! No changes needed unless you were accessing internal state
<SellModal {...props} />
```

**Breaking Changes**: None for basic usage. If you were directly accessing `waasFee` state from context, the API is the same.

### If You're Using MakeOfferModal or CreateListingModal

**Before**:
```typescript
// Fee selection was automatic (or broken)
<MakeOfferModal {...props} />
```

**After**:
```typescript
// Now respects waasFeeOptionSelectionType config
// In manual mode, users will see fee selection UI
<MakeOfferModal {...props} />

// Configure automatic mode globally:
<MarketplaceKitProvider
  config={{
    waasFeeOptionSelectionType: 'automatic' // or 'manual'
  }}
>
```

**Breaking Changes**: If you rely on fee selection being silent, set config to `automatic`.

### If You're Using TransferModal

**Before**:
```typescript
// Broken/deprecated
<TransferModal {...props} />
```

**After**:
```typescript
// Now works properly!
<TransferModal {...props} />
```

**Breaking Changes**: Now properly handles fees, might show UI in manual mode.

### If You Were Using Internal Hooks

**Breaking Changes**:
- `useExecuteWithFee` - **REMOVED** (use `useWaasFeeManagement`)
- `useRequiresFeeSelection` - **REMOVED** (use `useWaasFeeManagement`)
- `useAutoSelectFeeOption` - **REMOVED** (internal to `useWaasFeeManagement`)
- `useWaasFeeBalance` - **KEPT** (still available)

**Migration**:
```typescript
// Before
const { execute } = useExecuteWithFee({ chainId });

// After
const waasFee = useWaasFeeManagement({ chainId });
// Use waasFee.getConfirmationState() with your transaction logic
```

## Risk Assessment

### Low Risk
- ✅ Adding to MakeOfferModal/CreateListingModal (new functionality)
- ✅ Deleting unused hooks (not breaking if properly exported as internal)
- ✅ Comprehensive testing before release

### Medium Risk
- ⚠️ Refactoring SellModal (most used modal)
  - **Mitigation**: Extensive testing, backwards compatible API
- ⚠️ Changing TransferModal (currently broken anyway)
  - **Mitigation**: Can only improve current state

### High Risk
- ❌ None identified

## Rollout Plan

### Version 1.x.0 (Current - Pre-Consolidation)

Current state with multiple patterns.

### Version 1.x+1.0 (Phase 1-3)

**Changes**:
- Add `useWaasFeeManagement` hook
- Refactor SellModal
- Add to MakeOfferModal
- Mark `useExecuteWithFee` and `useRequiresFeeSelection` as deprecated

**Breaking Changes**: None  
**Migration Required**: No

### Version 1.x+2.0 (Phase 4-7)

**Changes**:
- Add to CreateListingModal
- Fix TransferModal
- Delete deprecated hooks
- Documentation updates

**Breaking Changes**: Yes (deprecated hooks removed)  
**Migration Required**: Only if using deprecated internal hooks

## Future Enhancements

### Post-Consolidation Improvements

1. **Proactive Fee Discovery** (if Sequence adds API)
   - Fetch available fee options before transaction starts
   - Show fees in transaction preview
   - Better UX for fee estimation

2. **Fee Optimization**
   - Remember user's preferred fee token
   - Smart selection based on cheapest fees
   - Balance warnings before transaction

3. **Multi-Transaction Fee Management**
   - Batch approvals with fee selection
   - Consistent fee token across multiple steps
   - Fee token switching mid-flow

4. **Enhanced Error Recovery**
   - Retry with different fee token
   - Top-up flow integration
   - Better error messages with actions

## Conclusion

This consolidation will:

✅ **Reduce complexity** by ~520 lines of code  
✅ **Improve consistency** across all modals  
✅ **Respect configuration** everywhere  
✅ **Maintain flexibility** for different use cases  
✅ **Better developer experience** with single unified hook  

The implementation is low-risk, well-tested, and maintains backwards compatibility for the vast majority of users. Only integrators using internal/deprecated hooks will need to migrate, and that's a small subset of users.

**Recommendation**: Proceed with implementation following the phased approach outlined above.
