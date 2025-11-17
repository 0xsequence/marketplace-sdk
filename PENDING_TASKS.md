# Pending Tasks - Marketplace SDK v2

**Last Updated:** 2025-11-17  
**Branch:** api-wrapper  
**Status:** Documentation cleanup complete, pending implementation work identified

---

## High Priority Tasks

### 1. contractAddress → collectionAddress Rename at API Layer ⏳

**Source:** API_WRAPPER_REFACTOR_FINDINGS.md  
**Effort:** 5-6 days  
**Status:** Documented, not started

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

### 2. Eliminate Biome-Ignore Comments (180 total) ⏳

**Source:** API_WRAPPER_REFACTOR_FINDINGS.md (Finding #2)  
**Effort:** 2-3 days  
**Status:** Documented, not started

**Description:**
Eliminate ~180 biome-ignore comments for non-null assertions by implementing `RequiredFields` utility type.

**Tasks:**
- [ ] Create `RequiredFields<T, K>` utility type in `sdk/src/react/_internal/types.ts`
- [ ] Update 36 query files to use `RequiredFields<ValuesOptional<T>, K>`
- [ ] Remove all `// biome-ignore lint/style/noNonNullAssertion` comments
- [ ] Remove all `!` non-null assertions from queryFn parameters
- [ ] Verify biome checks pass with no warnings

**Example:**
```typescript
// Before
export type QueryOptions = ValuesOptional<FetchParams> & { query?: ... };
// Then: params.chainId! (with biome-ignore)

// After
export type QueryOptions = RequiredFields<
  ValuesOptional<FetchParams>,
  'chainId' | 'config' | 'collectionAddress'
> & { query?: ... };
// Then: params.chainId (no ! needed, no biome-ignore)
```

**Files Affected:**
- 36 query files across `collectible/`, `collection/`, `currency/`, `checkout/`, `token/`

---

### 3. Eliminate Redundant Type Redeclarations ⏳

**Source:** DUAL_TRANSFORMATION_LAYERS_ANALYSIS.md (in API_WRAPPER_REFACTOR_FINDINGS.md)  
**Effort:** 2-3 hours  
**Status:** Documented, not started

**Description:**
SDK query types unnecessarily re-declare `chainId` and `tokenId` fields that API adapter already transformed.

**Tasks:**
- [ ] Remove redundant `chainId` from Omit patterns in 16 SDK query Params interfaces
- [ ] Remove redundant `tokenId` from Omit patterns where applicable
- [ ] Simplify to only Omit fields being renamed (e.g., `contractAddress`)
- [ ] Verify type safety is maintained
- [ ] Run full test suite

**Example:**
```typescript
// Before (redundant)
export interface FetchParams 
  extends Omit<ApiRequest, 'chainId' | 'contractAddress'> {
  chainId: number;  // ❌ Already number in ApiRequest!
  collectionAddress: string;
  config: SdkConfig;
}

// After (simplified)
export interface FetchParams 
  extends Omit<ApiRequest, 'contractAddress'> {
  collectionAddress: string;  // Only rename
  config: SdkConfig;  // Only add
  // chainId inherited from ApiRequest ✅
}
```

**Impact:** Reduce from 3 interfaces per API call to 2

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

## Completed Work ✅

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

**High Priority Tasks:** 6-7 days  
**Optional Tasks:** 1-2 days  
**Total:** 7-9 days

---

## Success Metrics

- [ ] All biome-ignore comments removed (0/180 target)
- [ ] API wrapper uses `collectionAddress` (0/28 types updated)
- [ ] SDK queries simplified (0/16 files updated)
- [ ] Redundant type declarations removed (0/16 files updated)
- [ ] All tests passing
- [ ] Full build successful
- [ ] Clean biome check
- [ ] Clean knip check

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

**Last Reviewed:** 2025-11-17  
**Next Review:** After implementing high priority tasks
