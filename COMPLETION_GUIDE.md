# WaaS Fee Consolidation - Completion Guide

## Current Status: 75% Complete

### ✅ Completed
1. Created `useWaasFeeManagement` unified hook
2. Refactored SellModal (~150 lines saved)
3. Added fee selection to MakeOfferModal
4. Partially completed CreateListingModal

### 🚧 To Complete

## Step 1: Finish CreateListingModal (15 minutes)

### A. Update `useTransactionSteps.tsx`

**File**: `sdk/src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx`

**Line 1**: Add import
```typescript
import type { WaasFeeConfirmationState } from '../../../../../types/waas-types';
```

**Find interface** `UseTransactionStepsArgs` and add:
```typescript
interface UseTransactionStepsArgs {
  // ... existing fields
  waasFeeConfirmation?: WaasFeeConfirmationState;
}
```

**Update function signature** to destructure it:
```typescript
export const useTransactionSteps = ({
  // ... existing params
  waasFeeConfirmation,
}: UseTransactionStepsArgs) => {
```

**Find all `processStep` calls** (should be 2) and update them:
```typescript
// OLD:
const result = await processStep(approvalStep, chainId);

// NEW:
const result = await processStep({
  step: approvalStep,
  chainId,
  waasFeeConfirmation,
});
```

### B. Update Modal.tsx

**File**: `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx`

**Find `useCreateListing` call** and add parameter:
```typescript
const {
  isLoading,
  executeApproval,
  createListing,
  tokenApprovalIsLoading,
  error: createListingError,
} = useCreateListing({
  // ... existing params
  waasFeeConfirmation: isWaaS ? waasFee.getConfirmationState() : undefined,  // ADD THIS LINE
});
```

**Find the modal content render** (around line 233) and replace `{({ collection, collectible, collectibleBalance }) => (` with:
```typescript
{({ collection, collectible, collectibleBalance }) => {
  // Show fee selection UI if manual confirmation needed
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
            waasFee.selectedOption!.token.contractAddress as string | null,
          );
          waasFee.setOptionConfirmed(true);
        }}
        optionConfirmed={waasFee.optionConfirmed}
      />
    );
  }

  return (
    <>
      {/* EXISTING CONTENT STAYS HERE */}
    </>
  );
}}
```

**Find `primaryAction` definition** (around line 161) and add fee check:
```typescript
const primaryAction = {
  label: 'List item for sale',
  actionName: 'listing',
  onClick: handleCreateListing,
  loading:
    steps$?.transaction.isExecuting.get() ||
    createListingModal$.listingIsBeingProcessed.get(),
  testid: 'create-listing-submit-button',
  disabled:
    steps$.approval.exist.get() ||
    tokenApprovalIsLoading ||
    listingPrice.amountRaw === '0' ||
    createListingModal$.invalidQuantity.get() ||
    isLoading ||
    listingIsBeingProcessed ||
    (isWaaS && !waasFee.isReady),  // ADD THIS LINE
};
```

## Step 2: Fix TransferModal (10 minutes)

**File**: `sdk/src/react/ui/modals/TransferModal/index.tsx`

**Find deprecated `useWaasFeeManagement` usage** (around line 69-85) and **DELETE** the commented-out code.

**Add the new hook** (add after other hooks):
```typescript
import { useWaasFeeManagement } from '../../hooks';

// In the component:
const waasFee = useWaasFeeManagement({
  chainId,
  enabled: isWaaS,
  onAutoSelectError: (error) => {
    console.error('[WaaS Fee] Auto-selection failed:', error);
  },
});
```

**Add conditional UI** in the render (before the existing form):
```typescript
// Show fee selection UI if manual confirmation needed
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
          waasFee.selectedOption!.token.contractAddress as string | null,
        );
        waasFee.setOptionConfirmed(true);
      }}
      optionConfirmed={waasFee.optionConfirmed}
    />
  );
}
```

**Add import** at top:
```typescript
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
```

## Step 3: Delete Unused Hooks (5 minutes)

**Delete these files**:
```bash
cd sdk/src/react/hooks
rm waas/useExecuteWithFee.tsx
rm waas/useRequiresFeeSelection.tsx
rm utils/useAutoSelectFeeOption.tsx
```

**Total lines deleted**: ~545 lines

## Step 4: Verify & Test (15 minutes)

### A. TypeScript Check
```bash
cd sdk
pnpm exec tsc --noEmit
```

Should only show pre-existing errors (design system variant type mismatches).

### B. Manual Test Checklist

#### SellModal
- [ ] Automatic mode: Fee auto-selected and transaction works
- [ ] Manual mode: Fee selection UI shows
- [ ] Manual mode: Can select different fee option
- [ ] Manual mode: Button disabled until fee confirmed
- [ ] Error when no balance for any fee option

#### MakeOfferModal
- [ ] Automatic mode: Fee auto-selected
- [ ] Manual mode: Fee selection UI shows
- [ ] Transaction executes with correct fee

#### CreateListingModal
- [ ] Automatic mode: Fee auto-selected
- [ ] Manual mode: Fee selection UI shows
- [ ] Transaction executes with correct fee

#### TransferModal  
- [ ] Automatic mode: Fee auto-selected
- [ ] Manual mode: Fee selection UI shows
- [ ] Transfer executes with correct fee

### C. Config Test
```typescript
// In playground, test both modes:
<MarketplaceKitProvider
  config={{
    waasFeeOptionSelectionType: 'automatic'  // Test this
    // waasFeeOptionSelectionType: 'manual'  // Then this
  }}
>
```

## Step 5: Final Cleanup (10 minutes)

### Update CHANGELOG.md
```markdown
## [Unreleased]

### Changed
- **BREAKING**: Consolidated WaaS fee selection into single `useWaasFeeManagement` hook
- Removed deprecated hooks: `useExecuteWithFee`, `useRequiresFeeSelection`, `useAutoSelectFeeOption`
- All transaction modals now consistently respect `waasFeeOptionSelectionType` config
- Improved WaaS fee selection UX across SellModal, MakeOfferModal, CreateListingModal, and TransferModal

### Fixed
- TransferModal now properly handles WaaS fee selection
- MakeOfferModal and CreateListingModal now show fee selection UI in manual mode

### Removed
- `useExecuteWithFee` - Use `useWaasFeeManagement` instead
- `useRequiresFeeSelection` - Use `useWaasFeeManagement` instead  
- `useAutoSelectFeeOption` - Internal to `useWaasFeeManagement`

### Migration Guide
If you were using internal hooks (rare), replace with:
\`\`\`typescript
// Before
const { execute } = useExecuteWithFee({ chainId });

// After
const waasFee = useWaasFeeManagement({ chainId, enabled: isWaaS });
// Use waasFee.getConfirmationState() with your transaction logic
\`\`\`
```

## Summary

**Estimated Total Time**: ~55 minutes

**Files to Modify**: 4
1. CreateListingModal/hooks/useTransactionSteps.tsx
2. CreateListingModal/Modal.tsx
3. TransferModal/index.tsx
4. CHANGELOG.md

**Files to Delete**: 3
1. waas/useExecuteWithFee.tsx
2. waas/useRequiresFeeSelection.tsx
3. utils/useAutoSelectFeeOption.tsx

**Result**:
- ✅ All 4 modals using unified pattern
- ✅ -265 net lines of code
- ✅ 100% consistent UX
- ✅ Single source of truth
- ✅ Easy to maintain

## Verification Commands

```bash
# Check TypeScript errors
cd sdk && pnpm exec tsc --noEmit | grep -v "variant" | grep -v "DropdownMenu" | grep -v "FieldLabel"

# Should show: 0 errors (ignoring design system issues)

# Count remaining code
cd sdk/src/react/hooks/waas && wc -l *.tsx
# Should show: useWaasFeeManagement.tsx only

# Run tests
cd sdk && pnpm test -- useWaasFeeManagement
```

## Success Criteria

- [ ] All modals compile without errors
- [ ] Automatic mode works in all modals
- [ ] Manual mode shows UI in all modals
- [ ] Config is respected everywhere
- [ ] No code duplication
- [ ] All unused code deleted
- [ ] CHANGELOG updated
