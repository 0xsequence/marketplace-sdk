# New Buy Modal Architecture - Simplified Hooks Approach

## Overview

This document outlines a simplified architecture for the buy modal system that leverages Trails integration and supports two primary transaction types through direct hooks, eliminating the need for complex generator patterns. The new system removes the deprecated `customCreditCardProviderCallback` and implements a cleaner, hooks-first approach for handling market and primary sale transactions.

## Benefits of This Approach

1. **No Generators**: Direct hook implementation without abstract classes
2. **Simpler Mental Model**: Each hook does one thing well
3. **Better Tree Shaking**: Only import the hooks you use
4. **Easier Testing**: Test individual hooks in isolation
5. **More React-like**: Follows common React patterns
6. **Less Abstraction**: Direct implementation is easier to understand and debug

## Transaction Types

### Market Transactions (Secondary Sales)
- **Source**: Marketplace API (`generateBuyTransaction`)
- **Target**: Existing marketplace contracts (V1/V2)
- **Use Case**: Buying NFTs from other users

### Primary Sale Transactions (Shop/Minting)
- **Source**: Direct ABI encoding using sales contract ABIs
- **Target**: Primary sale contracts (ERC721/ERC1155)
- **Use Case**: Minting new NFTs from creators

## Simplified Hook Architecture

### 1. Core Transaction Hooks

```typescript
// Direct hook for market transactions - no generators
export function useMarketTransactionSteps({
  chainId,
  collectionAddress,
  buyer,
  marketplace,
  orderId,
  collectibleId,
  quantity,
  additionalFees = [],
  enabled = true,
}: MarketTransactionParams & { enabled?: boolean }) {
  const config = useConfig();
  const marketplaceClient = useMemo(() => getMarketplaceClient(config), [config]);

  return useQuery({
    queryKey: ['market-transaction-steps', {
      chainId,
      collectionAddress,
      buyer,
      orderId,
      collectibleId,
      quantity,
    }],
    queryFn: async () => {
      const response = await marketplaceClient.generateBuyTransaction({
        chainId: chainId.toString(),
        collectionAddress,
        buyer,
        marketplace,
        ordersData: [{
          orderId,
          quantity,
          tokenId: collectibleId,
        }],
        additionalFees,
        walletType: WalletKind.sequence,
      });
      
      return response.steps;
    },
    enabled: enabled && !!buyer,
  });
}

// Direct hook for primary sale transactions - no generators
export function usePrimarySaleTransactionSteps({
  chainId,
  buyer,
  recipient,
  salesContractAddress,
  tokenIds,
  amounts,
  maxTotal,
  paymentToken,
  merkleProof = [],
  contractVersion = 'v1',
  tokenType,
  enabled = true,
}: PrimarySaleTransactionParams & { enabled?: boolean }) {
  const { readContract } = useConfig();
  
  // Check allowance if using ERC20
  const { data: allowance } = useQuery({
    queryKey: ['erc20-allowance', paymentToken, buyer, salesContractAddress],
    queryFn: async () => {
      if (paymentToken === zeroAddress) return MAX_UINT256;
      
      return readContract({
        address: paymentToken,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [buyer, salesContractAddress],
      });
    },
    enabled: enabled && !!buyer && paymentToken !== zeroAddress,
  });

  return useQuery({
    queryKey: ['primary-sale-steps', {
      chainId,
      salesContractAddress,
      tokenIds,
      amounts,
      buyer,
    }],
    queryFn: async () => {
      const steps: Step[] = [];
      
      // Add approval step if needed
      if (paymentToken !== zeroAddress && allowance && allowance < BigInt(maxTotal)) {
        const approvalCalldata = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [salesContractAddress, BigInt(maxTotal)],
        });
        
        steps.push({
          id: StepType.tokenApproval,
          data: approvalCalldata,
          to: paymentToken,
          value: '0',
          price: '0',
        });
      }
      
      // Add mint step
      const saleABI = getSaleContractABI(tokenType, contractVersion);
      const mintCalldata = encodeFunctionData({
        abi: saleABI,
        functionName: 'mint',
        args: [
          recipient || buyer,
          tokenIds,
          amounts,
          '0x',
          paymentToken,
          maxTotal,
          merkleProof,
        ],
      });
      
      steps.push({
        id: StepType.buy,
        data: mintCalldata,
        to: salesContractAddress,
        value: paymentToken === zeroAddress ? maxTotal : '0',
        price: maxTotal,
      });
      
      return steps;
    },
    enabled: enabled && !!buyer,
  });
}
```

### 2. Simplified Step Conversion Hook

```typescript
// Single hook to convert steps to Trails format
export function useTrailsCalldata(steps: Step[] | undefined) {
  return useMemo(() => {
    if (!steps || steps.length === 0) return null;
    
    // Find the main transaction step (usually the buy step)
    const mainStep = steps.find(step => 
      step.id === StepType.buy || 
      step.id === StepType.sell ||
      step.id === StepType.createListing
    );
    
    if (!mainStep) return null;
    
    return {
      to: mainStep.to,
      data: mainStep.data,
      value: mainStep.value || '0',
    };
  }, [steps]);
}
```

### 3. Transaction Type Detection Hook

```typescript
// Simple hook to detect transaction type from modal props
export function useTransactionType(modalProps: BuyModalProps) {
  return useMemo(() => {
    // Shop transactions are primary sales
    if (modalProps.marketplaceType === 'shop') {
      return TransactionType.PRIMARY_SALE;
    }
    
    // Everything else is a market transaction
    return TransactionType.MARKET_BUY;
  }, [modalProps.marketplaceType]);
}
```

### 4. Unified Buy Modal Hook

```typescript
// Main hook that combines everything
export function useBuyTransaction(modalProps: BuyModalProps) {
  const { address: buyer } = useAccount();
  const transactionType = useTransactionType(modalProps);
  
  // Use market transaction hook
  const marketQuery = useMarketTransactionSteps({
    chainId: modalProps.chainId,
    collectionAddress: modalProps.collectionAddress,
    buyer: buyer!,
    marketplace: modalProps.marketplace || MarketplaceKind.sequence_marketplace_v2,
    orderId: modalProps.orderId || '',
    collectibleId: modalProps.collectibleId || '',
    quantity: modalProps.quantity?.toString() || '1',
    enabled: transactionType === TransactionType.MARKET_BUY && !!buyer,
  });
  
  // Use primary sale hook
  const primaryQuery = usePrimarySaleTransactionSteps({
    chainId: modalProps.chainId,
    buyer: buyer!,
    salesContractAddress: modalProps.salesContractAddress || zeroAddress,
    tokenIds: modalProps.items?.map(item => item.tokenId || '') || [],
    amounts: modalProps.items?.map(item => item.quantity || 1) || [],
    maxTotal: modalProps.salePrice?.amount || '0',
    paymentToken: modalProps.salePrice?.currencyAddress || zeroAddress,
    contractVersion: 'v1',
    tokenType: 'ERC1155', // Could be determined from contract
    enabled: transactionType === TransactionType.PRIMARY_SALE && !!buyer,
  });
  
  // Return the active query based on transaction type
  return transactionType === TransactionType.MARKET_BUY 
    ? marketQuery 
    : primaryQuery;
}
```

### 5. Updated Modal Component

```typescript
export const BuyModalContent = () => {
  const modalProps = useBuyModalProps();
  const { close } = useBuyModal();
  
  // Single hook handles everything
  const { data: steps, isLoading } = useBuyTransaction(modalProps);
  const trailsCalldata = useTrailsCalldata(steps);
  
  // Execute transactions using existing hooks
  const { processStep } = useProcessStep();
  const { supportedChains } = useSupportedChains();
  
  const isChainSupported = supportedChains.some(
    chain => chain.id === modalProps.chainId,
  );
  
  const executeTransaction = useCallback(async () => {
    if (!steps) return;
    
    for (const step of steps) {
      await processStep(step, modalProps.chainId);
    }
  }, [steps, processStep, modalProps.chainId]);
  
  return (
    <Modal
      isDismissible
      onClose={close}
      overlayProps={MODAL_OVERLAY_PROPS}
      contentProps={MODAL_CONTENT_PROPS}
    >
      <div className="relative flex grow flex-col items-center gap-4 p-6">
        <Text className="w-full text-center font-body font-bold text-large text-text-100">
          Complete Your Purchase
        </Text>
        
        {isLoading && <Spinner size="lg" />}
        
        {isChainSupported && trailsCalldata && (
          <TrailsWidget
            appId="marketplace-sdk"
            toChainId={modalProps.chainId}
            toAddress={trailsCalldata.to}
            toCalldata={trailsCalldata.data}
            toAmount={trailsCalldata.value}
            renderInline={true}
            theme="dark"
          />
        )}
        
        {!isChainSupported && trailsCalldata && (
          <FallbackPurchaseUI
            chainId={modalProps.chainId}
            calldata={trailsCalldata}
            onExecute={executeTransaction}
          />
        )}
      </div>
    </Modal>
  );
};
```

## ABI Management (Simplified)

```typescript
// Simple ABI getter functions instead of a class
export const getSaleContractABI = (
  tokenType: 'ERC721' | 'ERC1155',
  version: 'v0' | 'v1'
) => {
  const abiMap = {
    'ERC721-v0': ERC721_SALE_ABI_V0,
    'ERC721-v1': ERC721_SALE_ABI_V1,
    'ERC1155-v0': ERC1155_SALES_CONTRACT_ABI_V0,
    'ERC1155-v1': ERC1155_SALES_CONTRACT_ABI_V1,
  };
  
  return abiMap[`${tokenType}-${version}`];
};

export const getMarketplaceABI = (version: 'v1' | 'v2') => {
  return version === 'v1' 
    ? SequenceMarketplaceV1_ABI 
    : SequenceMarketplaceV2_ABI;
};
```

## File Structure (Simplified)

```
sdk/src/
├── react/
│   ├── hooks/
│   │   ├── transactions/
│   │   │   ├── useMarketTransactionSteps.ts     # Market transaction hook
│   │   │   ├── usePrimarySaleTransactionSteps.ts # Primary sale hook
│   │   │   ├── useBuyTransaction.ts              # Combined hook
│   │   │   ├── useTrailsCalldata.ts              # Trails conversion
│   │   │   └── useTransactionType.ts             # Type detection
│   │   └── useProcessStep.ts                     # Existing step processor
│   ├── ui/modals/BuyModal/
│   │   ├── components/
│   │   │   ├── BuyModalContent.tsx               # Simplified modal
│   │   │   └── FallbackPurchaseUI.tsx           # Fallback UI
│   │   └── store.ts                              # Modal state
│   └── utils/
│       └── abi.ts                                # Simple ABI getters
└── types/
    └── transactions.ts                           # Transaction types
```

## Migration Path

1. **Phase 1**: Implement new hooks alongside existing code
2. **Phase 2**: Update modal to use new hooks
3. **Phase 3**: Remove generator classes and factory
4. **Phase 4**: Clean up unused code

## Key Advantages

1. **Simplicity**: Direct hooks without abstraction layers
2. **Testability**: Each hook can be tested independently
3. **Performance**: Better tree shaking, only load what you use
4. **Maintainability**: Less code, easier to understand
5. **React Patterns**: Follows established React conventions
6. **Type Safety**: Full TypeScript support without complex generics

## Example Usage

```typescript
// In a component
function MyBuyButton() {
  const { data: steps, isLoading } = useMarketTransactionSteps({
    chainId: 1,
    collectionAddress: '0x...',
    buyer: '0x...',
    marketplace: MarketplaceKind.sequence_marketplace_v2,
    orderId: '123',
    collectibleId: '456',
    quantity: '1',
  });
  
  if (isLoading) return <Spinner />;
  
  // Use steps directly
}
```

This approach eliminates the need for generators, factories, and complex abstractions while maintaining all the functionality. It's more aligned with React best practices and easier to understand and maintain.