# Type Casting Audit Summary

**Date:** November 19, 2025  
**Full Report:** [TYPE_CASTING_AUDIT.md](./TYPE_CASTING_AUDIT.md)

## Executive Summary

Total type casts analyzed: **~304** in SDK source code (`sdk/src`)

### Breakdown by Category

| Category | Count | Status |
|----------|-------|--------|
| 'as const' assertions | 118 | ✅ Safe - beneficial for type narrowing |
| Production 'as any' | 13 | 🔴 Must fix |
| Test 'as any' | 69 | 🟡 Acceptable but improvable |
| Double casts (as unknown as X) | 20 | 🔴 Architectural red flags |
| Address casts | 74 | 🟡 Common pattern, fixable |
| Error casts | 24 | 🟢 Acceptable pattern |
| Other domain types | 88 | 🟡 Various - see full report |

## Key Findings

1. **Production code is relatively clean** - Only 13 'as any' casts (excellent!)
2. **Previous Nov 18 audit was successful** - Fixed 85+ API layer type issues
3. **Address casting is dominant** - 74 occurrences indicate type narrowing challenges
4. **Test mocks need improvement** - 84% of 'as any' casts are in tests

## Priority 1: Quick Wins (80 minutes) 🎯

**Goal:** Eliminate ALL 13 production 'as any' casts (100% reduction)

### Tasks

1. **Fix metadata type issues** (5 casts)
   - File: `sdk/src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:172-176`
   - Issue: Accessing metadata properties with 'as any'
   - Fix: Update `TokenMetadata` type or create `PrimarySaleTokenMetadata`
   - **Time:** 30 mins | **Impact:** HIGH

2. **Fix Currency status enum** (2 casts)
   - Files: `CreateListingModal/store.ts:41`, `MakeOfferModal/store.ts:38`
   - Issue: `status: 0 as any` instead of using enum
   - Fix: Import and use `CurrencyStatus` enum
   - **Time:** 5 mins | **Impact:** MEDIUM

3. **Fix error property access** (2 casts)
   - Files: `utils/getWagmiErrorMessage.ts:113`, `utils/getErrorMessage.ts:13`
   - Issue: Accessing error properties without type guards
   - Fix: Create `HttpError` interface and type guard
   - **Time:** 15 mins | **Impact:** MEDIUM

4. **Fix marketplace type** (2 casts)
   - File: `ui/components/marketplace-collectible-card/ActionButton/components/NonOwnerActions.tsx:85,123`
   - Issue: Marketplace property type mismatch
   - Fix: Investigate proper type and update
   - **Time:** 20 mins | **Impact:** MEDIUM

5. **Document query data accumulation** (2 casts)
   - File: `ui/modals/_internal/components/baseModal/ActionModal.tsx:104,117`
   - Issue: Dynamic object key assignment in reduce
   - Fix: Add explanatory comment or refactor with `Object.fromEntries`
   - **Time:** 10 mins | **Impact:** LOW

## Priority 2: Address Casts (4.5 hours) 🔧

**Goal:** Reduce Address casts by 70%, eliminate dangerous double casts

### Key Improvements

1. **Create validation utilities** (30 mins)
   ```typescript
   export function requireAddress(value: string | undefined): Address {
     if (!value || !isAddress(value)) throw new Error('Invalid address');
     return value;
   }
   
   export function addressOrZero(value: string | undefined): Address {
     return value && isAddress(value) ? value : zeroAddress;
   }
   ```

2. **Fix store type definitions** (1 hour)
   - Update modal stores to use `Address` type
   - Use `zeroAddress` for initialization
   - **Eliminates:** 6 casts

3. **Fix wagmi address handling** (45 mins)
   - Add validation before using `useAccount().address`
   - Create `useValidatedAddress()` hook
   - **Eliminates:** 4 casts

4. **Fix optional property narrowing** (1 hour)
   - Add proper null checks
   - Use `addressOrZero` utility
   - **Eliminates:** 8 casts

5. **Fix double casts** (1 hour)
   - ChainId lookup with validation
   - Event type compatibility
   - Date handling
   - **Eliminates:** 4 dangerous casts

## Priority 3: Test Quality (10 hours) 🧪

**Goal:** Improve test maintainability, eliminate 50% of test casts

### Key Projects

1. **Create test mock factories** (4 hours)
   - Build factories for Order, FeeOption, Step, etc.
   - Centralize test constants
   - **Eliminates:** 35+ test casts

2. **Create typed test utilities** (2 hours)
   - Hook return mocks
   - Databeat analytics mock
   - **Eliminates:** 10+ double casts

3. **Fix step type narrowing** (2 hours)
   - Create type guards for each step type
   - Add runtime validation
   - **Eliminates:** 7 casts

4. **Improve error handling** (1 hour)
   - Create `toError()` utility
   - Use throughout codebase
   - **Eliminates:** 24 casts

5. **Fix FeeOption/ContractType** (1 hour)
   - Add validation before using optional values
   - **Eliminates:** 8 casts

## Impact Projection

### After Priority 1 (80 minutes)
- Production 'as any': **13 → 0** ✅
- **100% of production 'as any' eliminated**

### After Priority 2 (+4.5 hours)
- Double casts: **20 → 16** (production: 9 → 5)
- Address casts: **74 → 52** (production: 26 → 8)
- **+22 casts eliminated, major safety improvements**

### After Priority 3 (+10 hours)
- Test 'as any': **69 → 35**
- Address casts: **52 → 27**
- Other casts: **~60 → ~20**
- **+84 casts eliminated**

### Final State

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Production 'as any' | 13 | 0 | **100%** ✅ |
| Test 'as any' | 69 | 35 | 49% |
| Double casts | 20 | 16 | 20% |
| Address casts | 74 | 27 | **64%** |
| Error casts | 24 | 0 | **100%** |
| Other domain | 88 | 40 | 55% |
| **Total problematic** | **288** | **118** | **59%** |

## Recommended Patterns

### 1. Address Validation
```typescript
// ❌ Bad
const addr = someString as Address;

// ✅ Good
import { isAddress } from 'viem';

if (!someString || !isAddress(someString)) {
  throw new Error('Invalid address');
}
const addr = someString; // Type narrows to Address
```

### 2. Optional Narrowing
```typescript
// ❌ Bad
const addr = data?.address as Address;

// ✅ Good
if (!data?.address) return null;
const addr = data.address;
```

### 3. Error Handling
```typescript
// ❌ Okay
catch (error) {
  callback(error as Error);
}

// ✅ Better
function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

catch (error: unknown) {
  callback(toError(error));
}
```

### 4. Type Guards
```typescript
// ❌ Bad
const step = steps.find(s => s.id === 'sell') as SellStep;

// ✅ Good
function isSellStep(step: Step | undefined): step is SellStep {
  return step?.id === 'sell';
}

const step = steps.find(s => s.id === 'sell');
if (!isSellStep(step)) throw new Error('Sell step not found');
```

### 5. Test Factories
```typescript
// ❌ Bad
const mock = { tokenId: 1n } as any;

// ✅ Good
function createMockOrder(overrides?: Partial<Order>): Order {
  return { orderId: '123', tokenId: 1n, ...overrides };
}

const mock = createMockOrder({ tokenId: 1n });
```

## Files with Most Issues

### Production Files
1. `primary-sale-721-card-data.tsx` - 4 'as any' + 1 double cast
2. `NonOwnerActions.tsx` - 2 'as any'
3. `ActionModal.tsx` - 2 'as any'
4. `useWaasFeeOptionManager.tsx` - 1 'as any'
5. Various stores - 2 'as any' (Currency enum)

### Test Files
1. `SelectWaasFeeOptions.test.tsx` - 28 'as any'
2. `useHandleTransfer.test.tsx` - 11 'as any'
3. `useTransferTokens.test.tsx` - 8 'as any'
4. `useProcessStep.test.tsx` - 6 'as any'
5. `BuyModalRouter.test.tsx` - 5 'as any'

## Recommended Timeline

### Week 1: Priority 1 (80 minutes)
- ✅ Eliminate ALL production 'as any'
- ✅ Low effort, immediate impact

### Week 2: Priority 2 (4.5 hours)
- ✅ Address validation utilities
- ✅ Fix dangerous double casts
- ✅ Major safety improvements

### Ongoing: Priority 3 (10 hours)
- Improve test quality
- Create mock factories
- Reduce technical debt

**Total Investment:** ~15 hours for 59% reduction in problematic casts

## Next Steps

1. Review this summary with team
2. Get approval for Priority 1 changes
3. Start with highest-impact fixes (metadata types)
4. Create PRs incrementally
5. Document patterns in contributing guide

---

**See [TYPE_CASTING_AUDIT.md](./TYPE_CASTING_AUDIT.md) for detailed analysis of each cast, specific file locations, and code examples.**
