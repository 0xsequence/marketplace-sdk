# Type Casting Audit Report - Comprehensive Analysis

**SDK Source Code Analysis** (`sdk/src` directory only)

**Date:** November 19, 2025  
**Previous Audit:** November 18, 2025 (Major fixes completed)  
**This Report:** Complete re-audit with detailed breakdown and new recommendations

---

## Executive Summary

### Overall Statistics

- **Total type casts found:** ~304
- **'as any' casts:** 82 total (13 in production code, 69 in tests)
- **'as unknown as X' double casts:** 20
- **'as const' assertions:** 118 (generally safe)
- **'as Address' casts:** 74
- **'as Error' casts:** 24
- **'as Hash/Hex' casts:** 8
- **Other domain type casts:** ~88 (Step, Order, ContractType, FeeOption, etc.)

### Previous Work (Nov 18, 2025)

The previous audit successfully eliminated ~85+ type assertions (42% reduction) by:
- ✅ Fixing API layer to return proper viem branded types (Address, Hex)
- ✅ Implementing transform layer for transaction steps
- ✅ Creating proper discriminated unions for SignatureStep
- ✅ Normalizing metadata addresses

**This report builds on that success** and identifies remaining issues plus new opportunities.

### Key Findings

1. **Production code is relatively clean** - only 13 'as any' casts
2. **Test files contain 84% of 'as any' casts** - acceptable but improvable
3. **Address casting is still the most common pattern** (74 occurrences)
4. **Double casts indicate architectural issues** (20 occurrences)
5. **'as const' assertions are well-used** (118 occurrences) - good practice

### Files with Most Problematic Casts

1. `SelectWaasFeeOptions.test.tsx` - 28 'as any' (test file)
2. `useHandleTransfer.test.tsx` - 11 'as any' (test file)
3. `useTransferTokens.test.tsx` - 8 'as any' (test file)
4. `useProcessStep.test.tsx` - 6 'as any' (test file)
5. `primary-sale-721-card-data.tsx` - 4 'as any' (production)

---

## Category 1: 'as any' Casts (Most Problematic)

### Production Code Occurrences (13 total)

These are the **highest priority** issues to fix.

#### 1. Error Object Property Access

**File:** `sdk/src/utils/getWagmiErrorMessage.ts:113`
```typescript
const httpError = error as any;
if (httpError.status === 429) {
  return 'Rate limit exceeded. Please wait a moment before trying again.';
}
```

**Why problematic:** Bypasses type checking when accessing `error.status` property.

**Severity:** 🟡 Medium - Works but unsafe

**Fix:** Create proper type guard or interface:
```typescript
interface HttpError extends Error {
  status?: number;
}

function isHttpError(error: unknown): error is HttpError {
  return error instanceof Error && 'status' in error;
}

// Usage
if (isHttpError(error)) {
  if (error.status === 429) {
    return 'Rate limit exceeded...';
  }
}
```

**Impact:** Eliminates 1 'as any', adds type safety

---

#### 2. Error Code Check

**File:** `sdk/src/utils/getErrorMessage.ts:13`
```typescript
if ('code' in error && typeof (error as any).code === 'number') {
```

**Why problematic:** Already using proper type guard with `'code' in error`, but then bypassing it with `as any`.

**Severity:** 🟢 Low - Logic is sound, just redundant cast

**Fix:** Remove the cast, TypeScript should infer correctly:
```typescript
if ('code' in error && typeof error.code === 'number') {
  return getWebRPCErrorMessage(error);
}
```

**Impact:** Eliminates 1 'as any'

---

#### 3. Metadata Property Access (4 occurrences)

**File:** `sdk/src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:172-175`
```typescript
tokenMetadata: {
  ...metadata,
  tokenId: item.tokenId,
  name: (metadata as any).name || '',
  source: (metadata as any).source || '',
  attributes: (metadata as any).attributes || [],
  status: (metadata as any).status || 'active',
} as unknown as TokenMetadata,
```

**Why problematic:** 
- Uses 4 'as any' casts for individual properties
- Uses 1 double cast for entire object
- Indicates metadata type is incomplete or API returns inconsistent shape

**Severity:** 🔴 High - Type mismatch indicates data contract issue

**Fix:** 
Option 1 - Update TokenMetadata type (if these properties should exist):
```typescript
// In API types
interface TokenMetadata {
  // existing properties...
  name?: string;
  source?: string;
  attributes?: Array<{ trait_type: string; value: unknown }>;
  status?: 'active' | 'inactive';
}
```

Option 2 - Create specific type for primary sale (if different shape is intentional):
```typescript
interface PrimarySaleTokenMetadata extends Omit<TokenMetadata, 'name'> {
  name: string;
  source: string;
  attributes: Array<{ trait_type: string; value: unknown }>;
  status: 'active' | 'inactive';
}

// Then safely construct it
const tokenMetadata: PrimarySaleTokenMetadata = {
  ...metadata,
  tokenId: item.tokenId,
  name: metadata.name ?? '',
  source: metadata.source ?? '',
  attributes: metadata.attributes ?? [],
  status: metadata.status ?? 'active',
};
```

**Impact:** Eliminates 5 casts (4 'as any' + 1 double cast), improves API contract

---

#### 4. Currency Status Enum (2 occurrences)

**File:** `sdk/src/react/ui/modals/CreateListingModal/store.ts:41`
**File:** `sdk/src/react/ui/modals/MakeOfferModal/store.ts:38`
```typescript
const emptyCurrency: Currency = {
  chainId: 0,
  contractAddress: '0x0000000000000000000000000000000000000000',
  status: 0 as any, // CurrencyStatus enum
  name: '',
  symbol: '',
  // ...
};
```

**Why problematic:** Comment explicitly states this should be `CurrencyStatus` enum value, not `any`.

**Severity:** 🟡 Medium - Type safety bypass for enum

**Fix:** Import and use proper enum:
```typescript
import { CurrencyStatus } from '@0xsequence/marketplace-api';

const emptyCurrency: Currency = {
  chainId: 0,
  contractAddress: '0x0000000000000000000000000000000000000000',
  status: CurrencyStatus.UNVERIFIED, // Or whatever the appropriate value is
  // ...
};
```

**Alternative:** If 0 is valid, cast to the enum type instead of any:
```typescript
status: 0 as CurrencyStatus,
```

**Impact:** Eliminates 2 'as any', enforces enum contract

---

#### 5. Query Data Accumulation (2 occurrences)

**File:** `sdk/src/react/ui/modals/_internal/components/baseModal/ActionModal.tsx:104,117`
```typescript
// Building data object from queries
const data = Object.entries(queries).reduce(
  (acc, [key, query]) => {
    if (query.data !== undefined) {
      (acc as any)[key] = query.data;  // Line 104
    }
    return acc;
  },
  {} as { [K in keyof T]: NonNullable<T[K]['data']> },
);

// Later...
const data = Object.entries(queries).reduce(
  (acc, [key, query]) => {
    (acc as any)[key] = query.data!; // Line 117
    return acc;
  },
  {} as { [K in keyof T]: NonNullable<T[K]['data']> },
);
```

**Why problematic:** TypeScript can't track dynamic object key assignment in reduce.

**Severity:** 🟢 Low - Logic is correct, TypeScript limitation

**Fix:** Use type-safe alternatives:

Option 1 - Use Record helper:
```typescript
const data = Object.entries(queries).reduce(
  (acc, [key, query]) => {
    if (query.data !== undefined) {
      return { ...acc, [key]: query.data };
    }
    return acc;
  },
  {} as { [K in keyof T]: NonNullable<T[K]['data']> },
);
```

Option 2 - Use Object.fromEntries:
```typescript
const data = Object.fromEntries(
  Object.entries(queries)
    .filter(([_, query]) => query.data !== undefined)
    .map(([key, query]) => [key, query.data])
) as { [K in keyof T]: NonNullable<T[K]['data']> };
```

Option 3 - Accept the cast with better comment:
```typescript
(acc as any)[key] = query.data; // Safe: key is from T, data is NonNullable<T[K]['data']>
```

**Impact:** Eliminates 2 'as any' or makes intent clearer

---

#### 6. Marketplace Data Casting (2 occurrences)

**File:** `sdk/src/react/ui/components/marketplace-collectible-card/ActionButton/components/NonOwnerActions.tsx:85,123`

**Line 85:**
```typescript
showBuyModal({
  collectionAddress,
  chainId,
  tokenId,
  items: [
    {
      tokenId,
      quantity: 1n,
    } as any,  // <-- Line 85
  ],
  cardType: 'shop',
  // ...
})
```

**Line 123:**
```typescript
showBuyModal({
  collectionAddress,
  chainId,
  tokenId,
  orderId: lowestListing.orderId,
  marketplace: lowestListing.marketplace as any,  // <-- Line 123
  cardType: 'market',
  // ...
})
```

**Why problematic:** 
- Line 85: Item object doesn't match expected type
- Line 123: Marketplace property type mismatch

**Severity:** 🟡 Medium - Type contract mismatch

**Fix:**

For line 85 - Check BuyModalProps type and create proper item:
```typescript
interface BuyModalItem {
  tokenId: bigint;
  quantity: bigint;
  // Add any other required properties
}

// Then use proper type:
items: [
  {
    tokenId,
    quantity: 1n,
  } satisfies BuyModalItem,
],
```

For line 123 - Check marketplace type definition:
```typescript
// If marketplace should be a specific enum or string literal type:
marketplace: lowestListing.marketplace, // Remove cast if types match

// Or if type coercion is needed:
type MarketplaceId = string; // Define proper type
marketplace: lowestListing.marketplace as MarketplaceId,
```

**Impact:** Eliminates 2 'as any', enforces modal contract

---

#### 7. Pending Fee Option Confirmation

**File:** `sdk/src/react/ui/modals/_internal/components/selectWaasFeeOptions/useWaasFeeOptionManager.tsx:25`
```typescript
pendingFeeOptionConfirmationFromHook as any,
```

**Why problematic:** Type mismatch between hook return and where it's used.

**Severity:** 🟡 Medium - Unclear type contract

**Context needed:** Need to see the hook definition and usage site.

**Fix:** Investigate actual types and either:
1. Fix hook return type
2. Create proper adapter/transformer
3. Document why cast is needed

**Impact:** Eliminates 1 'as any'

---

### Test File Occurrences (69 total)

Test files account for **84% of all 'as any' casts**. While acceptable for testing, they could be improved.

**Distribution:**
- `SelectWaasFeeOptions.test.tsx` - 28 occurrences
- `useHandleTransfer.test.tsx` - 11 occurrences
- `useTransferTokens.test.tsx` - 8 occurrences
- `useProcessStep.test.tsx` - 6 occurrences
- `BuyModalRouter.test.tsx` - 5 occurrences
- Other test files - 11 occurrences

**Common patterns:**
```typescript
// Partial mocks
connector: {} as any,
lowestListing: { ...mockOrder, side: OrderSide.listing } as any,
step: createMockStep(StepType.tokenApproval) as any,

// Invalid test values
id: 'unsupported' as any,
quantity: 'invalid-quantity' as any,
walletKind: 'unknown' as any,
collectionType: 'INVALID_TYPE' as any,
```

**Assessment:** ✅ Generally acceptable for tests, especially:
- Testing error cases with invalid values
- Creating partial mocks for large interfaces
- Simulating edge cases

**Improvement opportunity:** Create typed mock factories:

```typescript
// test/factories/order.ts
export function createMockOrder(overrides?: Partial<Order>): Order {
  return {
    orderId: '123',
    tokenId: 1n,
    quantity: 1n,
    side: OrderSide.listing,
    // ... all required fields with sensible defaults
    ...overrides
  };
}

// test/factories/step.ts
export function createMockTransactionStep(
  overrides?: Partial<TransactionStep>
): TransactionStep {
  return {
    id: StepType.transaction,
    to: '0x1234567890123456789012345678901234567890',
    data: '0x',
    // ... all required fields
    ...overrides
  };
}

// Usage in tests
const mockOrder = createMockOrder({ side: OrderSide.listing });
// Instead of: { ...mockOrder, side: OrderSide.listing } as any
```

**Impact:** Could eliminate 30-40 test 'as any' casts, improve test maintainability

---

## Category 2: Double Casts (as unknown as X)

Double casts (`as unknown as X`) are **red flags** - they indicate TypeScript can't directly convert between types, suggesting architectural issues.

**Total found:** 20 occurrences (9 production, 11 tests)

### Production Code Double Casts (9 occurrences)

#### 1. ChainId Type Mismatch

**File:** `sdk/src/react/ui/modals/_internal/components/transaction-footer/index.tsx:35`
```typescript
const transactionUrl = `${networks[chainId as unknown as ChainId]?.blockExplorer?.rootUrl}tx/${transactionHash}`;
```

**Why problematic:** `chainId` is `number` but accessing `networks` which expects `ChainId` enum.

**Severity:** 🔴 High - Runtime error if chainId not in enum

**Fix:** Create safer lookup:
```typescript
function getNetworkBlockExplorer(chainId: number): string | undefined {
  const network = networks[chainId as ChainId];
  return network?.blockExplorer?.rootUrl;
}

const blockExplorerUrl = getNetworkBlockExplorer(chainId);
if (!blockExplorerUrl) {
  console.warn(`No block explorer for chain ${chainId}`);
  return null; // or use fallback
}
const transactionUrl = `${blockExplorerUrl}tx/${transactionHash}`;
```

**Alternative:** If ChainId is just a number type alias:
```typescript
// Just use regular cast
const network = networks[chainId as ChainId];
```

**Impact:** Eliminates 1 dangerous double cast, adds runtime safety

---

#### 2. React Event Type Conversion

**File:** `sdk/src/react/ui/components/marketplace-collectible-card/Card/card.tsx:15`
```typescript
onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
```

**Why problematic:** Event type mismatch - receiving one event type, passing different type.

**Severity:** 🟡 Medium - May lose event properties

**Fix:** Update onClick handler type to accept both:
```typescript
interface CardProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

// Then no cast needed:
onClick(e);
```

**Impact:** Eliminates 1 double cast, fixes event typing

---

#### 3. TokenMetadata Double Cast

**File:** `sdk/src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:176`
```typescript
tokenMetadata: {
  ...metadata,
  tokenId: item.tokenId,
  name: (metadata as any).name || '',
  source: (metadata as any).source || '',
  attributes: (metadata as any).attributes || [],
  status: (metadata as any).status || 'active',
} as unknown as TokenMetadata,
```

**Why problematic:** After casting individual properties with `as any`, entire object needs double cast.

**Severity:** 🔴 High - Indicates serious type mismatch

**Fix:** See Category 1, Item 3 above - fix metadata types at source.

**Impact:** Part of metadata fix that eliminates 5 casts total

---

#### 4. Date Object Cast

**File:** `sdk/src/react/ui/modals/_internal/components/calendar/index.tsx:18`
```typescript
selected={selectedDate as unknown as Date}
```

**Why problematic:** `selectedDate` type doesn't match calendar component's expected `Date`.

**Severity:** 🟡 Medium - Type mismatch with third-party component

**Fix:** 
Check what type `selectedDate` actually is:

Option 1 - If it's a timestamp:
```typescript
selected={selectedDate ? new Date(selectedDate) : undefined}
```

Option 2 - If it's a date string:
```typescript
selected={selectedDate ? new Date(selectedDate) : undefined}
```

Option 3 - If component accepts multiple types, update prop type:
```typescript
selected: Date | string | number | undefined;
```

**Impact:** Eliminates 1 double cast, fixes date handling

---

#### 5. SignatureStep Cast (Test)

**File:** `sdk/src/react/hooks/transactions/useProcessStep.test.tsx:301`
```typescript
} as unknown as SignatureStep;
```

**Assessment:** ✅ Acceptable in test file for creating mock

---

#### 6. Hook Return Type Mocking (Tests - 6 occurrences)

**Files:** Multiple test files
```typescript
} as unknown as ReturnType<typeof useAccount>);
} as unknown as ReturnType<typeof useMarketplaceConfig>);
} as unknown as ReturnType<typeof useCollectibleMarketLowestListing>;
} as unknown as ReturnType<typeof useCurrencyComparePrices>;
```

**Assessment:** ✅ Acceptable in tests, but could use typed factories:

```typescript
// test/mocks/hooks.ts
export function createMockUseAccountReturn(
  overrides?: Partial<ReturnType<typeof useAccount>>
): ReturnType<typeof useAccount> {
  return {
    address: undefined,
    isConnected: false,
    // ... all properties
    ...overrides
  };
}
```

---

#### 7. DatabeatAnalytics Mocking (Tests - 3 occurrences)

```typescript
} as unknown as DatabeatAnalytics;
```

**Assessment:** ✅ Acceptable in tests

**Fix:** Create typed mock in test setup:
```typescript
// test/mocks/databeat.ts
export const mockDatabeatAnalytics: DatabeatAnalytics = {
  track: vi.fn(),
  // ... all required methods
};
```

---

### Summary: Double Cast Impact

| Location | Severity | Fix Priority | Estimated Effort |
|----------|----------|--------------|------------------|
| ChainId lookup | 🔴 High | P1 | Low |
| Event types | 🟡 Medium | P2 | Low |
| TokenMetadata | 🔴 High | P1 | Medium (part of metadata fix) |
| Date object | 🟡 Medium | P2 | Low |
| Test mocks | 🟢 Low | P3 | Medium (create factories) |

**Total production double casts to fix:** 4 (out of 9)  
**Potential impact:** Eliminates 4 dangerous double casts, adds runtime safety

---

## Category 3: Domain Type Casts

### 3.1 Address Casts (74 occurrences)

Address casting is the **most common pattern**, indicating issues with type narrowing from `string` to viem's `Address` type (`0x${string}`).

**Distribution:**
- Test files: ~48 occurrences (string literals like `'0x1234...' as Address`)
- Production: ~26 occurrences

#### Production Code Patterns:

**Pattern 1: Optional property narrowing (8 occurrences)**
```typescript
// From various files
currencyAddress: lowestListing?.priceCurrencyAddress as Address,
currencyAddress: primarySaleItem.currencyAddress as Address,
currencyAddress: salePrice?.currencyAddress as Address,
```

**Why needed:** API returns `string | undefined`, code needs `Address`

**Fix:** Add proper null handling:
```typescript
import { zeroAddress, isAddress } from 'viem';

// Option 1: Use zero address as default
currencyAddress: (lowestListing?.priceCurrencyAddress as Address) ?? zeroAddress,

// Option 2: Validate and throw
if (!lowestListing?.priceCurrencyAddress) {
  throw new Error('Currency address is required');
}
if (!isAddress(lowestListing.priceCurrencyAddress)) {
  throw new Error('Invalid currency address');
}
const currencyAddress = lowestListing.priceCurrencyAddress;

// Option 3: Make component handle undefined
currencyAddress: lowestListing?.priceCurrencyAddress as Address | undefined,
```

**Impact:** 8 casts - can eliminate with proper null handling

---

**Pattern 2: Wagmi hook address narrowing (4 occurrences)**
```typescript
// market-checkout-options.tsx, primary-sale-checkout-options.tsx
walletAddress: address as Address,
```

**Why needed:** `useAccount()` returns `address: string | undefined`, needs `Address`

**Current code pattern:**
```typescript
const { address } = useAccount();
// ...
walletAddress: address as Address,
```

**Fix:** Add proper validation:
```typescript
const { address } = useAccount();

if (!address) {
  throw new Error('Wallet not connected');
}
// TypeScript should now know address is non-undefined string
// But we still need to assert it's a valid address format

if (!isAddress(address)) {
  throw new Error('Invalid wallet address');
}
const walletAddress = address; // Now properly typed as Address
```

**Impact:** 4 casts - eliminate with validation, add runtime safety

---

**Pattern 3: Store initialization (6 occurrences)**
```typescript
// Various modal stores
collectionAddress: '0x0000000000000000000000000000000000000000' as Address,
collectionAddress: '0x' as Hex,
```

**Why needed:** Store needs default value

**Fix:** Use viem constants:
```typescript
import { zeroAddress } from 'viem';

collectionAddress: zeroAddress, // Already typed as Address
```

**Impact:** 6 casts - eliminate with viem constants

---

**Pattern 4: Component property passing (8 occurrences)**
```typescript
collectionAddress: collectionAddress as Address,
receiverAddress: receiverAddress as Address,
```

**Why needed:** Store/prop has `string` type, component expects `Address`

**Fix:** Update store/prop types:
```typescript
import type { Address } from 'viem';

// In store definition
interface ModalState {
  collectionAddress: Address;
  // ...
}

// Initialize with zero address
const initialState: ModalState = {
  collectionAddress: zeroAddress,
  // ...
};
```

**Impact:** 8 casts - eliminate by fixing types at source

---

**Test File Address Patterns:**

26 test files use address literals:
```typescript
const mockAccountAddress = '0x742d35Cc6634C0532925a3b8D4C9db96' as Address;
'0x1234567890123456789012345678901234567890' as Address
```

**Fix:** Create test constants:
```typescript
// test/constants.ts
import type { Address } from 'viem';

export const TEST_ADDRESSES = {
  ALICE: '0x1234567890123456789012345678901234567890' as Address,
  BOB: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address,
  CONTRACT: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
  ZERO: '0x0000000000000000000000000000000000000000' as Address,
} as const;

// Usage
const mockAccountAddress = TEST_ADDRESSES.ALICE;
```

**Impact:** Centralizes test addresses, reduces duplication

---

### Address Cast Summary

| Pattern | Production | Tests | Fix Priority |
|---------|------------|-------|--------------|
| Optional property | 8 | 0 | P1 |
| Wagmi hooks | 4 | 0 | P1 |
| Store init | 6 | 0 | P1 |
| Prop passing | 8 | 0 | P2 |
| Test literals | 0 | 48 | P3 |
| **Total** | **26** | **48** | - |

**Production fix potential:** Can eliminate 18 casts with P1 fixes (69%)

---

### 3.2 Error Casts (24 occurrences)

All error casts follow the same pattern:
```typescript
catch (error: unknown) {
  callback(error as Error);
}
```

**Why needed:** TypeScript 4.4+ types catch clause errors as `unknown` for safety.

**Distribution:**
- Transaction hooks: 12 occurrences
- Modal error handlers: 8 occurrences
- Utility functions: 4 occurrences

**Current pattern is mostly acceptable**, but could be more robust:

**Better pattern:**
```typescript
catch (error: unknown) {
  const err = error instanceof Error 
    ? error 
    : new Error(String(error));
  callback(err);
}

// Or create a utility
function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

catch (error: unknown) {
  callback(toError(error));
}
```

**Assessment:** 🟢 Low priority - current usage is reasonable, improvements are marginal

**Impact:** Could eliminate 24 casts, add runtime safety for non-Error throws

---

### 3.3 Hash/Hex Casts (8 occurrences)

**Pattern 1: Transaction hash returns (3 occurrences)**
```typescript
callbacks?.onSuccess?.({ hash: txHash as Hash });
```

**Why needed:** Wagmi may return `0x${string}` which needs explicit `Hash` type

**Assessment:** ✅ Generally safe - Hash is just a branded type

**Improvement:**
```typescript
import { isHash } from 'viem';

if (!isHash(txHash)) {
  throw new Error('Invalid transaction hash');
}
callbacks?.onSuccess?.({ hash: txHash }); // No cast needed
```

**Priority:** 🟢 Low - current code works, validation adds safety

---

**Pattern 2: Step data (3 occurrences)**
```typescript
txData: buyStep.data as Hex,
decodeERC20Approval(approveStep.data as Hex)
```

**Why needed:** Step.data type may be broader than `Hex`

**Check:** Review previous audit - was this fixed in API layer?

**If not fixed:**
```typescript
import { isHex } from 'viem';

if (!isHex(buyStep.data)) {
  throw new Error('Invalid transaction data');
}
const txData = buyStep.data;
```

---

**Pattern 3: Hex literals (2 occurrences)**
```typescript
const DEFAULT_PROOF = [toHex(0, { size: 32 })] as Hex[];
collectionAddress: '0x' as Hex,
```

**Assessment:** ✅ Safe - literals are correct format

**Improvement:**
```typescript
const DEFAULT_PROOF = [toHex(0, { size: 32 })] as const satisfies readonly Hex[];
```

---

### 3.4 Step/Order/ContractType Casts (~18 occurrences)

**Pattern 1: FeeOption casts (4 occurrences)**
```typescript
selectedFeeOption: selectedFeeOption as FeeOption,
```

**Why needed:** Store has `FeeOption | undefined`, component requires `FeeOption`

**Fix:** Validate before use:
```typescript
if (!selectedFeeOption) {
  throw new Error('Please select a fee option');
}
// Use selectedFeeOption directly, no cast needed
```

**Impact:** 4 casts eliminated

---

**Pattern 2: ContractType from query (4 occurrences)**
```typescript
contractType: collectionQuery.data?.type as ContractType,
collectionType={collectionType as ContractType}
```

**Why needed:** Optional chaining makes type `string | undefined`

**Fix:** Validate data exists:
```typescript
if (!collectionQuery.data?.type) {
  return null; // or loading state
}
const contractType = collectionQuery.data.type;
```

**Impact:** 4 casts eliminated

---

**Pattern 3: Order casts (3 occurrences)**
```typescript
order: order as Order,
onOfferClick?.({ order: highestOffer as Order, e })
```

**Why needed:** Data may be partial or different order type

**Fix:** Create type guard:
```typescript
function isOrder(value: unknown): value is Order {
  return (
    typeof value === 'object' && 
    value !== null && 
    'orderId' in value &&
    'tokenId' in value
  );
}

if (!isOrder(order)) {
  throw new Error('Invalid order data');
}
```

**Impact:** 3 casts eliminated, runtime validation added

---

**Pattern 4: Step type narrowing (7 occurrences)**
```typescript
const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
```

**Why needed:** Array.find returns `Step | undefined`

**Fix:** Type guard + validation:
```typescript
function isSellStep(step: Step | undefined): step is SellStep {
  return step?.id === 'sell';
}

const sellStep = flow.steps.find((s) => s.id === 'sell');
if (!isSellStep(sellStep)) {
  throw new Error('Sell step not found in transaction flow');
}
// Use sellStep, no cast needed
```

**Impact:** 7 casts eliminated, runtime safety added

---

## Category 4: 'as const' Assertions (118 occurrences)

✅ **These are type-safe and beneficial.** No fixes needed.

### Usage breakdown:

1. **Query keys** (~80 occurrences)
   ```typescript
   return ['currency', 'compare-prices', apiArgs] as const;
   ```
   ✅ Best practice for React Query - creates immutable tuple type

2. **ABI definitions** (5 occurrences)
   ```typescript
   ] as const;
   ```
   ✅ Required by wagmi/viem

3. **State literals** (~20 occurrences)
   ```typescript
   modalState: 'opening' as const,
   variant: 'secondary' as const,
   ```
   ✅ Creates literal types instead of broader string

4. **Const objects** (~10 occurrences)
   ```typescript
   } as const;
   ```
   ✅ Makes objects deeply readonly

5. **Test data** (~3 occurrences)
   ```typescript
   type: 'ERC1155' as const,
   ```
   ✅ Ensures exact type

---

## Category 5: Other Type Casts

### 5.1 Type Alias Casts (Import renames)

✅ **These are safe** - just renaming for API clarity:
```typescript
export * as BuilderMocks from '@0xsequence/marketplace-api/mocks/builder';
import { IndexerContractInfo as ContractInfo } from '...';
import type { UseCollectibleMetadataParams as UseCollectibleDetailParams } from '...';
```

---

### 5.2 Generic Return Type Casts

**File:** `sdk/src/react/_internal/utils.ts:20,24,34`
```typescript
export function serializeBigInts<T>(obj: T): T {
  if (typeof obj === 'bigint') {
    return obj.toString() as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts) as T;
  }
  // ...
  return result as T;
}
```

**Why needed:** TypeScript can't track type transformation through recursion

**Assessment:** ✅ Acceptable - utility function with clear contract

---

### 5.3 Context Default Value

**File:** `sdk/src/react/providers/index.tsx:18`
```typescript
export const MarketplaceSdkContext = createContext(
  {} as MarketplaceSdkContextType,
);
```

**Assessment:** ✅ Standard React pattern - context always provided by provider

---

### 5.4 Query Builder Generic Casts

**File:** `sdk/src/react/_internal/query-builder.ts:178,227,229`
```typescript
return config.fetcher(params as TParams);
```

**Why needed:** Runtime validation ensures params match, TypeScript can't track

**Assessment:** ✅ Acceptable - logic validates before cast

---

## Recommendations

### Priority 1: Quick Wins (1-2 hours)

**Target:** Eliminate all 13 production 'as any' casts

1. ✅ **Fix metadata type issues** (5 casts)
   - Update TokenMetadata interface or create PrimarySaleTokenMetadata
   - File: `primary-sale-721-card-data.tsx:172-176`
   - **Effort:** 30 mins
   - **Impact:** HIGH - fixes type contract

2. ✅ **Fix Currency status enum** (2 casts)
   - Import and use CurrencyStatus enum
   - Files: `CreateListingModal/store.ts:41`, `MakeOfferModal/store.ts:38`
   - **Effort:** 5 mins
   - **Impact:** MEDIUM

3. ✅ **Fix error property access** (2 casts)
   - Create type guards for HttpError and error.code
   - Files: `getWagmiErrorMessage.ts:113`, `getErrorMessage.ts:13`
   - **Effort:** 15 mins
   - **Impact:** MEDIUM

4. ✅ **Fix marketplace type** (2 casts)
   - Investigate and document proper marketplace type
   - File: `NonOwnerActions.tsx:85,123`
   - **Effort:** 20 mins
   - **Impact:** MEDIUM

5. ✅ **Document query data accumulation** (2 casts)
   - Add explanatory comments or refactor with Object.fromEntries
   - File: `ActionModal.tsx:104,117`
   - **Effort:** 10 mins
   - **Impact:** LOW - code works, just clarity

**Total P1 effort:** ~80 minutes  
**Total P1 impact:** Eliminates 13/13 production 'as any' casts (100%)

---

### Priority 2: Medium Impact (4-6 hours)

**Target:** Reduce Address casts by 70%

1. **Create Address validation utilities**
   ```typescript
   // utils/address.ts
   export function requireAddress(
     value: string | undefined,
     errorMsg = 'Address is required'
   ): Address {
     if (!value) throw new Error(errorMsg);
     if (!isAddress(value)) throw new Error('Invalid address format');
     return value;
   }
   
   export function addressOrZero(value: string | undefined): Address {
     if (!value || !isAddress(value)) return zeroAddress;
     return value;
   }
   ```
   **Effort:** 30 mins

2. **Fix store type definitions** (6 casts)
   - Update all modal stores to use `Address` type
   - Use `zeroAddress` for initialization
   - **Effort:** 1 hour
   - **Impact:** Eliminates 6 casts

3. **Fix wagmi address handling** (4 casts)
   - Add validation before using `useAccount().address`
   - Create `useValidatedAddress()` hook
   - **Effort:** 45 mins
   - **Impact:** Eliminates 4 casts + adds safety

4. **Fix optional property narrowing** (8 casts)
   - Add proper null checks or use `addressOrZero` utility
   - **Effort:** 1 hour  
   - **Impact:** Eliminates 8 casts

5. **Fix double casts** (4 production)
   - ChainId lookup, event types, date handling
   - **Effort:** 1 hour
   - **Impact:** HIGH - eliminates dangerous casts

**Total P2 effort:** ~4.5 hours  
**Total P2 impact:** Eliminates ~22 production casts, adds runtime safety

---

### Priority 3: Long-term Quality (8-12 hours)

**Target:** Improve test code quality, eliminate remaining casts

1. **Create test mock factories** (69 test 'as any')
   - Build factories for Order, FeeOption, Step, etc.
   - Centralize test constants
   - **Effort:** 4 hours
   - **Impact:** Eliminates 35+ test casts, improves maintainability

2. **Create typed test utilities**
   - Hook return mocks
   - Databeat analytics mock
   - **Effort:** 2 hours
   - **Impact:** Eliminates 10+ test double casts

3. **Fix step type narrowing** (7 casts)
   - Create type guards for each step type
   - Add runtime validation
   - **Effort:** 2 hours
   - **Impact:** Eliminates 7 casts + safety

4. **Improve error handling** (24 casts)
   - Create `toError()` utility
   - Use throughout codebase
   - **Effort:** 1 hour
   - **Impact:** Eliminates 24 casts (marginal safety gain)

5. **Fix FeeOption/ContractType casts** (8 casts)
   - Add validation before using optional values
   - **Effort:** 1 hour
   - **Impact:** Eliminates 8 casts

**Total P3 effort:** ~10 hours  
**Total P3 impact:** Eliminates ~84 casts, significantly improves code quality

---

## Impact Summary

### Current State
- **Total casts:** ~304
- **Problematic casts:** ~186 (excluding 'as const')
  - Production 'as any': 13
  - Test 'as any': 69
  - Double casts: 20
  - Address casts: 74
  - Other domain casts: 10

### After Priority 1 (80 mins)
- **Production 'as any':** 13 → 0 ✅
- **Total reduction:** 13 casts
- **Status:** ALL production 'as any' eliminated

### After Priority 2 (+ 4.5 hours)
- **Double casts:** 20 → 16 (production: 9 → 5)
- **Address casts:** 74 → 52 (production: 26 → 8)
- **Total reduction:** +22 casts (35 total)
- **Status:** Major safety improvements

### After Priority 3 (+ 10 hours)
- **Test 'as any':** 69 → 35
- **Address casts:** 52 → 27
- **Other casts:** ~60 → ~20
- **Total reduction:** +84 casts (119 total)
- **Status:** High-quality, maintainable codebase

### Final Projected State

| Category | Current | After All | Reduction |
|----------|---------|-----------|-----------|
| Production 'as any' | 13 | 0 | 100% |
| Test 'as any' | 69 | 35 | 49% |
| Double casts | 20 | 16 | 20% |
| Address casts | 74 | 27 | 64% |
| Error casts | 24 | 0 | 100% |
| Other domain | 88 | 40 | 55% |
| **Total problematic** | **288** | **118** | **59%** |

**'as const' assertions:** 118 (unchanged - these are good!)

---

## Patterns to Adopt

### 1. Address Validation
```typescript
// ❌ Bad
const addr = someString as Address;

// ✅ Good
import { isAddress, zeroAddress } from 'viem';

function requireAddress(value: string | undefined): Address {
  if (!value || !isAddress(value)) {
    throw new Error('Invalid address');
  }
  return value;
}

const addr = requireAddress(someString);
```

### 2. Optional Narrowing
```typescript
// ❌ Bad
const addr = data?.address as Address;

// ✅ Good
if (!data?.address) {
  return null; // or throw, or use default
}
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
if (!isSellStep(step)) {
  throw new Error('Sell step not found');
}
```

### 5. Test Factories
```typescript
// ❌ Bad
const mock = { tokenId: 1n, quantity: 1n } as any;

// ✅ Good
function createMockOrder(overrides?: Partial<Order>): Order {
  return {
    orderId: '123',
    tokenId: 1n,
    quantity: 1n,
    // ... all fields
    ...overrides
  };
}

const mock = createMockOrder({ tokenId: 1n });
```

---

## Conclusion

The SDK demonstrates **strong type safety in production code** with only 13 'as any' casts. Previous work successfully eliminated API-layer type issues.

### Key Strengths
1. ✅ Good use of 'as const' for literal types
2. ✅ Previous API layer fixes eliminated major issues
3. ✅ Test coverage includes edge cases (hence test casts)

### Remaining Opportunities
1. **Priority 1** can eliminate ALL production 'as any' in ~1 hour
2. **Priority 2** reduces dangerous double casts and adds safety in ~4.5 hours
3. **Priority 3** improves long-term maintainability in ~10 hours

### Recommended Approach

**Week 1:** Complete Priority 1 (80 mins)
- Immediate impact: 100% of production 'as any' eliminated
- Low effort, high value

**Week 2:** Complete Priority 2 (4.5 hours)
- Major safety improvements
- Establishes patterns for future code

**Ongoing:** Priority 3 tasks as time permits
- Improves test quality
- Reduces technical debt
- Better developer experience

**Total investment:** ~15 hours for ~60% reduction in problematic casts + significantly improved type safety.
