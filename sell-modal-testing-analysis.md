# SellModal Testing Analysis

## Component Overview

The SellModal is a complex React component that handles the selling flow for marketplace items. Based on my analysis, here are the key branches and states that need testing:

### Key Component States & Branches

1. **Loading States**
   - Collection loading (`collectionLoading`)
   - Currency loading (`currencyLoading`)
   - Token approval loading (`tokenApprovalIsLoading`)
   - Overall modal loading state

2. **Error States**
   - Collection fetch error (`collectionError`)
   - Currency fetch error (`currencyError`)
   - Missing order data (`order === undefined`)
   - Error modal display

3. **Wallet Types**
   - WaaS wallet flow (with fee options)
   - Non-WaaS wallet flow
   - Testnet vs Mainnet behavior differences

4. **Transaction Steps**
   - Approval step (when `steps$.approval.exist` is true)
   - Transaction execution step
   - Fee options selection (WaaS only)

5. **UI States**
   - Button states (disabled, pending, hidden)
   - CTA label changes based on processing state
   - Modal open/close states

6. **Edge Cases**
   - Zero quantity remaining (`order?.quantityRemaining === '0'`)
   - Sell process failure handling
   - Cleanup on modal close

## Current Testing Gaps

1. **No existing unit tests** - No Vitest tests found for SellModal
2. **Limited story coverage** - Current stories only cover basic states
3. **No interaction tests** - No play functions testing user flows
4. **No error state testing** - Error scenarios not covered
5. **No WaaS flow testing** - Complex WaaS fee selection not tested

## Storybook 9 Testing Features

Based on the documentation, Storybook 9 introduces several powerful testing features:

### 1. **Play Functions**
- Simulate user interactions within stories
- Use Testing Library queries via `canvas`
- Assert on component behavior with `expect`
- Support for async operations

### 2. **User Event API**
- Simulate clicks, typing, hovering
- Always await user events for proper logging
- Full user interaction simulation

### 3. **Component State Testing**
- `beforeEach` hooks for setup/teardown
- `mount` function for pre-render setup
- Mock data creation before rendering

### 4. **Interaction Grouping**
- `step` function to group related interactions
- Better organization of complex test flows
- Visual debugging in Interactions panel

### 5. **Mock Support**
- Function spying with `fn`
- Module mocking capabilities
- Assertion on function calls

### 6. **Test Runner Integration**
- Accessibility testing with axe-playwright
- Visual regression testing
- Coverage reporting
- CI/CD integration

## Recommended Testing Strategy

### 1. **Vitest Unit Tests**
- Test store logic in isolation
- Test hooks (`useSell`, `useGetTokenApproval`)
- Test utility functions
- Mock external dependencies

### 2. **Storybook Component Tests**
- Visual states (loading, error, success)
- Interaction flows with play functions
- Accessibility testing
- Visual regression testing

### 3. **Integration Tests**
- Full sell flow simulation
- WaaS fee selection flow
- Error recovery scenarios
- Modal lifecycle testing

## Next Steps

1. Create comprehensive Vitest unit tests for:
   - `sellModal$` store
   - `useSell` hook
   - `useTransactionSteps` hook

2. Enhance Storybook stories with:
   - Play functions for interaction testing
   - Error state stories
   - WaaS flow stories
   - Accessibility tests

3. Add test-runner configuration for:
   - Snapshot testing
   - Accessibility checks
   - Visual regression tests