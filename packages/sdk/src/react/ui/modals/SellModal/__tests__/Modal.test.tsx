import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '../../../../_internal/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SellModal } from '../Modal';
import { OpenSellModalArgs, sellModal$ } from '../store';
import { useCollection, useCurrency, useCollectible, useMarketplaceConfig, useRoyaltyPercentage } from '../../../../hooks';
import { useAccount } from 'wagmi';
import { useSell } from '../hooks/useSell';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import {  MarketplaceKind, Order } from '../../../../_internal';

// Mock setup
const mockHooks = () => {
  vi.mock('../../../../hooks', () => ({
    useCollection: vi.fn(),
    useCurrency: vi.fn(),
    useCollectible: vi.fn(),
    useMarketplaceConfig: vi.fn(),
    useRoyaltyPercentage: vi.fn()
  }));

  vi.mock('../../../../_internal/wallet/useWallet', () => ({
    useWallet: vi.fn()
  }));

  vi.mock('wagmi', () => ({
    useAccount: vi.fn(),
    useConnections: vi.fn().mockReturnValue({
      data: [{ accounts: [{ address: '0x123' }] }],
      isLoading: false,
      isError: false
    })
  }));

  vi.mock('@0xsequence/kit', () => ({
    useWaasFeeOptions: vi.fn().mockReturnValue([false, vi.fn()])
  }));

  vi.mock('../hooks/useSell', () => ({
    useSell: vi.fn(),
  }));
};

// Test data
const mockOrder = {
  orderId: '1',
  priceAmount: '1000000000000000000',
  priceCurrencyAddress: '0x0',
  quantityRemaining: '1',
  createdAt: new Date().toISOString(),
  marketplace: MarketplaceKind.sequence_marketplace_v2
} as Order

const mockModalProps = {
  collectionAddress: '0x123',
  chainId: '1',
  tokenId: '1',
  order: mockOrder
} satisfies OpenSellModalArgs

describe('SellModal', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockHooks();
    
    // Setup default mock values
    (useWallet as any).mockReturnValue({
      wallet: {
        address: () => Promise.resolve('0x123'),
        getChainId: () => Promise.resolve(1)
      },
      isLoading: false,
      isError: false
    });
    
    (useCollection as any).mockReturnValue({
      data: { name: 'Test Collection' },
      isLoading: false,
      isError: false
    });
    
    (useCurrency as any).mockReturnValue({
      data: { 
        imageUrl: 'test-url',
        symbol: 'ETH',
        decimals: 18
      },
      isLoading: false,
      isError: false
    });

    (useCollectible as any).mockReturnValue({
      data: {
        name: 'Test Token',
        imageUrl: 'test-token-url'
      },
      isLoading: false,
      isError: false
    });
    
    (useAccount as any).mockReturnValue({ address: '0x123' });
    (useSell as any).mockReturnValue({
      isLoading: false,
      executeApproval: vi.fn(),
      sell: vi.fn(),
    });

    (useMarketplaceConfig as any).mockReturnValue({
      data: {
        collections: [{
          collectionAddress: '0x123',
          marketplaceFeePercentage: 2.5
        }]
      },
      isLoading: false,
      isError: false
    });
    
    (useRoyaltyPercentage as any).mockReturnValue({
      data: 2.5,
      isLoading: false,
      isError: false
    });
  });

  it('should not render when modal is closed', () => {
    render(<SellModal />);
    expect(screen.queryByText('You have an offer')).toBeNull();
  });

  it('should render loading state', () => {
    (useCollection as any).mockReturnValue({ isLoading: true });
    sellModal$.open(mockModalProps);
    render(<SellModal />);
    expect(screen.getByTestId('loading-modal')).toBeVisible();
  });

  it('should render error state', () => {
    (useCollection as any).mockReturnValue({ isError: true });
    sellModal$.open(mockModalProps);
    render(<SellModal />);
    expect(screen.getByTestId('error-modal')).toBeVisible();
  });

  it('should render main modal when data is loaded', () => {
    sellModal$.open(mockModalProps);
    render(<SellModal />);
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    expect(screen.getByText('Offer received')).toBeInTheDocument();
  });

  describe('Modal Actions', () => {
    it('should handle approval step correctly', async () => {
      const mockExecuteApproval = vi.fn().mockResolvedValue(undefined);
      (useSell as any).mockReturnValue({
        isLoading: false,
        executeApproval: mockExecuteApproval,
        sell: vi.fn(),
      });

      sellModal$.open(mockModalProps);
      sellModal$.steps.approval.exist.set(true);
      sellModal$.steps.approval.isExecuting.set(false);
      render(<SellModal />);
      
      const approveButton = screen.getByText('Approve TOKEN');
      await fireEvent.click(approveButton);
      expect(mockExecuteApproval).toHaveBeenCalled();
    });

    it('should handle sell action correctly', async () => {
      const mockSell = vi.fn();
      (useSell as any).mockReturnValue({
        isLoading: false,
        executeApproval: vi.fn(),
        sell: mockSell,
      });

      sellModal$.open(mockModalProps);
      sellModal$.steps.approval.exist.set(false);
      sellModal$.steps.approval.isExecuting.set(false);
      sellModal$.steps.transaction.isExecuting.set(false);
      render(<SellModal />);
      
      const acceptButton = screen.getByText('Accept');
      await fireEvent.click(acceptButton);
      expect(mockSell).toHaveBeenCalled();
    });

    it('should disable accept button when approval is needed', () => {
      sellModal$.open(mockModalProps);
      sellModal$.steps.approval.exist.set(true);
      sellModal$.steps.approval.isExecuting.set(false);
      render(<SellModal />);
      
      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      expect(acceptButton).toBeDisabled();
    });
  });
});