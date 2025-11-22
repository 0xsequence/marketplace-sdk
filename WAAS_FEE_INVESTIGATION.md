# WaaS Fee Selection Investigation

## Goal
Find a clean, headless-compatible solution for WaaS fee selection in the Sell Modal.

## How It Currently Works

### Architecture

1. **Fee Options Source**: NOT from API, but from WaaS connector at runtime
2. **Trigger**: When transaction is attempted (via `sendTransaction` or `estimateGas`)
3. **Handler**: `feeConfirmationHandler` on `sequenceWaasProvider`
4. **Flow**:
   ```
   App → sendTransaction()
   → WaaS Connector analyzes tx
   → Determines available fee tokens
   → Calls feeConfirmationHandler.confirmFeeOption(id, options, txs, chainId)
   → Handler must return selected token address (Promise<string>)
   → Transaction proceeds with selected fee token
   ```

### Current Implementation in Sell Modal

**File**: `sdk/src/react/ui/modals/SellModal/internal/context.ts`

```typescript
// Lines 93-94: Uses @0xsequence/connect hook
const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] = useWaasFeeOptions();

// Lines 99-117: Auto-select logic with polling
useEffect(() => {
  autoSelectFeeOption()
    .then((result) => {
      if (feeOptionConfirmation?.id && result.selectedOption) {
        confirmFeeOption(feeOptionConfirmation.id, result.selectedOption.token.contractAddress);
      }
    })
    .catch((error) => { /* ... */ });
}, [autoSelectFeeOption, confirmFeeOption, feeOptionConfirmation]);

// Lines 170-182: Pass to mutations
const { approve, sell } = useSellMutations({
  tx: sellSteps.data,
  onSuccess,
  waasFeeConfirmation: isWaaS ? {
    feeOptionConfirmation,
    selectedOption: selectedFeeOption,
    optionConfirmed,
    confirmFeeOption,
    setOptionConfirmed,
  } : undefined,
});
```

**File**: `sdk/src/react/hooks/transactions/useProcessStep.ts`

```typescript
// Lines 37-71: Manual polling loop waiting for fee confirmation
if (waasFeeConfirmation?.feeOptionConfirmation && !waasFeeConfirmation.optionConfirmed) {
  await new Promise<void>((resolve) => {
    const checkConfirmation = () => {
      if (waasFeeConfirmation?.selectedOption && waasFeeConfirmation.optionConfirmed) {
        const confirmationId = waasFeeConfirmation.feeOptionConfirmation?.id;
        const currencyAddress = waasFeeConfirmation.selectedOption.token.contractAddress || null;
        waasFeeConfirmation.confirmFeeOption(confirmationId, currencyAddress);
        resolve();
      } else {
        setTimeout(checkConfirmation, 1000); // POLL EVERY SECOND
      }
    };
    checkConfirmation();
  });
}
```

## Problems with Current Approach

1. **Manual State Management**: 
   - `selectedFeeOption`, `optionConfirmed`, `waasFeeSelectionError` states
   - Complex effects with dependencies on `feeOptionConfirmation`
   
2. **Polling Loop**: 
   - `useProcessStep` polls every 1000ms waiting for confirmation
   - Inefficient and error-prone
   
3. **Threading State Through Mutations**:
   - `waasFeeConfirmation` object passed through mutation chain
   - Makes code harder to follow

4. **Not Headless-Friendly**:
   - Requires UI state management for something that should be automatic
   - Manual confirmation step breaks headless flows

## New Hooks We've Created

### 1. `useRequiresFeeSelection`
**Purpose**: Enhance fee options with balance information  
**Input**: `chainId`, `options[]`  
**Output**: Enhanced options with balance data, recommended option  

```typescript
const { data } = useRequiresFeeSelection({
  chainId: 137,
  options: feeOptionsFromConnector
});
// Returns: { isRequired, options (with balances), recommendedOption }
```

### 2. `useExecuteWithFee`
**Purpose**: Execute transactions with automatic fee confirmation  
**Mechanism**: Intercepts `feeConfirmationHandler`, auto-confirms selected option  

```typescript
const { execute, pendingConfirmation } = useExecuteWithFee({
  chainId: 137,
  onSuccess: () => {}
});

// Usage
execute({
  transactionFn: () => writeContract({...}),
  selectedFeeOption: myOption
});
```

**How it works**:
1. Sets up interceptor on `sequenceWaasProvider.feeConfirmationHandler`
2. When transaction triggers handler, captures options
3. Immediately confirms the pre-selected option
4. Transaction proceeds

## The Question: Is There a Better Way?

### What We Need
A way to **discover available fee options BEFORE executing the transaction** for a truly headless flow.

### Options Investigated

#### Option A: Use `estimateGas()` to Trigger Handler
- Call `estimateGas()` instead of `sendTransaction()`
- WaaS connector still calls `feeConfirmationHandler`
- Capture options, then cancel (don't resolve promise)
- **Pros**: Works with existing connector
- **Cons**: Hacky workaround, uses gas estimation for discovery

#### Option B: Direct RPC Method?
**Question**: Is there a Sequence RPC method to get fee options?

Possible methods to investigate:
- `sequence_getFeeOptions(chainId, transaction)` ?
- `sequence_estimateFee(chainId, transaction)` ?
- Something in WaaS API?

**Current Finding**: No obvious RPC method found in codebase

#### Option C: Keep Current Pattern but Simplify
Use `useExecuteWithFee` to eliminate manual state management:
- Still requires fee options from connector (during transaction)
- But removes polling, simplifies state
- **Pros**: Clean API, removes ~50 lines of code
- **Cons**: Fee selection still happens during transaction (not proactive)

## For Truly Headless Flows

### Ideal Flow
```
1. User initiates sell
2. SDK queries: "What fee tokens are available?"  (HEADLESS)
3. SDK auto-selects best option based on balance
4. SDK executes transaction with selected fee
```

### Current Reality
```
1. User initiates sell
2. SDK starts transaction
3. WaaS connector interrupts: "Which fee token?"
4. SDK provides pre-selected option
5. Transaction continues
```

The difference: **When** we can discover and select fee options.

## Questions to Answer

1. **Does Sequence have a WaaS RPC method to get fee options without starting a transaction?**
   - Check WaaS API documentation
   - Check `@0xsequence/waas` package
   - Ask Sequence team

2. **Is the `feeConfirmationHandler` pattern the ONLY way?**
   - Is this by design (security)?
   - Or is it a limitation we can work around?

3. **For headless flows, which approach is best?**
   - Accept that fee selection happens during transaction (Option C)
   - Implement `estimateGas` hack for proactive discovery (Option A)
   - Wait for proper API endpoint (Option B)

## Recommendation

### Immediate Action: Simplify Current Code (Option C)
1. Use `useExecuteWithFee` to remove polling and manual state
2. Keep fee selection as part of transaction flow
3. Works today, much cleaner code

### Future Enhancement: Investigate RPC Method
1. Check with Sequence team about WaaS fee estimation API
2. If exists, enhance `useRequiresFeeSelection` to use it
3. If doesn't exist, propose it as feature request

## Next Steps

1. **Confirm with user**: Is the `feeConfirmationHandler` pattern the only way?
2. **Check**: Is there Sequence documentation on WaaS RPC methods?
3. **Decide**: Implement clean version now (Option C) or wait for better solution?
