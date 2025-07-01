# SellModal Complete User Journey Testing Plan

## Overview

This document outlines a comprehensive testing strategy for SellModal user journeys, covering both WaaS (Wallet-as-a-Service) and non-WaaS wallet flows. The plan focuses on end-to-end user experiences using Storybook play functions and Vitest integration tests with MSW (Mock Service Worker) for API mocking.

## User Journey Scenarios

### 1. Non-WaaS Wallet Journeys

#### Journey 1A: Standard ERC721 Sell (MetaMask/External Wallet)
**Flow**: User accepts an offer for an ERC721 token requiring approval
```
1. User opens sell modal
2. Modal loads collection/currency data
3. User sees approval required
4. User clicks "Approve TOKEN" 
5. Wallet prompts for approval transaction
6. User confirms approval
7. Approval button disappears, Accept button enabled
8. User clicks "Accept"
9. Wallet prompts for sell transaction
10. User confirms transaction
11. Modal closes, success modal appears
```

#### Journey 1B: ERC721 Sell Without Approval (Pre-approved)
**Flow**: User accepts an offer when token is already approved
```
1. User opens sell modal
2. Modal loads collection/currency data
3. No approval required - Accept button immediately enabled
4. User clicks "Accept"
5. Wallet prompts for sell transaction
6. User confirms transaction
7. Modal closes, success modal appears
```

#### Journey 1C: ERC1155 Sell with Quantity
**Flow**: User accepts an offer for multiple ERC1155 tokens
```
1. User opens sell modal
2. Modal loads collection/currency data
3. User sees quantity selector (if applicable)
4. User adjusts quantity if needed
5. User sees approval required (if needed)
6. User completes approval flow
7. User clicks "Accept"
8. Wallet prompts for sell transaction
9. User confirms transaction
10. Modal closes, success modal appears
```

### 2. WaaS Wallet Journeys

#### Journey 2A: WaaS Mainnet Sell with Fee Options
**Flow**: User with WaaS wallet on mainnet (fee options required)
```
1. User opens sell modal
2. Modal loads collection/currency data
3. User clicks "Accept"
4. Modal shows "Loading fee options"
5. Fee options modal appears
6. User selects fee option (Sponsored/Self-pay)
7. User confirms fee selection
8. Transaction executes automatically
9. Modal shows "Accepting offer..."
10. Transaction completes
11. Modal closes, success modal appears
```

#### Journey 2B: WaaS Testnet Sell (No Fee Options)
**Flow**: User with WaaS wallet on testnet (sponsored by default)
```
1. User opens sell modal
2. Modal loads collection/currency data
3. User clicks "Accept"
4. Transaction executes immediately (sponsored)
5. Modal shows "Accepting offer..."
6. Transaction completes
7. Modal closes, success modal appears
```

#### Journey 2C: WaaS Sell with Approval Required
**Flow**: WaaS wallet needing token approval first
```
1. User opens sell modal
2. Modal loads collection/currency data
3. User sees approval required
4. User clicks "Approve TOKEN"
5. Approval executes automatically (WaaS)
6. Approval completes, Accept button enabled
7. User clicks "Accept"
8. Fee options flow (if mainnet)
9. Sell transaction executes
10. Modal closes, success modal appears
```

### 3. Error Journey Scenarios

#### Journey 3A: Network Switch Required
```
1. User opens sell modal on wrong network
2. Modal detects network mismatch
3. User sees network switch prompt
4. User switches network
5. Modal reloads with correct network
6. User continues with normal flow
```

#### Journey 3B: Transaction Rejection
```
1. User follows normal flow
2. User rejects transaction in wallet
3. Modal shows error state
4. User can retry or close modal
```

#### Journey 3C: Insufficient Balance/Gas
```
1. User follows normal flow
2. Transaction fails due to insufficient gas
3. Modal shows error with explanation
4. User can adjust or close modal
```

## MSW Dependencies and Mock Setup

### Core MSW Handlers Required

#### 1. Collection Data Handlers
```typescript
// handlers/collection.ts
export const collectionHandlers = [
  // GET /collections/{chainId}/{contractAddress}
  rest.get(`${API_BASE}/collections/:chainId/:contractAddress`, (req, res, ctx) => {
    const { chainId, contractAddress } = req.params;
    return res(ctx.json(mockCollectionData));
  }),
  
  // GET /collections/{chainId}/{contractAddress}/tokens/{tokenId}
  rest.get(`${API_BASE}/collections/:chainId/:contractAddress/tokens/:tokenId`, (req, res, ctx) => {
    return res(ctx.json(mockTokenData));
  }),
];
```

#### 2. Currency Data Handlers
```typescript
// handlers/currency.ts
export const currencyHandlers = [
  // GET /currencies/{chainId}
  rest.get(`${API_BASE}/currencies/:chainId`, (req, res, ctx) => {
    return res(ctx.json(mockCurrencies));
  }),
  
  // GET /currencies/{chainId}/{contractAddress}
  rest.get(`${API_BASE}/currencies/:chainId/:contractAddress`, (req, res, ctx) => {
    return res(ctx.json(mockCurrencyData));
  }),
];
```

#### 3. Marketplace Transaction Handlers
```typescript
// handlers/marketplace.ts
export const marketplaceHandlers = [
  // POST /transactions/sell
  rest.post(`${API_BASE}/transactions/sell`, (req, res, ctx) => {
    const body = req.body;
    return res(ctx.json(mockSellTransactionSteps));
  }),
  
  // POST /execute
  rest.post(`${API_BASE}/execute`, (req, res, ctx) => {
    return res(ctx.json({ orderId: 'order-123', success: true }));
  }),
];
```

#### 4. WaaS Fee Options Handlers
```typescript
// handlers/waas.ts
export const waasHandlers = [
  // GET /fee-options/{chainId}
  rest.get(`${API_BASE}/fee-options/:chainId`, (req, res, ctx) => {
    const { chainId } = req.params;
    if (chainId === '1' || chainId === '137') { // Mainnet chains
      return res(ctx.json(mockFeeOptions));
    }
    return res(ctx.json([])); // Testnet - no fee options
  }),
];
```

#### 5. Wallet Balance Handlers
```typescript
// handlers/balance.ts
export const balanceHandlers = [
  // GET /balances/{chainId}/{walletAddress}
  rest.get(`${API_BASE}/balances/:chainId/:walletAddress`, (req, res, ctx) => {
    return res(ctx.json(mockBalances));
  }),
];
```

### Mock Data Structures

#### Collection Mock Data
```typescript
// mocks/collection.ts
export const mockCollectionData = {
  chainId: 1,
  contractAddress: '0x1234567890123456789012345678901234567890',
  name: 'Test Collection',
  symbol: 'TEST',
  type: 'ERC721',
  decimals: 0,
  // ... other collection properties
};

export const mockERC1155Collection = {
  ...mockCollectionData,
  type: 'ERC1155',
  decimals: 0,
};
```

#### Currency Mock Data
```typescript
// mocks/currency.ts
export const mockETH = {
  chainId: 1,
  contractAddress: '0x0000000000000000000000000000000000000000',
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  imageUrl: 'https://example.com/eth.png',
};

export const mockUSDC = {
  chainId: 1,
  contractAddress: '0xa0b86a33e6b8b3b3b3b3b3b3b3b3b3b3b3b3b3b3',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  imageUrl: 'https://example.com/usdc.png',
};
```

#### Transaction Steps Mock Data
```typescript
// mocks/transactionSteps.ts
export const mockApprovalStep = {
  id: 'tokenApproval',
  action: 'Approve token for trading',
  description: 'Allow the marketplace to trade your token',
  to: '0x1234567890123456789012345678901234567890',
  data: '0x095ea7b3...',
  value: '0',
  gasLimit: '50000',
};

export const mockSellTransactionStep = {
  id: 'sell',
  action: 'Accept offer',
  description: 'Complete the sale transaction',
  to: '0x9876543210987654321098765432109876543210',
  data: '0x12345678...',
  value: '0',
  gasLimit: '200000',
};

export const mockSignatureStep = {
  id: 'signEIP712',
  action: 'Sign order',
  description: 'Sign the sell order',
  message: { /* EIP712 message */ },
  post: {
    endpoint: '/execute',
    method: 'POST',
    body: { /* order data */ },
  },
};
```

#### WaaS Fee Options Mock Data
```typescript
// mocks/feeOptions.ts - NEEDS TO BE CREATED
export const mockFeeOptions = [
  {
    token: {
      chainId: 1,
      contractAddress: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    to: '0xfee1234567890123456789012345678901234567890',
    value: '1000000000000000', // 0.001 ETH
    gasLimit: 21000,
  },
  {
    token: {
      chainId: 1,
      contractAddress: '0xa0b86a33e6b8b3b3b3b3b3b3b3b3b3b3b3b3b3b3',
      name: 'USD Coin', 
      symbol: 'USDC',
      decimals: 6,
    },
    to: '0xfee1234567890123456789012345678901234567890',
    value: '2000000', // 2 USDC
    gasLimit: 21000,
  },
];

// Enhanced mock data for different scenarios
export const mockFeeOptionsMainnet = mockFeeOptions;
export const mockFeeOptionsTestnet = []; // Empty for testnet
export const mockFeeOptionsPolygon = [
  {
    token: {
      chainId: 137,
      contractAddress: '0x0000000000000000000000000000000000001010',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    to: '0xfee1234567890123456789012345678901234567890',
    value: '10000000000000000', // 0.01 MATIC
    gasLimit: 21000,
  },
];
```

### Wallet Mocking Strategy

#### Non-WaaS Wallet Mocks
```typescript
// mocks/wallets.ts
export const mockMetaMaskWallet = {
  walletKind: 'metamask',
  isWaaS: false,
  address: () => Promise.resolve('0xuser1234567890123456789012345678901234567890'),
  handleSendTransactionStep: vi.fn().mockResolvedValue('0xtxhash123'),
  handleConfirmTransactionStep: vi.fn().mockResolvedValue(true),
  handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature123'),
};

export const mockWalletConnectWallet = {
  walletKind: 'walletconnect',
  isWaaS: false,
  address: () => Promise.resolve('0xuser2345678901234567890123456789012345678901'),
  handleSendTransactionStep: vi.fn().mockResolvedValue('0xtxhash456'),
  handleConfirmTransactionStep: vi.fn().mockResolvedValue(true),
  handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature456'),
};
```

#### WaaS Wallet Mocks
```typescript
export const mockWaaSWallet = {
  walletKind: 'sequence',
  isWaaS: true,
  address: () => Promise.resolve('0xwaas1234567890123456789012345678901234567890'),
  handleSendTransactionStep: vi.fn().mockResolvedValue('0xwaastxhash123'),
  handleConfirmTransactionStep: vi.fn().mockResolvedValue(true),
  handleSignMessageStep: vi.fn().mockResolvedValue('0xwaassignature123'),
};
```

## Test Implementation Strategy

### 1. Storybook Play Function Tests

#### Complete Journey Stories
```typescript
// SellModal.stories.tsx
export const NonWaaSCompleteJourney: Story = {
  parameters: {
    msw: {
      handlers: [
        ...collectionHandlers,
        ...currencyHandlers,
        ...marketplaceHandlers,
        ...balanceHandlers,
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Setup: Mock non-WaaS wallet', async () => {
      // Mock wallet provider
    });
    
    await step('Open modal and verify initial state', async () => {
      const button = canvas.getByText('Open Sell Modal');
      await userEvent.click(button);
      await waitFor(() => expect(canvas.getByRole('dialog')).toBeInTheDocument());
    });
    
    await step('Verify approval required state', async () => {
      await expect(canvas.getByText('Approve TOKEN')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Accept' })).toBeDisabled();
    });
    
    await step('Execute approval transaction', async () => {
      const approveButton = canvas.getByText('Approve TOKEN');
      await userEvent.click(approveButton);
      
      // Wait for approval to complete
      await waitFor(() => 
        expect(canvas.queryByText('Approve TOKEN')).not.toBeInTheDocument()
      );
      await expect(canvas.getByRole('button', { name: 'Accept' })).toBeEnabled();
    });
    
    await step('Execute sell transaction', async () => {
      const acceptButton = canvas.getByRole('button', { name: 'Accept' });
      await userEvent.click(acceptButton);
      
      // Verify loading state
      await expect(acceptButton).toHaveTextContent(/Accept/);
      
      // Wait for transaction to complete
      await waitFor(() => 
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
      );
    });
  },
};

export const WaaSMainnetCompleteJourney: Story = {
  parameters: {
    msw: {
      handlers: [
        ...collectionHandlers,
        ...currencyHandlers,
        ...marketplaceHandlers,
        ...waasHandlers,
        ...balanceHandlers,
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Setup: Mock WaaS wallet on mainnet', async () => {
      // Mock WaaS wallet provider
    });
    
    await step('Open modal and verify initial state', async () => {
      const button = canvas.getByText('Open Sell Modal');
      await userEvent.click(button);
      await waitFor(() => expect(canvas.getByRole('dialog')).toBeInTheDocument());
    });
    
    await step('Execute sell with fee options', async () => {
      const acceptButton = canvas.getByRole('button', { name: 'Accept' });
      await userEvent.click(acceptButton);
      
      // Verify loading fee options
      await expect(acceptButton).toHaveTextContent(/Loading fee options/);
      
      // Wait for fee options modal
      await waitFor(() => 
        expect(canvas.getByText(/Select fee option/)).toBeInTheDocument()
      );
    });
    
    await step('Select fee option and complete', async () => {
      // Select first fee option
      const feeOptions = canvas.getAllByRole('radio');
      await userEvent.click(feeOptions[0]);
      
      const confirmButton = canvas.getByRole('button', { name: /Confirm/ });
      await userEvent.click(confirmButton);
      
      // Wait for transaction to complete
      await waitFor(() => 
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
      );
    });
  },
};
```

### 2. Vitest Integration Tests

#### Complete Journey Test Suite
```typescript
// __tests__/SellModalJourneys.test.tsx
describe('SellModal Complete User Journeys', () => {
  beforeEach(() => {
    server.listen();
  });
  
  afterEach(() => {
    server.resetHandlers();
  });
  
  afterAll(() => {
    server.close();
  });
  
  describe('Non-WaaS Wallet Journeys', () => {
    it('should complete ERC721 sell with approval required', async () => {
      // Test implementation
    });
    
    it('should complete ERC721 sell without approval', async () => {
      // Test implementation
    });
    
    it('should complete ERC1155 sell with quantity', async () => {
      // Test implementation
    });
  });
  
  describe('WaaS Wallet Journeys', () => {
    it('should complete mainnet sell with fee options', async () => {
      // Test implementation
    });
    
    it('should complete testnet sell without fee options', async () => {
      // Test implementation
    });
    
    it('should complete sell with approval required', async () => {
      // Test implementation
    });
  });
  
  describe('Error Scenarios', () => {
    it('should handle network switch requirement', async () => {
      // Test implementation
    });
    
    it('should handle transaction rejection', async () => {
      // Test implementation
    });
    
    it('should handle insufficient balance', async () => {
      // Test implementation
    });
  });
});
```

## Missing MSW Dependencies Analysis

Based on the current codebase analysis, these MSW handlers are likely missing or need enhancement:

### 1. Platform Fee Handlers
```typescript
// handlers/platformFee.ts - Likely missing
export const platformFeeHandlers = [
  rest.get(`${API_BASE}/platform-fees/:chainId/:collectionAddress`, (req, res, ctx) => {
    return res(ctx.json({ amount: '250', receiver: '0xfee...' })); // 2.5% fee
  }),
];
```

### 2. Network Configuration Handlers
```typescript
// handlers/network.ts - Likely missing
export const networkHandlers = [
  rest.get(`${API_BASE}/networks/:chainId/config`, (req, res, ctx) => {
    return res(ctx.json(mockNetworkConfig));
  }),
];
```

### 3. Order Validation Handlers
```typescript
// handlers/orderValidation.ts - Likely missing
export const orderValidationHandlers = [
  rest.post(`${API_BASE}/orders/validate`, (req, res, ctx) => {
    return res(ctx.json({ valid: true, errors: [] }));
  }),
];
```

### 4. Analytics Handlers
```typescript
// handlers/analytics.ts - Likely missing
export const analyticsHandlers = [
  rest.post(`${API_BASE}/analytics/track`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
```

## Implementation Timeline

### Week 1: Foundation Setup
- [ ] **Create missing MSW handlers** (WaaS fee options, platform fees, network config)
- [ ] **Enhance existing marketplace.msw.ts** with wallet-type awareness
- [ ] **Set up wallet mocking utilities** for WaaS vs non-WaaS scenarios
- [ ] **Create enhanced mock data** for different networks and wallet types

### Week 2: Non-WaaS Journey Implementation  
- [ ] **Implement MetaMask/WalletConnect journey tests** with approval flows
- [ ] **Add ERC721 vs ERC1155 scenario testing**
- [ ] **Create Storybook play functions** for non-WaaS flows
- [ ] **Add Vitest integration tests** for transaction execution

### Week 3: WaaS Journey Implementation
- [ ] **Implement WaaS mainnet flow** with fee options selection
- [ ] **Implement WaaS testnet flow** without fee options
- [ ] **Test approval vs no-approval scenarios** for WaaS wallets
- [ ] **Add comprehensive error handling** for WaaS-specific failures

### Week 4: Error Scenarios & Polish
- [ ] **Network switching error scenarios**
- [ ] **Transaction rejection and retry flows**
- [ ] **Performance testing** with slow network simulation
- [ ] **Cross-browser validation** and accessibility testing

## Priority Implementation Order

### 🔥 Critical (Week 1)
1. **WaaS fee options handlers** - Required for mainnet WaaS testing
2. **Enhanced GenerateSellTransaction** - Wallet-type awareness
3. **Platform fee handlers** - Used by useMarketPlatformFee hook
4. **Wallet mocking utilities** - Foundation for all tests

### 🟡 High (Week 2)
1. **Complete non-WaaS journey stories** - Core functionality
2. **Error simulation handlers** - Robust error testing
3. **Network configuration handlers** - Network switching scenarios

### 🟢 Medium (Week 3-4)
1. **Analytics handlers** - Tracking verification
2. **Performance testing setup** - Load and stress testing
3. **Visual regression testing** - UI consistency

## Success Criteria

- [ ] All user journeys covered with both Storybook and Vitest
- [ ] 100% MSW handler coverage for sell flow APIs
- [ ] Error scenarios properly tested and handled
- [ ] WaaS and non-WaaS flows thoroughly validated
- [ ] Performance benchmarks met
- [ ] Zero console errors in any test scenario
- [ ] Accessibility requirements satisfied

This comprehensive plan ensures complete coverage of all SellModal user journeys while providing a robust testing infrastructure that can be extended for other modal components.