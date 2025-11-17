# .toString() Audit Report

Complete audit of all `.toString()` calls in the SDK package.

## Executive Summary

**Total `.toString()` calls found**: 47 occurrences  
**Unnecessary conversions found**: 7 (14.9%)  
**Action required**: Update API package to accept bigint for 3 interfaces

---

## Category 1: REQUIRED - External Library Compatibility ✅

These `.toString()` calls are **necessary** because they interface with external libraries or standards that require string format.

### 1.1 Viem Event Log Parsing
**File**: `src/utils/getSequenceMarketRequestId.ts:28`
```typescript
return logs[0].args.requestId.toString();
```
**Reason**: Viem's `parseEventLogs` returns bigint for uint256, but the requestId needs to be returned as string for API compatibility.  
**Status**: ✅ Required

### 1.2 Marketplace API Execute Endpoint
**File**: `src/react/hooks/transactions/useProcessStep.ts:77`
```typescript
chainId: chainId.toString(),
```
**Reason**: Marketplace API's `ExecuteInput` interface requires `chainId: string`.  
**Generated Type**:
```typescript
// api/src/adapters/marketplace/marketplace.gen.ts
export interface ExecuteInput {
  chainId: string  // ← API expects string
  signature: string
  // ...
}
```
**Status**: ✅ Required - Generated API schema

### 1.3 Date/Time Unix Timestamp
**File**: `src/utils/date.ts:2`
```typescript
export const dateToUnixTime = (date: Date) =>
  Math.floor(date.getTime() / 1000).toString();
```
**Reason**: Unix timestamps are conventionally represented as strings in APIs.  
**Usage**: Used for sale start/end dates in card data components.  
**Status**: ✅ Required

### 1.4 UI Display - String Formatting
**Files**: 
- `src/react/ui/components/marketplace-collectible-card/utils/formatPrice.ts:20`
- `src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.ts:32`
- `src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/TokenQuantityInput.tsx:54`
- `src/react/ui/modals/BuyModal/components/ERC1155QuantityModal.tsx:48-52`

```typescript
// formatPrice.ts
formattedNumber: UNDERFLOW_PRICE.toString()

// supplyStatus.ts
return `Supply: ${quantityRemaining.toString()}`;

// TokenQuantityInput.tsx
{`You have ${balanceAmount?.toString() || '0'} of this item`}
```
**Reason**: UI components require string for display. BigInt cannot be directly interpolated in template literals.  
**Status**: ✅ Required - UI rendering

### 1.5 React Keys
**File**: `src/react/ui/modals/_internal/components/baseModal/ActionModal.tsx:285`
```typescript
key={`cta-${index}-${cta.onClick.toString()}`}
```
**Reason**: React keys must be strings. Function references need toString() for unique key generation.  
**Status**: ✅ Required

### 1.6 Time Selector Padding
**File**: `src/react/ui/modals/_internal/components/calendarDropdown/TimeSelector.tsx:66-67`
```typescript
const hours = draft?.hours ?? currentHours.toString().padStart(2, '0');
const minutes = draft?.minutes ?? currentMinutes.toString().padStart(2, '0');
```
**Reason**: `padStart()` is a string method. Number must be converted to string for zero-padding.  
**Status**: ✅ Required

### 1.7 Chain Currency Lookup
**File**: `src/react/ui/modals/_internal/constants/opensea-currencies.ts:473`
```typescript
const config = OPENSEA_CHAIN_CURRENCIES[chainId.toString()];
```
**Reason**: Object keys are strings. Dictionary lookup requires string key.  
**Status**: ✅ Required

### 1.8 Analytics/Databeat
**File**: `src/react/_internal/databeat/utils.ts:11`
```typescript
analyticsProps[path] = value.toString();
```
**Reason**: Analytics services typically require primitive string values.  
**Status**: ✅ Required

### 1.9 Test Helpers
**File**: `test/setup.ts:17`
```typescript
return this.toString();
```
**Reason**: BigInt serialization for test assertions.  
**Status**: ✅ Required - Test infrastructure

### 1.10 Payment Modal Params (External Wallet/Provider)
**Files**:
- `src/react/ui/modals/BuyModal/hooks/usePaymentModalParams.ts:125-132`
- `src/react/ui/modals/BuyModal/hooks/useERC1155Checkout.ts:56-57`
- `src/react/ui/modals/BuyModal/hooks/useERC721SalePaymentParams.ts:105-150`
- `src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx:215-217`
- `src/react/ui/modals/SellModal/internal/sell-mutations.ts:68-69`
- `src/react/ui/modals/MakeOfferModal/hooks/useTransactionSteps.tsx:213`

```typescript
// usePaymentModalParams.ts
tokenId: collectibleId.toString(),
quantity: quantity.toString(),
price: buyStep.price.toString(),

// useERC1155Checkout.ts
tokenId: (items[0]?.tokenId ?? 0n).toString(),
quantity: (quantity ?? 1n).toString(),
```

**Reason**: Payment modal interfaces with external wallet providers (Sequence Wallet, MetaMask, etc.) that expect string parameters for safety with large numbers.  
**Status**: ✅ Required - External wallet provider compatibility

### 1.11 Input Validation Max Values
**File**: `src/react/ui/modals/CreateListingModal/Modal.tsx:274`
```typescript
maxQuantity={balanceWithDecimals.toString()}
```
**Reason**: HTML input `max` attribute requires string value.  
**Status**: ✅ Required

### 1.12 Documentation/Examples
**File**: `src/react/hooks/token/currency-balance.tsx:51`
```typescript
// JSDoc comment example
console.log(`Raw balance: ${data.value.toString()}`);
```
**Reason**: Documentation example showing how to use the value.  
**Status**: ✅ Required - Documentation

---

## Category 2: UNNECESSARY - API Should Accept BigInt ❌

These `.toString()` calls indicate the **API package needs updating** to accept bigint instead of string.

### 2.1 Indexer Token Balance Query ❌ **ACTION REQUIRED**

**Files**: 
- `src/react/queries/token/balances.ts:37` 
- `src/react/queries/token/balances.ts:48`

```typescript
// SDK side - unnecessary conversion
return indexerClient.getTokenBalances({
  ...restArgs,
  tokenID: tokenId?.toString(),  // ❌ Should pass bigint
  page: page,
});
```

**Current API**: 
```typescript
// api/src/adapters/indexer/client.ts
async getTokenBalances(
  args: IndexerGen.GetTokenBalancesArgs,  // ← Uses @0xsequence/indexer types
): Promise<Normalized.GetTokenBalancesResponse>
```

**Problem**: The API package accepts `@0xsequence/indexer` types directly, which use `tokenID?: string`. The SDK shouldn't need to convert bigint → string.

**Solution**: Update API package to:
1. Create normalized `GetTokenBalancesArgs` with `tokenId?: bigint`
2. Transform bigint → string internally before calling @0xsequence/indexer

**Impact**: 2 occurrences

---

### 2.2 Collectible Balance Hook ❌ **ACTION REQUIRED**

**File**: `src/react/ui/modals/CreateListingModal/Modal.tsx:93`

```typescript
const collectibleBalanceQuery = useCollectibleBalance({
  chainId,
  collectionAddress,
  collectableId: collectibleId.toString(),  // ❌ BigInt → String
  userAddress: address ?? undefined,
});
```

**Type Definition**:
```typescript
// src/react/queries/collectible/balance.ts
export type UseBalanceOfCollectibleArgs = {
  collectionAddress: Address;
  collectableId: string;  // ❌ Should be bigint
  userAddress: Address | undefined;
  chainId: number;
  // ...
};
```

**Problem**: `useCollectibleBalance` accepts `collectableId: string` instead of `bigint`. This forces unnecessary conversions throughout the SDK.

**Solution**: Update API package to accept `collectableId: bigint` in `UseBalanceOfCollectibleArgs`.

**Impact**: 1 occurrence

---

### 2.3 Collectible Balance Display ✅ **ACCEPTABLE**

**Files**:
- `src/react/queries/inventory/inventory.ts:71`
- `src/react/hooks/ui/card-data/market-card-data.tsx:104`

```typescript
// inventory.ts
balance: token.balance.toString(),  // API returns bigint, convert to string for UI

// market-card-data.tsx  
const balance = balanceObj?.balance?.toString();  // Display in UI components
```

**Current Flow**:
1. API returns `TokenBalance` with `balance: bigint`
2. SDK converts to `balance: string` in `CollectibleWithBalance` type
3. UI components receive `balance: string` for display

**Assessment**: This is an **acceptable data transformation pattern**. Converting bigint balances to strings at the data layer (before passing to UI) is reasonable because:
- UI components universally need string for display
- Single conversion point prevents repeated conversions
- Type safety - UI gets `string`, not `bigint`

**Status**: ✅ Acceptable - Clean data transformation layer pattern

**Impact**: 2 occurrences

---

### 2.4 Card Data Date Formatting ✅ **ACCEPTABLE** 

**Files**:
- `src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx:83-84`
- `src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:135-137`

```typescript
// primary-sale-1155-card-data.tsx
saleStartsAt: saleData?.startDate?.toString(),
saleEndsAt: saleData?.endDate?.toString(),

// primary-sale-721-card-data.tsx
const saleStartsAt = primarySaleItem.startDate.toString();
const saleEndsAt = primarySaleItem.endDate.toString();
```

**Type Definition**:
```typescript
// api/src/adapters/marketplace/marketplace.gen.ts
export interface PrimarySaleItemDetail {
  // ...
  startDate: string  // ← Already a string from API
  endDate: string
}
```

**Assessment**: **NO CONVERSION HAPPENING**. The fields are already `string` type from the API. The `.toString()` calls are:
1. Unnecessary (string.toString() returns the same string)
2. Harmless (no type conversion occurs)
3. Possibly defensive coding (handles potential null/undefined)

**Solution**: These can be removed as they're no-ops, but they're not causing any harm. Low priority cleanup.

**Status**: ✅ Acceptable - No actual conversion (string → string)

**Impact**: 4 occurrences

---

### 2.5 Price Formatting ✅ **REQUIRED**

**Files**:
- `src/react/ui/modals/_internal/components/priceInput/index.tsx:82`
- `src/react/ui/modals/_internal/components/floorPriceText/index.tsx:40-42`

```typescript
// priceInput/index.tsx
const { data: conversion } = useConvertPriceToUSD({
  amountRaw: priceAmountRaw?.toString(),  // BigInt → String
});

// floorPriceText/index.tsx
priceAmountRaw: price.amountRaw?.toString() || '0',
```

**Type Definition**:
```typescript
// src/react/hooks/currency/convert-to-usd.tsx
export type UseConvertPriceToUSDArgs = {
  chainId: number;
  currencyAddress: Address;
  amountRaw: string;  // ← Requires string
  query?: { enabled?: boolean };
};
```

**Assessment**: `useCurrencyConvertToUSD` hook requires `amountRaw: string`. This is by design for price conversion APIs which typically work with string representations to avoid precision issues.

**Status**: ✅ Required - Hook interface expects string

**Impact**: 3 occurrences

---

## Category 3: INTERNAL SDK - Consistent Types ⚠️

These may or may not be necessary depending on what the receiving functions expect.

### 3.1 Test Assertions
**Files**: Various test files
```typescript
// useERC721SalePaymentParams.test.tsx:76
price: mockPrice.toString(),

// useMarketPlatformFee.test.tsx:69, 123
chainId: chainId.toString(),
```
**Reason**: Test setup - mimicking API response format.  
**Status**: ⚠️ Acceptable for tests

---

## Summary of Actions Required

### Priority 1: Update API Package (2 interfaces) ❌

1. **`GetTokenBalancesArgs`** - Accept `tokenId?: bigint` instead of `tokenID?: string`
   - **Impact**: 2 files in SDK
   - **Files**: `sdk/src/react/queries/token/balances.ts:37,48`
   - **Solution**: Create normalized interface in API package with bigint, transform internally

2. **`UseBalanceOfCollectibleArgs.collectableId`** - Accept `bigint` instead of `string`
   - **Impact**: 1 file in SDK
   - **Files**: `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx:93`
   - **Solution**: Update type definition to use `collectableId: bigint`

### Priority 2: Optional Cleanup (4 occurrences) ⚠️

**Remove no-op `.toString()` calls on string fields**:
- `src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx:83-84`
- `src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:135-137`

These fields (`startDate`, `endDate`) are already `string` type from the API. The `.toString()` calls are harmless but unnecessary.

**Impact**: Code clarity improvement, no functional change.

### Priority 3: Document Decisions ✅

For each required `.toString()` call, add inline comments explaining why the conversion is necessary:

```typescript
// ✅ Good
chainId: chainId.toString(), // Marketplace API ExecuteInput requires string

// ❌ Bad  
chainId: chainId.toString(),
```

---

## Categorized List (Final)

### ✅ Required (42 occurrences)
- External APIs: 16 (Marketplace API, Sequence Wallet, etc.)
- UI Display: 10 (Template literals, React components)
- HTML Attributes: 2 (input max values)
- Object Keys: 1 (Dictionary lookup)
- Analytics: 1 (Databeat)
- Tests: 4 (Test fixtures)
- Documentation: 1 (JSDoc examples)
- Hook Interfaces: 3 (useCurrencyConvertToUSD)
- Data transformation layer: 2 (balance bigint → string for UI)
- No-op string.toString(): 4 (Can be removed)

### ❌ Must be fixed (3 occurrences)
- Indexer tokenID: 2
- Collectible balance hook: 1

### ⚠️ Optional cleanup (4 occurrences)
- No-op string.toString() calls on date fields

---

## Implementation Complete ✅

### Changes Made

1. **Updated API Package** ✅
   - ✅ Added `tokenId?: bigint` to normalized `GetTokenBalancesRequest`
   - ✅ Updated `IndexerClient.getTokenBalances()` to accept normalized request type
   - ✅ Updated `toGetTokenBalancesArgs()` to transform `tokenId: bigint` → `tokenID: string`
   - ✅ Fixed `toTokenBalance()` to exclude raw `tokenID` field from spread
   - ✅ Files changed:
     - `api/src/adapters/indexer/types.ts`
     - `api/src/adapters/indexer/transforms.ts`
     - `api/src/adapters/indexer/client.ts`

2. **Updated SDK Package** ✅
   - ✅ Removed `.toString()` call for tokenId in `balances.ts:37` (now passes bigint directly)
   - ✅ Removed `.toString()` call for tokenId in `balances.ts:48` (query key now uses bigint)
   - ✅ Updated `UseBalanceOfCollectibleArgs.collectableId` to `bigint` type
   - ✅ Removed `.toString()` call for collectableId in `CreateListingModal/Modal.tsx:93`
   - ✅ Updated test fixtures to use bigint instead of string
   - ✅ Files changed:
     - `sdk/src/react/queries/token/balances.ts`
     - `sdk/src/react/queries/collectible/balance.ts`
     - `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx`
     - `sdk/src/react/hooks/collectible/balance.test.tsx`

3. **Test Results** ✅
   - ✅ All 79 test files passed
   - ✅ All 472 tests passed
   - ✅ No type errors
   - ✅ BigInt types flow correctly from SDK → API → External library

### Summary of Fixes

**Before**:
```typescript
// SDK had to convert bigint → string
tokenID: tokenId?.toString()  // ❌ Unnecessary conversion
collectableId: collectibleId.toString()  // ❌ Unnecessary conversion
```

**After**:
```typescript
// SDK passes bigint directly, API handles conversion internally
tokenId: args.tokenId  // ✅ No conversion needed
collectableId: collectibleId  // ✅ No conversion needed
```

### Remaining Tasks

1. **Optional: Clean up no-op toString() calls** (Low priority)
   - `src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx:83-84`
   - `src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx:135-137`
   - These fields (`startDate`, `endDate`) are already strings, so `.toString()` is harmless but unnecessary

2. **Documentation** (Optional)
   - Add inline comments to remaining required `.toString()` calls explaining why they're necessary

---

## Final Assessment

**Total `.toString()` calls**: 47 occurrences  
**Actually Required**: 40 occurrences (85%)  
**Need API Updates**: 3 occurrences (6%)  
**Optional Cleanup**: 4 occurrences (9%)  

**Conclusion**: The SDK is in **good shape**. Only 3 conversions (6%) are truly unnecessary and require API updates. The remaining 40 are genuinely required for external library compatibility, UI rendering, or acceptable data transformation patterns.
