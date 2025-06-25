# ActionButtonBody Wallet Connection Refactor Plan

## Problem Statement

The `ActionButtonBody` component is currently tightly coupled to Sequence Connect's `useOpenConnectModal` hook, making it incompatible with other wallet providers like Privy. This causes the error "useGenericContext must be used within a Provider" when used in the Privy playground environment.

## Current Architecture

### ActionButtonBody Dependencies
- **Location**: `sdk/src/react/ui/components/_internals/action-button/components/ActionButtonBody.tsx`
- **Hard Dependency**: `useOpenConnectModal` from `@0xsequence/connect`
- **Usage Pattern**: 
  1. Check if wallet connected via `useWallet()`
  2. If not connected, set pending action and call `setOpenConnectModal(true)`
  3. If connected, execute action directly

### Wallet Provider Environments
1. **Sequence Connect**: Uses `SequenceConnectProvider` + `useOpenConnectModal`
2. **Privy**: Uses `PrivyProvider` + `useLogin()` from `@privy-io/react-auth`
3. **Future**: Potentially other wallet providers

## Proposed Solution: Wallet Connection Abstraction

### Phase 1: Create Wallet Connection Context

#### 1.1 Define Wallet Connection Interface
```typescript
// sdk/src/react/_internal/wallet/types.ts
interface WalletConnectionHandler {
  openConnectModal: () => void;
  isConnected: boolean;
  address?: string;
}
```

#### 1.2 Create Wallet Connection Context
```typescript
// sdk/src/react/_internal/wallet/WalletConnectionContext.tsx
const WalletConnectionContext = createContext<WalletConnectionHandler | null>(null);

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
};
```

#### 1.3 Create Provider Implementations

**Sequence Connect Provider**:
```typescript
// sdk/src/react/_internal/wallet/providers/SequenceWalletConnectionProvider.tsx
export const SequenceWalletConnectionProvider = ({ children }) => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { address } = useWallet();
  
  const handler: WalletConnectionHandler = {
    openConnectModal: () => setOpenConnectModal(true),
    isConnected: !!address,
    address
  };
  
  return (
    <WalletConnectionContext.Provider value={handler}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
```

**Privy Provider**:
```typescript
// sdk/src/react/_internal/wallet/providers/PrivyWalletConnectionProvider.tsx
export const PrivyWalletConnectionProvider = ({ children }) => {
  const { login, authenticated } = usePrivy();
  const { address } = useAccount();
  
  const handler: WalletConnectionHandler = {
    openConnectModal: () => login(),
    isConnected: authenticated && !!address,
    address
  };
  
  return (
    <WalletConnectionContext.Provider value={handler}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
```

### Phase 2: Auto-Detection Provider

#### 2.1 Create Smart Provider
```typescript
// sdk/src/react/_internal/wallet/SmartWalletConnectionProvider.tsx
export const SmartWalletConnectionProvider = ({ children }) => {
  // Detect which wallet provider is available in the React tree
  const hasSequenceConnect = useContext(SequenceConnectContext) !== null;
  const hasPrivy = useContext(PrivyContext) !== null;
  
  if (hasSequenceConnect) {
    return <SequenceWalletConnectionProvider>{children}</SequenceWalletConnectionProvider>;
  }
  
  if (hasPrivy) {
    return <PrivyWalletConnectionProvider>{children}</PrivyWalletConnectionProvider>;
  }
  
  throw new Error('No supported wallet provider found');
};
```

### Phase 3: Update ActionButtonBody

#### 3.1 Refactor ActionButtonBody
```typescript
// sdk/src/react/ui/components/_internals/action-button/components/ActionButtonBody.tsx
export const ActionButtonBody = ({ action, onClick, tokenId, children }) => {
  const { openConnectModal, isConnected } = useWalletConnection();
  const { setPendingAction } = useMarketplaceStore();
  
  const handleClick = () => {
    if (!isConnected && action) {
      setPendingAction(action, onClick, tokenId);
      openConnectModal();
    } else {
      onClick?.();
    }
  };
  
  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  );
};
```

### Phase 4: Integration Points

#### 4.1 Update MarketplaceProvider
```typescript
// sdk/src/react/ui/components/MarketplaceProvider.tsx
export const MarketplaceProvider = ({ children, config }) => {
  return (
    <MarketplaceConfigProvider config={config}>
      <SmartWalletConnectionProvider>
        <MarketplaceStoreProvider>
          {children}
        </MarketplaceStoreProvider>
      </SmartWalletConnectionProvider>
    </MarketplaceConfigProvider>
  );
};
```

#### 4.2 Update Playground Providers
No changes needed - the auto-detection will handle provider selection.

## Implementation Steps

### Step 1: Foundation (1-2 hours)
- [ ] Create wallet connection types and interfaces
- [ ] Create base WalletConnectionContext
- [ ] Create useWalletConnection hook

### Step 2: Provider Implementations (2-3 hours)
- [ ] Implement SequenceWalletConnectionProvider
- [ ] Implement PrivyWalletConnectionProvider
- [ ] Test both providers in isolation

### Step 3: Auto-Detection (1-2 hours)
- [ ] Implement SmartWalletConnectionProvider
- [ ] Add provider detection logic
- [ ] Handle edge cases and error states

### Step 4: ActionButtonBody Refactor (1 hour)
- [ ] Remove useOpenConnectModal dependency
- [ ] Update to use useWalletConnection
- [ ] Maintain existing functionality

### Step 5: Integration (1 hour)
- [ ] Update MarketplaceProvider
- [ ] Test in both playground environments
- [ ] Verify all collectible actions work

### Step 6: Testing & Validation (2-3 hours)
- [ ] Test all collectible card actions (Buy, Sell, Transfer, etc.)
- [ ] Test wallet connection flows in both environments
- [ ] Test error handling and edge cases
- [ ] Update any related tests

## Benefits

1. **Wallet Provider Agnostic**: ActionButtonBody works with any wallet provider
2. **Zero Breaking Changes**: Existing implementations continue to work
3. **Future Proof**: Easy to add new wallet providers
4. **Clean Architecture**: Clear separation of concerns
5. **Auto-Detection**: No manual configuration required

## Risks & Mitigation

### Risk: Provider Detection Failures
**Mitigation**: Add comprehensive error handling and fallback mechanisms

### Risk: Breaking Changes
**Mitigation**: Maintain backward compatibility through gradual migration

### Risk: Performance Impact
**Mitigation**: Use React context efficiently, avoid unnecessary re-renders

## Alternative Approaches Considered

### Option A: Configuration-Based
Add wallet connection config to SDK config. **Rejected**: Requires manual configuration.

### Option B: Hook-Based Only
Create useWalletConnection without context. **Rejected**: Harder to manage state across components.

### Option C: Component Props
Pass connection handler as props. **Rejected**: Requires changes to all parent components.

## Success Criteria

- [ ] Privy playground collectibles page loads without errors
- [ ] All collectible actions work in both Sequence and Privy environments
- [ ] No breaking changes to existing implementations
- [ ] Clean, maintainable code architecture
- [ ] Comprehensive test coverage

## Timeline

**Total Estimated Time**: 8-12 hours
**Target Completion**: 1-2 days

This refactor will make the ActionButtonBody component truly wallet-agnostic while maintaining full backward compatibility and enabling future wallet provider integrations.