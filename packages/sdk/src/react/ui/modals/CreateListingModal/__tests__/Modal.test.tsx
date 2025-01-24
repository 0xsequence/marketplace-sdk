import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '../../../../_internal/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateListingModal } from '../Modal';
import { createListingModal$ } from '../store';
import { useCollectible, useCollection, useBalanceOfCollectible } from '../../../../hooks';
import { useAccount } from 'wagmi';
import { useCreateListing } from '../hooks/useCreateListing';
import { useWallet } from '../../../../_internal/wallet/useWallet';

// Mock the hooks
vi.mock('../../../../hooks', () => ({
  useCollectible: vi.fn(),
  useCollection: vi.fn(),
  useBalanceOfCollectible: vi.fn(),
  useCurrencies: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false
  }),
  useMarketplaceConfig: vi.fn().mockReturnValue({
    data: {
      collections: [
        {
          collectionAddress: '0x123',
          marketplaceFeePercentage: 2.5
        }
      ]
    },
    isLoading: false,
    isError: false
  }),
  useRoyaltyPercentage: vi.fn().mockReturnValue({
    data: 0n,
    isLoading: false,
    isError: false
  }),
  useLowestListing: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    isError: false
  })
}));

vi.mock('../../../../_internal/wallet/useWallet', () => ({
  useWallet: vi.fn()
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnections: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false
  })
}));

vi.mock('../hooks/useCreateListing', () => ({
  useCreateListing: vi.fn(),
}));

vi.mock('@0xsequence/kit', () => ({
  useWaasFeeOptions: vi.fn().mockReturnValue([false, vi.fn()]),
}));

describe('CreateListingModal', () => {
  beforeEach(() => {
    cleanup();
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock values
    (useWallet as any).mockReturnValue({
      wallet: {
        address: () => Promise.resolve('0x123'),
      },
      isLoading: false,
      isError: false
    });
    
    (useCollectible as any).mockReturnValue({
      data: { decimals: 18, name: 'Test NFT' },
      isLoading: false,
      isError: false
    });
    
    (useCollection as any).mockReturnValue({
      data: { type: 'ERC721', name: 'Test Collection' },
      isLoading: false,
      isError: false
    });
    
    (useBalanceOfCollectible as any).mockReturnValue({
      data: { balance: '1' }
    });
    
    (useAccount as any).mockReturnValue({
      address: '0x123'
    });
    
    (useCreateListing as any).mockReturnValue({
      isLoading: false,
      executeApproval: vi.fn(),
      createListing: vi.fn(),
      tokenApprovalIsLoading: false
    });
  });

  it('should not render when modal is closed', () => {
    render(<CreateListingModal />);
    expect(screen.queryByText('List item for sale')).toBeNull();
  });

  it('should render loading state', () => {
    (useCollectible as any).mockReturnValue({
      isLoading: true
    });

    createListingModal$.open({
      collectionAddress: '0x123',
      chainId: '1',
      collectibleId: '1'
    });

    render(<CreateListingModal />);
    const loadingModal = screen.getByTestId('loading-modal');
    expect(loadingModal).toBeVisible();
  });

  it('should render error state', () => {
    (useCollectible as any).mockReturnValue({
      isError: true
    });

    createListingModal$.open({
      collectionAddress: '0x123',
      chainId: '1',
      collectibleId: '1'
    });

    const errorModal = screen.getByTestId('error-modal');
    expect(errorModal).toBeVisible();
  });

  it('should render main form when data is loaded', () => {
    createListingModal$.open({
      collectionAddress: '0x123',
      chainId: '1',
      collectibleId: '1'
    });

    render(<CreateListingModal />);
    
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
  });

  it('should reset store values when modal is closed and reopened', () => {
    // Open modal first time
    createListingModal$.open({
      collectionAddress: '0x123',
      chainId: '1',
      collectibleId: '1'
    });

    // Set some values in the store
    createListingModal$.listingPrice.amountRaw.set('1000000000000000000');
    createListingModal$.quantity.set('5');

    // Close modal
    createListingModal$.close();

    // Verify store is reset
    expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');
    expect(createListingModal$.quantity.get()).toBe('1');

    // Reopen modal
    createListingModal$.open({
      collectionAddress: '0x456',
      chainId: '1',
      collectibleId: '2'
    });

    // Verify store has default values
    expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');
    expect(createListingModal$.quantity.get()).toBe('1');
  });
  
  it('should update state based on price input', async () => {
    createListingModal$.open({
      collectionAddress: '0x123',
      chainId: '1',
      collectibleId: '1'
    });

    render(<CreateListingModal />);

    // Initial price should be 0
    expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');

    // Find and interact with price input
    const priceInput = screen.getByRole('textbox', { name: 'Enter price' });
    expect(priceInput).toBeInTheDocument();

    fireEvent.change(priceInput, { target: { value: '1.5' } });
    
    // Wait for the state to update and verify it's not 0 anymore
    await waitFor(() => {
      expect(createListingModal$.listingPrice.amountRaw.get()).not.toBe('0');
    });
  });
 });
