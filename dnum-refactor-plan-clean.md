# Clean Dnum Refactor Plan

## Overview
This plan outlines a clean approach to refactoring the QuantityInput component and related functionality to use dnum (Decimal Number) internally while maintaining a simple API for SDK consumers.

## Goals
1. **Internal Excellence**: Use dnum for all decimal arithmetic to avoid precision issues
2. **External Simplicity**: SDK consumers work with simple string/number types
3. **Type Safety**: Leverage TypeScript for compile-time safety
4. **Zero Breaking Changes**: Existing integrations must continue working

## Architecture

### Layer 1: Public API (What SDK consumers see)
```typescript
// SDK consumers continue using simple types
<BuyModal 
  collectionAddress="0x..." 
  tokenId="123"
  quantity="5"  // Simple string
/>
```

### Layer 2: Internal Components (Using dnum)
```typescript
// Internal components use dnum for precision
type InternalQuantityInputProps = {
  quantity: Dnum;
  maxQuantity: Dnum;
  onQuantityChange: (quantity: Dnum) => void;
  // No decimals prop needed - extracted from Dnum
}
```

### Layer 3: Conversion Layer
```typescript
// Utility functions handle conversions
export function stringToDnum(value: string, decimals: number): Dnum {
  return dn.from(value, decimals);
}

export function dnumToString(value: Dnum): string {
  return dn.toString(value);
}
```

## Implementation Steps

### Phase 1: Consolidate QuantityInput Component
1. **Choose the best implementation**: V3 is the cleanest (no redundant decimals prop)
2. **Create final version**: Rename V3 to QuantityInput
3. **Remove old versions**: Delete original, V2, and backup files
4. **Update imports**: Ensure all components use the consolidated version

### Phase 2: Fix Failing Tests
1. **Update test expectations**: Tests should work with the new Dnum-based API
2. **Add dnum-specific tests**: Test edge cases like precision, overflow, etc.
3. **Ensure 100% coverage**: All paths through the component should be tested

### Phase 3: Create Public API Wrappers
1. **Modal wrappers**: Create thin wrappers that accept string props
2. **Internal conversion**: Convert strings to Dnum before passing to internal components
3. **Type definitions**: Export simple types for SDK consumers

### Phase 4: Documentation
1. **Internal docs**: Document dnum usage for maintainers
2. **Public docs**: Show simple string-based examples for consumers
3. **Migration guide**: Help any direct users of internal components

## Technical Details

### QuantityInput Component Structure
```typescript
// Internal component (uses Dnum)
function QuantityInput({
  quantity,
  maxQuantity,
  onQuantityChange,
  ...props
}: QuantityInputProps) {
  // Extract decimals from maxQuantity
  const decimals = maxQuantity[1];
  
  // All internal logic uses dnum
  // ...
}

// Public wrapper (for SDK consumers who need direct access)
export function QuantityInputWrapper({
  quantity: quantityString,
  maxQuantity: maxQuantityString,
  decimals,
  onQuantityChange,
  ...props
}: PublicQuantityInputProps) {
  const quantityDnum = dn.from(quantityString, 0);
  const maxQuantityDnum = dn.from(maxQuantityString, decimals);
  
  return (
    <QuantityInput
      quantity={quantityDnum}
      maxQuantity={maxQuantityDnum}
      onQuantityChange={(dnum) => onQuantityChange(dn.toString(dnum))}
      {...props}
    />
  );
}
```

### Store Structure
```typescript
// Internal stores use Dnum
type InternalState = {
  quantity: Dnum;
  // other fields...
}

// Public getters return strings
export const getQuantityString = (state: InternalState): string => {
  return dn.toString(state.quantity);
}
```

## Testing Strategy

### Unit Tests
1. **Component tests**: Test QuantityInput with various Dnum inputs
2. **Conversion tests**: Ensure string <-> Dnum conversions are correct
3. **Edge case tests**: Test precision limits, very large numbers, etc.

### Integration Tests
1. **Modal tests**: Ensure all modals work with the new implementation
2. **E2E tests**: Test full user flows with quantity inputs
3. **Backward compatibility**: Ensure existing SDK usage patterns work

## Migration Checklist

- [ ] Consolidate QuantityInput implementations
- [ ] Fix all failing tests
- [ ] Create public API wrappers where needed
- [ ] Update all modal components
- [ ] Clean up backup files
- [ ] Update documentation
- [ ] Create migration guide
- [ ] Run full test suite
- [ ] Update changeset with clear description

## Benefits

1. **Precision**: No more floating-point errors in calculations
2. **Clarity**: Clear separation between user-facing and blockchain values
3. **Maintainability**: Single source of truth for decimal handling
4. **Type Safety**: TypeScript ensures correct usage
5. **Performance**: Dnum is optimized for arbitrary precision arithmetic

## Risks & Mitigations

1. **Risk**: Breaking changes for direct component users
   - **Mitigation**: Provide compatibility wrappers

2. **Risk**: Performance impact from Dnum operations
   - **Mitigation**: Dnum is highly optimized, profile if issues arise

3. **Risk**: Confusion about when to use Dnum vs strings
   - **Mitigation**: Clear documentation and type definitions

## Success Criteria

1. All tests passing (including new Dnum-specific tests)
2. No breaking changes for SDK consumers
3. Clean, maintainable codebase with single QuantityInput implementation
4. Clear documentation for both internal and external usage
5. Improved precision in all quantity calculations