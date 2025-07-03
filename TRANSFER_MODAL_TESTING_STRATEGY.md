# Transfer Modal Comprehensive Testing Strategy

## Overview

This document outlines a comprehensive testing strategy for the Transfer Modal in the `@0xsequence/marketplace-sdk`. The strategy leverages existing test patterns and infrastructure while ensuring complete coverage of all modal functionality.

## Current Implementation Analysis

### Transfer Modal Architecture

The Transfer Modal consists of several key components:

1. **Main Modal Component** (`TransferModal/index.tsx`)
   - Modal container with state management
   - Chain switching logic
   - WaaS fee options integration

2. **Store Management** (`TransferModal/store.ts`)
   - XState store for modal state
   - Actions: open, close, setView, setReceiverAddress, setQuantity, etc.
   - State: isOpen, view, chainId, collectionAddress, etc.

3. **Views**
   - `enterWalletAddress` - Main transfer form
   - `followWalletInstructions` - Wallet confirmation view

4. **Core Logic**
   - `useHandleTransfer` - Transfer execution logic
   - `useTransferTokens` - Contract interaction hook
   - Support for both ERC721 and ERC1155 transfers

5. **Components**
   - `WalletAddressInput` - Address validation and input
   - `TokenQuantityInput` - ERC1155 quantity selection
   - `TransferButton` - Action button with loading states

## Current Test Coverage Gaps

Based on analysis of existing tests and the transfer modal implementation, the following areas currently lack test coverage:

### 1. Modal Integration Tests
- No comprehensive modal rendering tests
- Missing store state management tests
- No view switching tests

### 2. Transfer Logic Tests
- `useHandleTransfer` hook not tested
- Transfer execution flow not covered
- Error handling scenarios not tested

### 3. Component Tests
- Individual components lack dedicated tests
- Input validation not thoroughly tested
- Loading and disabled states not covered

### 4. Edge Cases
- Chain switching scenarios
- WaaS vs non-WaaS wallet flows
- Self-transfer prevention
- Insufficient balance handling

## Testing Strategy

### Phase 1: Foundation Tests

#### 1.1 Store Tests (`TransferModal/store.test.ts`)
```typescript
// Test all store actions and state transitions
- open/close actions
- setView transitions
- setReceiverAddress validation
- setQuantity for ERC1155
- setTransferIsBeingProcessed states
- updateState partial updates
```

#### 1.2 Hook Tests (`useTransferTokens.test.tsx`)
```typescript
// Test the core transfer hook
- ERC721 transfer preparation
- ERC1155 transfer preparation
- Error handling for no wallet
- Contract interaction success/failure
```

#### 1.3 Transfer Logic Tests (`useHandleTransfer.test.tsx`)
```typescript
// Test transfer execution logic
- ERC721 vs ERC1155 flow differentiation
- WaaS fee option handling
- Transaction status modal integration
- Error callback execution
- Query invalidation after success
```

### Phase 2: Component Tests

#### 2.1 Main Modal Tests (`TransferModal.test.tsx`)
```typescript
// Test modal container behavior
- Modal open/close states
- Chain switching for WaaS vs non-WaaS
- Fee options display
- View routing (enterWalletAddress vs followWalletInstructions)
```

#### 2.2 Enter Wallet Address View Tests (`EnterWalletAddressView.test.tsx`)
```typescript
// Test main transfer form
- Address input validation
- Self-transfer prevention
- Quantity input for ERC1155
- Balance validation
- Transfer button states (enabled/disabled/loading)
- Alert message display
```

#### 2.3 Individual Component Tests
```typescript
// WalletAddressInput.test.tsx
- Address validation (valid/invalid formats)
- Self-transfer detection
- Error message display
- Processing state handling

// TokenQuantityInput.test.tsx  
- Quantity validation against balance
- Input constraints (positive numbers only)
- Balance display
- Processing state handling

// TransferButton.test.tsx
- Button states (enabled/disabled/loading)
- Click handler execution
- Loading spinner display
- Chain switching integration
```

### Phase 3: Integration Tests

#### 3.1 End-to-End Transfer Flow Tests
```typescript
// Complete transfer scenarios
- ERC721 transfer flow (address input → transfer → success)
- ERC1155 transfer flow (address + quantity → transfer → success)
- WaaS transfer with fee selection
- Non-WaaS transfer with wallet instructions
- Transfer failure handling
```

#### 3.2 Modal Hook Tests (`useTransferModal.test.tsx`)
```typescript
// Test modal hook functionality
- show() method with chain switching
- close() method
- callback updates (onError, onSuccess)
- Chain mismatch handling
```

### Phase 4: Edge Cases and Error Scenarios

#### 4.1 Validation Tests
```typescript
// Input validation scenarios
- Invalid wallet addresses
- Zero/negative quantities
- Quantities exceeding balance
- Self-transfer attempts
- Empty required fields
```

#### 4.2 Error Handling Tests
```typescript
// Error scenarios
- Network errors during transfer
- Transaction rejection
- Insufficient gas
- Contract interaction failures
- Wallet disconnection during transfer
```

#### 4.3 Chain and Wallet Tests
```typescript
// Multi-chain and wallet scenarios
- Chain switching for different wallet types
- WaaS vs non-WaaS behavior differences
- Fee option selection and cancellation
- Transaction status tracking
```

## Test Implementation Plan

### Leveraging Existing Infrastructure

The testing strategy will utilize the existing test infrastructure:

1. **Test Utilities** (`test/test-utils.tsx`)
   - MSW server for API mocking
   - Wagmi test configuration with mock connectors
   - React Query test client
   - Pre-configured wallet mocking (WaaS, Sequence, standard)

2. **Test Patterns** (from existing modal tests)
   - Store initialization and cleanup
   - Component rendering with providers
   - User interaction simulation
   - Async state testing
   - Error boundary testing
   - **Snapshot testing for UI consistency**

3. **Mock Strategies**
   - **Wagmi Mock Connectors**: Use existing `mockConnector`, `mockWaas()`, `mockSequenceConnector()` from test-utils
   - API response mocking via MSW
   - Contract interaction mocking via wagmi's mock system
   - Chain switching behavior through wagmi test configs

4. **Snapshot Testing Strategy**
   - **UI Component Snapshots**: Capture rendered output for visual regression detection
   - **State Snapshots**: Store state at key transition points
   - **Error State Snapshots**: Document error UI states
   - **Loading State Snapshots**: Capture loading/processing states

### Test File Structure

```
sdk/src/react/ui/modals/TransferModal/__tests__/
├── store.test.ts                           # Store state management
├── TransferModal.test.tsx                  # Main modal component
├── useTransferModal.test.tsx               # Modal hook
├── _views/
│   ├── enterWalletAddress/
│   │   ├── index.test.tsx                  # Main view component
│   │   ├── useHandleTransfer.test.tsx      # Transfer logic hook
│   │   └── _components/
│   │       ├── WalletAddressInput.test.tsx
│   │       ├── TokenQuantityInput.test.tsx
│   │       └── TransferButton.test.tsx
│   └── followWalletInstructions/
│       └── index.test.tsx                  # Wallet instructions view
└── integration/
    ├── transfer-flow.test.tsx              # End-to-end scenarios
    └── error-scenarios.test.tsx            # Error handling
```

### Test Data and Mocks

#### Mock Data Setup
```typescript
// Leverage existing test constants
import { TEST_ACCOUNTS, TEST_CHAIN, TEST_PRIVATE_KEYS } from '../test/const';

// Test collections and tokens
const mockERC721Collection = { contractType: 'ERC721', ... }
const mockERC1155Collection = { contractType: 'ERC1155', ... }
const mockTokenBalances = { ... }

// Test addresses from existing infrastructure
const validAddress = '0x742d35Cc6634C0532925a3b8D4C9db96'
const invalidAddress = 'invalid-address'
const selfAddress = TEST_ACCOUNTS[0] // From existing test utils
```

#### Wagmi Mock Configuration
```typescript
// Use existing wagmi mock configurations
const { wagmiConfig, wagmiConfigEmbedded, wagmiConfigSequence } = testUtils;

// Test scenarios:
// - Standard wallet: wagmiConfig (default mock connector)
// - WaaS wallet: wagmiConfigEmbedded (mockWaas connector)
// - Sequence wallet: wagmiConfigSequence (mockSequenceConnector)
```

#### Snapshot Testing Approach
```typescript
// Component snapshots
expect(container.firstChild).toMatchSnapshot('transfer-modal-initial-state');
expect(container.firstChild).toMatchSnapshot('transfer-modal-erc1155-with-quantity');
expect(container.firstChild).toMatchSnapshot('transfer-modal-error-state');

// Store state snapshots
expect(transferModalStore.getSnapshot()).toMatchSnapshot('store-after-open');
expect(transferModalStore.getSnapshot()).toMatchSnapshot('store-processing-transfer');
```

## Success Criteria

### Coverage Targets
- **Unit Tests**: 100% coverage of all transfer modal components and hooks
- **Integration Tests**: Complete transfer flows for both ERC721 and ERC1155
- **Error Scenarios**: All error paths and edge cases covered
- **Cross-browser**: Tests pass in all supported environments

### Quality Gates
- All tests pass consistently
- No flaky tests
- Fast execution (< 30 seconds for full suite)
- Clear test descriptions and error messages
- Proper cleanup and isolation between tests

### Validation Checklist
- [ ] Store state management fully tested
- [ ] All component interactions tested
- [ ] Transfer execution logic covered
- [ ] Error handling scenarios validated
- [ ] Chain switching behavior verified
- [ ] WaaS vs non-WaaS flows differentiated
- [ ] Input validation comprehensive
- [ ] Loading and disabled states tested
- [ ] Transaction status integration verified
- [ ] Callback execution confirmed

## Implementation Timeline

### Week 1: Foundation
- Store tests
- Core hook tests (useTransferTokens, useHandleTransfer)
- Test infrastructure setup

### Week 2: Components
- Individual component tests
- Main modal component tests
- View component tests

### Week 3: Integration
- End-to-end flow tests
- Modal hook tests
- Cross-wallet scenario tests

### Week 4: Edge Cases & Polish
- Error scenario tests
- Edge case validation
- Test optimization and cleanup
- Documentation updates

## Maintenance Strategy

### Continuous Integration
- Tests run on every PR
- Coverage reports generated
- Performance benchmarks tracked

### Test Maintenance
- Regular review of test relevance
- Update tests when implementation changes
- Monitor for flaky tests
- Keep mock data current

### Documentation
- Keep this strategy document updated
- Document new test patterns
- Share learnings with team
- Update test examples

This comprehensive testing strategy ensures the Transfer Modal is thoroughly tested, maintainable, and reliable across all supported scenarios and edge cases.