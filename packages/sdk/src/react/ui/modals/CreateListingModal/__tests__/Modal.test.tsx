import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '../../../../_internal/test-utils';
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

    render(<CreateListingModal />);
    expect(screen.getByText('List item for sale')).toBeInTheDocument();
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
  

  // it('should handle price input', async () => {
  //   // Reset modal state before test
  //   createListingModal$.close();
  //   createListingModal$.listingPrice.amountRaw.set('0');

  //   createListingModal$.open({
  //     collectionAddress: '0x123',
  //     chainId: '1',
  //     collectibleId: '1'
  //   });

  //   render(<CreateListingModal />);
    
  //   // Verify initial price is 0
  //   expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');
    
  //   // Simulate price input
  //   const priceInput = screen.getByRole('spinbutton');
  //   fireEvent.change(priceInput, { target: { value: '1.5' } });
    
  //   // Wait for and verify the exact price update
  //   await waitFor(() => {
  //     const expectedPrice = '1500000000000000000'; // 1.5 ETH in wei
  //     expect(createListingModal$.listingPrice.amountRaw.get()).toBe(expectedPrice);
  //   });

  //   // Verify the submit button is enabled with valid price
  //   const submitButton = screen.getByText('List item for sale');
  //   expect(submitButton).not.toBeDisabled();
  // });

//   it('should handle form submission', async () => {
//     const createListing = vi.fn();
//     (useCreateListing as any).mockReturnValue({
//       isLoading: false,
//       executeApproval: vi.fn(),
//       createListing,
//       tokenApprovalIsLoading: false
//     });

//     createListingModal$.open({
//       collectionAddress: '0x123',
//       chainId: '1',
//       collectibleId: '1'
//     });

//     render(<CreateListingModal />);
    
//     // Set a valid price
//     createListingModal$.listingPrice.amountRaw.set('1000000000000000000'); // 1 ETH
    
//     // Click the submit button
//     const submitButton = screen.getByText('List item for sale');
//     fireEvent.click(submitButton);
    
//     expect(createListing).toHaveBeenCalled();
//   });

//   it('should disable submit button when price is 0', () => {
//     createListingModal$.open({
//       collectionAddress: '0x123',
//       chainId: '1',
//       collectibleId: '1'
//     });

//     render(<CreateListingModal />);
    
//     const submitButton = screen.getByTestId('create-listing-submit-button');
//     expect(submitButton).toBeDisabled();
//   });
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
 });
