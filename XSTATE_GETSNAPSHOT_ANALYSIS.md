# XState Store getSnapshot() Analysis for React

## Current Usage

In our migration from Legend State to XState Store, we're using `getSnapshot()` in modal components to read state synchronously. This document analyzes whether this is the correct approach for React applications.

## The Problem with getSnapshot() in React

Based on the XState Store documentation, **`getSnapshot()` is NOT the recommended approach for React components**. Here's why:

### 1. **No Reactivity**
```typescript
// ❌ Current approach - NOT reactive
const feeOptionsVisible = selectWaasFeeOptionsStore.getSnapshot().context.isVisible;
```
This reads the value once at render time but **does not subscribe to changes**. If the store updates, the component won't re-render.

### 2. **React Hook Rules Violation**
The documentation clearly states that for React, you should use:
- `useSelector(store, selector)` - For reading store state reactively
- `useAtom(atom)` - For reading atom state reactively

### 3. **Stale Closures**
Using `getSnapshot()` in event handlers can lead to stale closures:
```typescript
// ❌ Can have stale values
const handleClick = () => {
  const state = store.getSnapshot(); // May not be current
};
```

## The Correct Solution

### For Reading State in Components

```typescript
// ✅ Correct - Using useSelector hook
import { useSelector } from '@xstate/store/react';

function Component() {
  const isVisible = useSelector(
    selectWaasFeeOptionsStore,
    (state) => state.context.isVisible
  );
  
  const selectedFeeOption = useSelector(
    selectWaasFeeOptionsStore,
    (state) => state.context.selectedFeeOption
  );
  
  // Component will re-render when these values change
}
```

### For Reading Multiple Values

```typescript
// ✅ Correct - Using custom hook that uses useSelector
function Component() {
  const { isVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
  // This hook internally uses useSelector for each value
}
```

### When getSnapshot() IS Appropriate

`getSnapshot()` is appropriate in these scenarios:

1. **Outside React Components**
   ```typescript
   // ✅ OK - In utility functions
   function logCurrentState() {
     console.log(store.getSnapshot());
   }
   ```

2. **In Event Handlers (with caution)**
   ```typescript
   // ✅ OK - When you need the value at event time
   const handleSubmit = () => {
     const { selectedFeeOption } = store.getSnapshot().context;
     // Use for immediate action, not for rendering
   };
   ```

3. **For Testing**
   ```typescript
   // ✅ OK - In tests
   expect(store.getSnapshot().context.isVisible).toBe(true);
   ```

4. **Backward Compatibility Layer**
   ```typescript
   // ✅ OK - For migration purposes
   const mockObservable = {
     get: () => store.getSnapshot().context.value
   };
   ```

## Required Changes

All modal components currently using `getSnapshot()` for rendering should be updated:

### Before (Incorrect)
```typescript
// ❌ In SellModal/Modal.tsx
const feeOptionsVisible = selectWaasFeeOptionsStore.getSnapshot().context.isVisible;
```

### After (Correct)
```typescript
// ✅ Using the hook
const { isVisible: feeOptionsVisible } = useSelectWaasFeeOptionsStore();

// OR using useSelector directly
const feeOptionsVisible = useSelector(
  selectWaasFeeOptionsStore,
  (state) => state.context.isVisible
);
```

## Why This Matters

1. **Performance**: Components only re-render when the specific values they're subscribed to change
2. **Correctness**: UI stays in sync with store state
3. **React Best Practices**: Follows React's rules of hooks and reactivity patterns
4. **Type Safety**: TypeScript can better infer types with hooks

## Migration Strategy

1. **Immediate**: Update all components using `getSnapshot()` for rendering to use `useSelector` or the custom hook
2. **Keep**: `getSnapshot()` usage in:
   - Event handlers (where appropriate)
   - Backward compatibility layer
   - Tests
   - Non-React code

## Conclusion

**`getSnapshot()` is the WRONG solution for reading state in React components**. The correct approach is to use:
- `useSelector()` for direct store access
- Custom hooks (like `useSelectWaasFeeOptionsStore()`) that internally use `useSelector`
- `useAtom()` for atoms

This ensures proper reactivity, follows React best practices, and maintains performance.