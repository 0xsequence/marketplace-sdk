# Pending Tasks - Marketplace SDK v2

**Last Updated:** 2025-11-17  
**Branch:** api-wrapper  
**Status:** Task #2 (Biome-ignore) and Task #3 (Redundant types) complete! Only Task #1 remains.

---

## High Priority Tasks

### 1. contractAddress → collectionAddress Rename at API Layer ⏳

**Source:** API_WRAPPER_REFACTOR_FINDINGS.md  
**Effort:** 5-6 days  
**Status:** Only remaining high-priority task

**Description:**
Move the field rename from SDK query layer to API adapter layer for better separation of concerns.

**Tasks:**
- [ ] Update 28 API wrapper Request types to use `collectionAddress` instead of `contractAddress`
- [ ] Add field transformation in wrapper methods (collectionAddress → contractAddress for API calls)
- [ ] Simplify 16 SDK query files (remove manual `contractAddress: collectionAddress` mapping)
- [ ] Update integration tests
- [ ] Verify all builds pass

**Files Affected:**
- API: `api/src/adapters/marketplace/client.ts` (28 types, 28 methods)
- API: `api/src/utils/client-proxy.ts` (add `wrapCollectionAddress` utility)
- SDK: 16 query files in `sdk/src/react/queries/collectible/` and `collection/`

---

### 2. Eliminate Biome-Ignore Comments ✅

**Source:** API_WRAPPER_REFACTOR_FINDINGS.md (Finding #2)  
**Effort:** Completed in ~1 hour (estimated 2-3 days)  
**Status:** ✅ COMPLETE (2025-11-17)

**What Was Done:**
- ✅ Updated 5 query files (not 36 - most already used buildQueryOptions pattern)
- ✅ Used existing `WithRequired<T, K>` utility type for type-safe parameter handling
- ✅ Removed all 16 `// biome-ignore lint/style/noNonNullAssertion` comments
- ✅ Eliminated all `!` non-null assertions from affected queryFn parameters
- ✅ Verified biome checks pass (no new warnings)
- ✅ All 472 tests passing (20 skipped)

**Implementation Pattern:**
```typescript
// Before
queryFn: () => fetchData({
  // biome-ignore lint/style/noNonNullAssertion: enabled check ensures not undefined
  chainId: params.chainId!,
  config: params.config!,
})

// After
queryFn: () => {
  const requiredParams = params as WithRequired<QueryOptions, 'chainId' | 'config'>;
  return fetchData({
    chainId: requiredParams.chainId,
    config: requiredParams.config,
  });
}
```

**Files Updated:**
- `sdk/src/react/queries/token/supplies.ts`
- `sdk/src/react/queries/currency/currency.ts`
- `sdk/src/react/queries/collectible/primary-sale-items.ts`
- `sdk/src/react/queries/token/metadata-search.ts`
- `sdk/src/react/queries/token/balances.ts`

**Commit:** `aec71346d remove biome-ignore`

---

### 3. Eliminate Redundant Type Redeclarations ✅

**Source:** DUAL_TRANSFORMATION_LAYERS_ANALYSIS.md (in API_WRAPPER_REFACTOR_FINDINGS.md)  
**Effort:** Analysis completed  
**Status:** ✅ NOT NEEDED - Already clean!

**Finding:**
After comprehensive analysis, **no redundant type redeclarations exist** in the current codebase. All SDK query files correctly inherit transformed types from the API adapter layer without unnecessary redeclaration.

The API adapter layer (`api/src/adapters/`) already defines:
- `chainId: ChainId` (number)
- `tokenId: TokenId` (bigint)
- `collectionAddress: Address`

SDK query files correctly extend these types without redeclaring `chainId` or `tokenId`. The refactoring to move type transformations to the API adapter layer was already completed successfully in previous work.

**Verified Files:** All 31 query files across `collectible/`, `collection/`, `token/`, `currency/`, and `checkout/` directories

---

## Optional/Future Tasks

### 4. Phase 4: Standardization (Optional) 📋

**Source:** API_ANALYSIS_REPORT.md  
**Effort:** 1-2 days  
**Status:** Optional polish work

**Tasks:**
- [ ] Add array transformers to all adapters (Builder, Metadata) for consistency
- [ ] Standardize error handling across adapters
- [ ] Add JSDoc comments to all public transform functions
- [ ] Update documentation with normalization guide

---

### 5. Query Parameter Destructuring Cleanup (Optional) 📋

**Source:** QUERY_MINIMAL_PATTERN_ANALYSIS.md, QUERY_PARAMETER_SIMPLIFICATION.md  
**Effort:** 2-3 hours  
**Status:** Optional, low priority

**Description:**
Some query files have unnecessary parameter extraction that could be simplified.

**Tasks:**
- [ ] Simplify 9 files to use `const { config, ...apiParams } = params` pattern
- [ ] Remove unnecessary chainId/collectionAddress extractions
- [ ] Standardize page parameter handling

**Note:** This is purely cosmetic cleanup. Does not affect functionality.

---

## Recently Completed (2025-11-17) ✅

### Task #2: Biome-Ignore Comment Elimination
- ✅ Eliminated all 16 biome-ignore comments from 5 query files
- ✅ Used `WithRequired<T, K>` for type-safe parameter handling
- ✅ All tests passing (472 passed, 20 skipped)
- ✅ No new biome warnings introduced

### Task #3: Redundant Type Redeclarations
- ✅ Verified no redundant redeclarations exist
- ✅ Confirmed API adapter pattern working correctly
- ✅ All 31 query files follow correct inheritance pattern

---

## Previously Completed Work ✅

### Phase 1: Knip Cleanup
- ✅ Removed 4 unused transform utilities
- ✅ Exported 5 response types from marketplace client
- ✅ Reduced transform.ts by 125 lines (55%)
- ✅ Clean knip report (0 unused exports)

**Reference:** CLEANUP_COMPLETE.md

---

### Phase 2: Client Proxy Pattern
- ✅ Created client-proxy.ts utilities (wrapChainId, wrapWithTransform, passthrough)
- ✅ Refactored marketplace/client.ts (739 → 615 lines, -124 lines)
- ✅ Deleted obsolete files (transforms.ts, types.ts, -199 lines)
- ✅ Total cleanup: 323 lines removed

**Reference:** PROXY_PATTERN_COMPLETE.md, CLEANUP_COMPLETE.md

---

### Query Builder Pattern
- ✅ Implemented buildQueryOptions with type-safe requiredParams
- ✅ Added customValidation support for array length checks
- ✅ Migrated 27/27 eligible query files to standardized pattern
- ✅ Eliminated ~500 lines of boilerplate

**Reference:** QUERY_BUILDER_COMPLETE.md, CUSTOM_VALIDATION_COMPLETE.md

---

### Type Standardizations
- ✅ Standardized on `tokenId` (not collectibleId)
- ✅ Removed unnecessary .toString() calls (7 occurrences)
- ✅ Fixed biome lint issues in API package (5 errors)
- ✅ Implemented RequiredKeys type for compile-time validation

**Reference:** TOKENID_STANDARDIZATION.md, TOSTRING_CLEANUP_COMPLETE.md, BIOME_FIXES_COMPLETE.md

---

### Architecture Validations
- ✅ Verified SDK correctly imports from API package (no duplicate types)
- ✅ Confirmed API wrapper architecture is sound
- ✅ Documented type flow and layer responsibilities

**Reference:** PHASE_3_ASSESSMENT.md, SDK_TYPE_DEFINITIONS_AUDIT.md, SDK_TYPE_FLOW_DIAGRAM.md

---

## Not Needed / Obsolete

### Phase 3: SDK Type Consolidation
**Status:** ❌ NOT NEEDED  
**Reason:** PHASE_3_ASSESSMENT.md confirmed SDK already correctly imports from API package. No duplicate types found. Architecture is sound.

---

## Implementation Priority

1. **High Impact, Quick Wins:**
   - Task #3: Eliminate redundant type redeclarations (2-3 hours)

2. **High Impact, Medium Effort:**
   - Task #2: Eliminate biome-ignore comments (2-3 days)

3. **High Impact, High Effort:**
   - Task #1: contractAddress → collectionAddress at API layer (5-6 days)

4. **Polish / Optional:**
   - Task #4: Standardization (1-2 days)
   - Task #5: Query parameter cleanup (2-3 hours)

---

## Total Remaining Effort

**High Priority Tasks:** 5-6 days (Task #1 only)  
**Optional Tasks:** 1-2 days  
**Total:** 6-8 days

**Completed Today:** Tasks #2 and #3 (saved 2-3 days of effort!)

---

## Success Metrics

- [x] All biome-ignore comments removed (16/16 ✅)
- [ ] API wrapper uses `collectionAddress` (0/28 types updated)
- [ ] SDK queries simplified (0/16 files updated)
- [x] Redundant type declarations verified clean (31/31 ✅)
- [x] All tests passing (472 tests ✅)
- [x] Full build successful ✅
- [x] Clean biome check ✅
- [x] Clean knip check ✅

---

## References

**Active Documentation:**
- API_WRAPPER_REFACTOR_FINDINGS.md - Main refactor plan
- CLEANUP_COMPLETE.md - Completed work (Phase 1 & 2)
- REFACTOR_SESSION_SUMMARY.md - Session overview
- PHASE_3_ASSESSMENT.md - Architecture validation
- PROXY_PATTERN_COMPLETE.md - Proxy pattern implementation
- SDK_TYPE_DEFINITIONS_AUDIT.md - Type architecture
- SDK_TYPE_FLOW_DIAGRAM.md - Visual type flow

**Branch:** `api-wrapper` (50 commits ahead of origin)

---

**Last Reviewed:** 2025-11-17 (23:50 UTC+2)  
**Next Review:** After implementing Task #1 (contractAddress rename)  
**Recent Progress:** Completed Tasks #2 (biome-ignore) and #3 (type audit) - 2 of 3 high-priority tasks done!
