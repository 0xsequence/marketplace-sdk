# Knip Audit Summary - Adapter Code

**Date:** 2025-11-17  
**Status:** ✅ Main issue fixed, cleanup recommended

---

## What We Found

Knip identified **9 unused exports** in the adapter code:
- 4 unused transform utilities
- 5 response types that **should have been exported**

---

## What We Fixed ✅

### Response Types Now Properly Exported

**Problem:** The 5 enhanced response types with discriminated Step unions were defined but not exported from `index.ts`

**Impact:** 
- Consumers couldn't use explicit type annotations
- Lost the benefits of the enhanced discriminated union types
- Knip flagged them as unused (false positive)

**Solution Applied:**

1. **Added exports to `index.ts`:**
```typescript
export type {
  GenerateBuyTransactionResponse,     // Enhanced with better Step types
  GenerateCancelTransactionResponse,  // Enhanced with better Step types
  GenerateListingTransactionResponse, // Enhanced with better Step types
  GenerateOfferTransactionResponse,   // Enhanced with better Step types
  GenerateSellTransactionResponse,    // Enhanced with better Step types
} from './client';
```

2. **Added comprehensive JSDoc to `client.ts`:**
```typescript
/**
 * Enhanced response types with discriminated Step unions (SDK-facing)
 *
 * Benefits over generated types:
 * - Type-safe discrimination by step.id
 * - Guaranteed post field on signature steps
 * - Separate TransactionStep and SignatureStep types
 * - Better IDE autocomplete and type narrowing
 */
```

**Result:** ✅ Knip no longer flags these as unused

---

## What's Left To Do ⏳

### 4 Unused Transform Utilities

These functions in `api/src/utils/transform.ts` are never used:

| Function | Lines | Purpose |
|----------|-------|---------|
| `transformField()` | 25-38 | Single field transformation |
| `transformFields()` | 52-78 | Multi-field transformation |
| `deepTransform()` | 161-191 | Deep path transformation |
| `compose()` | 202-206 | Function composition |

**Why They're Unused:**
- Created during Phase 1 refactoring as "might be useful" utilities
- Refactoring proved simpler patterns were sufficient
- All adapters use `spreadWith()`, `transformArray()`, etc. instead

**Recommendation:** Remove them
- Saves ~80 lines of code
- Reduces bundle by ~0.5KB
- No breaking changes (never used anywhere)
- Cleaner, more maintainable codebase

---

## Type Safety Improvement Details

### Before vs After: Step Types

**Generated Type (marketplace.gen.ts):**
```typescript
export interface Step {
  id: StepType
  data: string
  to: string
  value: bigint
  price: bigint
  signature?: Signature
  post?: PostRequest
  executeType?: ExecuteType
}
```

**Enhanced Type (types.ts):**
```typescript
export type Step = SignatureStep | TransactionStep;

export type SignatureStep = StepBase & {
  id: StepType.signEIP191 | StepType.signEIP712;
  post: PostRequest;  // ✅ Required, not optional!
  domain?: TypedDataDomain;
  types?: TypedData;
  primaryType?: string;
};

export type TransactionStep = StepBase & {
  id: StepType.tokenApproval | StepType.buy | StepType.sell | 
      StepType.cancel | StepType.createOffer | StepType.createListing;
  maxFeePerGas?: Hash;
  maxPriorityFeePerGas?: Hash;
  gas?: Hash;
};

type StepBase = Omit<GenStep, 'to'> & {
  to: Address;  // ✅ viem Address type, not string!
};
```

### Developer Experience Benefits

**Type Narrowing:**
```typescript
for (const step of response.steps) {
  if (step.id === StepType.signEIP191) {
    // ✅ TypeScript knows step.post exists and is required
    await fetch(step.post.endpoint, {
      method: step.post.method,
      body: JSON.stringify(step.post.body)
    });
  } else if (step.id === StepType.buy) {
    // ✅ TypeScript knows this is a TransactionStep
    await sendTransaction({
      to: step.to,  // ✅ Typed as Address
      data: step.data,
      value: step.value,
    });
  }
}
```

**Type Guards:**
```typescript
if (isSignatureStep(step)) {
  // step is narrowed to SignatureStep
  // step.post is guaranteed to exist
}

if (isBuyStep(step)) {
  // step is narrowed to BuyStep
  // step.id === StepType.buy
}
```

---

## Files Modified

```
api/src/adapters/marketplace/
├── index.ts          ✅ Added 5 response type exports
└── client.ts         ✅ Added JSDoc documentation
```

---

## Verification

```bash
# Before fix
cd api && pnpx knip --include exports,types
# Result: 9 unused exports (4 utilities + 5 response types)

# After fix
cd api && pnpx knip --include exports,types
# Result: 4 unused exports (only utilities)
```

---

## Next Action

**Remove the 4 unused transform utilities:**

```bash
# Edit api/src/utils/transform.ts
# Remove lines 25-38, 52-78, 161-191, 202-206
```

**Expected outcome:**
- Clean knip report (0 unused exports)
- ~80 fewer lines of code
- ~0.5KB smaller bundle
- Build passes with zero errors

---

For detailed analysis, see: `KNIP_ADAPTER_AUDIT.md`
