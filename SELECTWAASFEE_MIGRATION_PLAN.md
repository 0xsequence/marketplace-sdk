# SelectWaasFeeOptions Store Migration Plan

## Overview
This document outlines the detailed migration plan for the `selectWaasFeeOptions` store from Legend State to XState Store.

## Current Implementation Analysis

### Store Structure
```typescript
// Current Legend State implementation
type SelectWaasFeeOptionsState = {
  selectedFeeOption: FeeOption | undefined;
  pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
  isVisible: boolean;
  hide: () => void;
};

export const selectWaasFeeOptions$ = observable({
  selectedFeeOption: undefined,
  pendingFeeOptionConfirmation: undefined,
  isVisible: false,
  hide: () => {
    selectWaasFeeOptions$.isVisible.set(false);
    selectWaasFeeOptions$.selectedFeeOption.set(undefined);
    selectWaasFeeOptions$.pendingFeeOptionConfirmation.set(undefined);
  },
});
```

### Usage Locations
1. **CreateListingModal/Modal.tsx**
   - Sets `isVisible` when WaaS wallet detected
   - Reads `isVisible`, `selectedFeeOption` in `useSelectWaasFeeOptions` hook
   - Calls `hide()` on modal close

2. **SellModal/Modal.tsx**
   - Same pattern as CreateListingModal

3. **MakeOfferModal/Modal.tsx**
   - Same pattern as CreateListingModal

4. **TransferModal**
   - Used in both `index.tsx` and `_views/enterWalletAddress/index.tsx`
   - Same usage pattern

5. **transactionStatusModal/index.tsx**
   - Checks `isVisible` and calls `hide()` if visible

6. **SelectWaasFeeOptions Component**
   - Main component using the store
   - Uses `observer` HOC
   - Directly accesses store properties with `.get()`
   - Calls `hide()` method

7. **useWaasFeeOptionManager Hook**
   - Accesses `selectedFeeOption$` observable
   - Sets `selectedFeeOption` when options load

## Migration Implementation

### Step 1: Create New XState Store

```typescript
// File: /sdk/src/react/ui/modals/_internal/components/selectWaasFeeOptions/store.ts

import { createStore } from '@xstate/store';
import type {
  FeeOption,
  WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';

interface SelectWaasFeeOptionsContext {
  selectedFeeOption: FeeOption | undefined;
  pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
  isVisible: boolean;
}

export const selectWaasFeeOptionsStore = createStore({
  context: {
    selectedFeeOption: undefined,
    pendingFeeOptionConfirmation: undefined,
    isVisible: false,
  } as SelectWaasFeeOptionsContext,
  on: {
    show: (context) => ({
      ...context,
      isVisible: true,
    }),
    hide: () => ({
      selectedFeeOption: undefined,
      pendingFeeOptionConfirmation: undefined,
      isVisible: false,
    }),
    setSelectedFeeOption: (context, event: { feeOption: FeeOption | undefined }) => ({
      ...context,
      selectedFeeOption: event.feeOption,
    }),
    setPendingFeeOptionConfirmation: (
      context,
      event: { confirmation: WaasFeeOptionConfirmation | undefined }
    ) => ({
      ...context,
      pendingFeeOptionConfirmation: event.confirmation,
    }),
  },
});

// Temporary backward compatibility export
export const selectWaasFeeOptions$ = {
  isVisible: {
    get: () => selectWaasFeeOptionsStore.getSnapshot().context.isVisible,
    set: (value: boolean) => {
      selectWaasFeeOptionsStore.send({ type: value ? 'show' : 'hide' });
    },
  },
  selectedFeeOption: {
    get: () => selectWaasFeeOptionsStore.getSnapshot().context.selectedFeeOption,
    set: (value: FeeOption | undefined) => {
      selectWaasFeeOptionsStore.send({ type: 'setSelectedFeeOption', feeOption: value });
    },
  },
  pendingFeeOptionConfirmation: {
    get: () => selectWaasFeeOptionsStore.getSnapshot().context.pendingFeeOptionConfirmation,
    set: (value: WaasFeeOptionConfirmation | undefined) => {
      selectWaasFeeOptionsStore.send({ type: 'setPendingFeeOptionConfirmation', confirmation: value });
    },
  },
  hide: () => {
    selectWaasFeeOptionsStore.send({ type: 'hide' });
  },
};
```

### Step 2: Create React Hooks

```typescript
// Add to store.ts file

import { useSelector } from '@xstate/store/react';

export const useSelectWaasFeeOptionsStore = () => {
  const isVisible = useSelector(
    selectWaasFeeOptionsStore,
    (state) => state.context.isVisible
  );
  const selectedFeeOption = useSelector(
    selectWaasFeeOptionsStore,
    (state) => state.context.selectedFeeOption
  );
  const pendingFeeOptionConfirmation = useSelector(
    selectWaasFeeOptionsStore,
    (state) => state.context.pendingFeeOptionConfirmation
  );

  return {
    isVisible,
    selectedFeeOption,
    pendingFeeOptionConfirmation,
    show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
    hide: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
    setSelectedFeeOption: (feeOption: FeeOption | undefined) =>
      selectWaasFeeOptionsStore.send({ type: 'setSelectedFeeOption', feeOption }),
    setPendingFeeOptionConfirmation: (confirmation: WaasFeeOptionConfirmation | undefined) =>
      selectWaasFeeOptionsStore.send({ type: 'setPendingFeeOptionConfirmation', confirmation }),
  };
};
```

### Step 3: Update SelectWaasFeeOptions Component

```typescript
// File: /sdk/src/react/ui/modals/_internal/components/selectWaasFeeOptions/index.tsx

'use client';

import { Divider, Skeleton, Text } from '@0xsequence/design-system';
// Remove: import { observer } from '@legendapp/state/react';
import type { FeeOption } from '../../../../../../types/waas-types';
import { cn } from '../../../../../../utils';
import WaasFeeOptionsSelect from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import ActionButtons from './_components/ActionButtons';
import BalanceIndicator from './_components/BalanceIndicator';
import { selectWaasFeeOptionsStore, useSelectWaasFeeOptionsStore } from './store';
import useWaasFeeOptionManager from './useWaasFeeOptionManager';

// Remove observer HOC
const SelectWaasFeeOptions = ({
  chainId,
  onCancel,
  titleOnConfirm,
  className,
}: SelectWaasFeeOptionsProps) => {
  const { isVisible, hide } = useSelectWaasFeeOptionsStore();
  
  const {
    selectedFeeOption$, // This will need updating in useWaasFeeOptionManager
    selectedFeeOption,
    pendingFeeOptionConfirmation,
    currencyBalance,
    currencyBalanceLoading,
    insufficientBalance,
    feeOptionsConfirmed,
    handleConfirmFeeOption,
  } = useWaasFeeOptionManager(chainId);

  const handleCancelFeeOption = () => {
    hide();
    onCancel?.();
  };

  const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;

  if (!isVisible || isSponsored || !selectedFeeOption) {
    return null;
  }

  // Rest of component remains the same
  return (
    <div className={cn(/* ... */)}>
      {/* Component JSX remains unchanged */}
    </div>
  );
};

export default SelectWaasFeeOptions;
```

### Step 4: Update useWaasFeeOptionManager Hook

```typescript
// File: /sdk/src/react/ui/modals/_internal/components/selectWaasFeeOptions/useWaasFeeOptionManager.tsx

import { useSelectWaasFeeOptionsStore } from './store';

const useWaasFeeOptionManager = (chainId: number) => {
  const { address: userAddress } = useAccount();
  const { 
    selectedFeeOption, 
    setSelectedFeeOption,
    pendingFeeOptionConfirmation,
    setPendingFeeOptionConfirmation 
  } = useSelectWaasFeeOptionsStore();
  
  const [pendingFeeOptionConfirmationFromHook, confirmPendingFeeOption] = useWaasFeeOptions();
  const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);

  // Update pendingFeeOptionConfirmation in store when it changes
  useEffect(() => {
    setPendingFeeOptionConfirmation(pendingFeeOptionConfirmationFromHook);
  }, [pendingFeeOptionConfirmationFromHook]);

  const { data: currencyBalance, isLoading: currencyBalanceLoading } = useCurrencyBalance({
    chainId,
    currencyAddress: (selectedFeeOption?.token.contractAddress || zeroAddress) as Address,
    userAddress: userAddress as Address,
  });

  useEffect(() => {
    if (!selectedFeeOption && pendingFeeOptionConfirmation) {
      if (pendingFeeOptionConfirmation.options.length > 0) {
        setSelectedFeeOption(pendingFeeOptionConfirmation.options[0] as FeeOption);
      }
    }
  }, [pendingFeeOptionConfirmation, selectedFeeOption, setSelectedFeeOption]);

  // Rest of the hook remains the same
  // ...

  return {
    selectedFeeOption$: { 
      get: () => selectedFeeOption,
      set: setSelectedFeeOption 
    }, // For backward compatibility
    selectedFeeOption,
    pendingFeeOptionConfirmation,
    currencyBalance,
    currencyBalanceLoading,
    insufficientBalance,
    feeOptionsConfirmed,
    handleConfirmFeeOption,
  };
};
```

### Step 5: Update Modal Components

For each modal (CreateListingModal, SellModal, MakeOfferModal, TransferModal):

```typescript
// Example: CreateListingModal/Modal.tsx

// Change from:
selectWaasFeeOptions$.isVisible.set(true);
selectWaasFeeOptions$.hide();

// To:
selectWaasFeeOptionsStore.send({ type: 'show' });
selectWaasFeeOptionsStore.send({ type: 'hide' });

// In useSelectWaasFeeOptions hook calls, change from:
feeOptionsVisible: selectWaasFeeOptions$.isVisible.get(),
selectedFeeOption: selectWaasFeeOptions$.selectedFeeOption.get() as FeeOption,

// To:
feeOptionsVisible: selectWaasFeeOptionsStore.getSnapshot().context.isVisible,
selectedFeeOption: selectWaasFeeOptionsStore.getSnapshot().context.selectedFeeOption as FeeOption,
```

### Step 6: Update Tests

```typescript
// File: __tests__/SelectWaasFeeOptions.test.tsx

// Change from:
selectWaasFeeOptions$.isVisible.set(true);
selectWaasFeeOptions$.selectedFeeOption.set(undefined);
selectWaasFeeOptions$.pendingFeeOptionConfirmation.set(undefined);

// To:
selectWaasFeeOptionsStore.send({ type: 'show' });
selectWaasFeeOptionsStore.send({ type: 'setSelectedFeeOption', feeOption: undefined });
selectWaasFeeOptionsStore.send({ type: 'setPendingFeeOptionConfirmation', confirmation: undefined });
```

## Migration Checklist

### Phase 1: Setup (Day 1)
- [ ] Verify @xstate/store and @xstate/store/react are installed
- [ ] Create new store implementation with backward compatibility layer
- [ ] Add React hooks for the store
- [ ] Run existing tests to ensure backward compatibility works

### Phase 2: Component Migration (Day 2)
- [ ] Update SelectWaasFeeOptions component to remove observer HOC
- [ ] Update useWaasFeeOptionManager hook
- [ ] Update WaasFeeOptionsSelect component if needed
- [ ] Test the SelectWaasFeeOptions component in isolation

### Phase 3: Modal Updates (Day 3)
- [ ] Update CreateListingModal
- [ ] Update SellModal
- [ ] Update MakeOfferModal
- [ ] Update TransferModal (both files)
- [ ] Update transactionStatusModal

### Phase 4: Testing & Cleanup (Day 4)
- [ ] Update all test files
- [ ] Run full test suite
- [ ] Manual testing of all modals
- [ ] Remove backward compatibility layer
- [ ] Remove Legend State imports
- [ ] Update any documentation

## Rollback Strategy

1. Keep the backward compatibility layer during migration
2. Keep original Legend State code commented until fully validated
3. If issues arise, quickly revert to the previous commit

## Success Metrics

1. **Functionality**: All modals work as before
2. **Tests**: All existing tests pass
3. **Performance**: No regression in render performance
4. **Bundle Size**: Measure reduction after removing Legend State
5. **Type Safety**: Full TypeScript coverage maintained

## Risks and Mitigations

### Risk 1: State Synchronization
**Issue**: The store is accessed from multiple components simultaneously
**Mitigation**: XState Store handles this automatically with its event-driven architecture

### Risk 2: Observable Property Pattern
**Issue**: Components use `.get()` pattern extensively
**Mitigation**: Backward compatibility layer maintains this pattern during migration

### Risk 3: Complex State Updates
**Issue**: The `hide()` method resets multiple properties at once
**Mitigation**: Single event handler in XState Store ensures atomic updates

## Timeline
- **Total Estimated Time**: 4 days
- **Developer Resources**: 1 developer
- **Review Time**: Additional 1 day for code review

## Next Steps After This Migration
1. Gather learnings and update migration patterns
2. Apply patterns to next component (transactionStatusModal)
3. Create reusable migration utilities based on this experience