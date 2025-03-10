import { cleanup, render, screen, waitFor } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { Order } from '../../../../_internal';
import { MarketplaceKind } from '../../../../_internal';
import { ContractType } from '../../../../_internal';
import { BuyModal } from '../Modal';
import { useBuyCollectable } from '../hooks/useBuyCollectable';
import { useLoadData } from '../hooks/useLoadData';
import { buyModal$ } from '../store';

const mockOrder = {
	orderId: '1',
	priceAmount: '1000000000000000000',
	priceCurrencyAddress: '0x0',
	quantityRemaining: '1',
	createdAt: new Date().toISOString(),
	marketplace: MarketplaceKind.sequence_marketplace_v2,
} as Order;

vi.mock('../hooks/useLoadData', () => ({
	useLoadData: vi.fn(),
}));

vi.mock('../hooks/useBuyCollectable', () => ({
	useBuyCollectable: vi.fn(),
}));

vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: vi.fn().mockReturnValue([]),
}));

describe('BuyModal', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		(useLoadData as Mock).mockReturnValue({
			collection: null,
			collectable: null,
			checkoutOptions: null,
			isLoading: false,
			isError: false,
		});

		(useBuyCollectable as Mock).mockReturnValue({
			buy: vi.fn(),
			isLoading: false,
			isError: false,
		});

		buyModal$.close();

		cleanup();
	});

	it('should not render when isOpen is false', () => {
		render(<BuyModal />);

		expect(screen.queryByText('Loading Sequence Pay')).not.toBeInTheDocument();
		expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
		expect(screen.queryByText('Select Quantity')).not.toBeInTheDocument();
	});

	it('should render error modal when there is an error', async () => {
		const mockOrderBasic = {
			...mockOrder,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			collectionContractAddress: '0x123',
			tokenId: '1',
			quantityRemaining: '1',
			priceCurrencyAddress: '0x0',
			chainId: 1,
			priceAmount: '1000000000000000000',
		};

		// Test loading error
		(useLoadData as Mock).mockReturnValue({
			collection: { type: ContractType.ERC721 },
			collectable: { decimals: 0 },
			checkoutOptions: { someOption: true },
			isLoading: false,
			isError: true,
		});

		buyModal$.open({
			order: mockOrderBasic,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		render(<BuyModal />);

		// Should show error modal
		await waitFor(() => {
			expect(screen.getByTestId('error-modal')).toBeInTheDocument();
			expect(
				screen.getByText('Error loading item details'),
			).toBeInTheDocument();
		});

		// Cleanup
		cleanup();

		// Test buy error
		(useLoadData as Mock).mockReturnValue({
			collection: { type: ContractType.ERC721 },
			collectable: { decimals: 0 },
			checkoutOptions: { someOption: true },
			isLoading: false,
			isError: false,
		});

		(useBuyCollectable as Mock).mockReturnValue({
			buy: vi.fn(),
			isLoading: false,
			isError: true,
			status: 'error',
		});

		buyModal$.open({
			order: mockOrderBasic,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		render(<BuyModal />);

		// Should show error modal for buy error too
		expect(screen.getByText('Error')).toBeInTheDocument();
	});

	it('should render ERC1155QuantityModal when contract type is ERC1155', async () => {
		const mockOrderERC1155 = {
			...mockOrder,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			collectionContractAddress: '0x123',
			tokenId: '1',
			quantityRemaining: '10',
			priceCurrencyAddress: '0x0',
			chainId: 1,
			quantityDecimals: 0,
			priceAmount: '1000000000000000000',
		};

		(useLoadData as Mock).mockReturnValue({
			collection: { type: ContractType.ERC1155 },
			collectable: { decimals: 0 },
			checkoutOptions: { someOption: true },
			isLoading: false,
			isError: false,
		});

		(useBuyCollectable as Mock).mockReturnValue({
			buy: vi.fn(),
			isLoading: false,
			isError: false,
		});

		buyModal$.open({
			order: mockOrderERC1155,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		// Initialize quantity state
		buyModal$.state.quantity.set('1');
		buyModal$.state.checkoutModalLoaded.set(false);
		buyModal$.state.checkoutModalIsLoading.set(false);

		render(<BuyModal />);

		await waitFor(() => {
			expect(screen.getByText('Select Quantity')).toBeInTheDocument();
		});
	});

	it('should not render ERC1155QuantityModal when contract type is ERC721', async () => {
		const mockBuy = vi.fn();
		const mockOrderERC721 = {
			...mockOrder,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			collectionContractAddress: '0x123',
			tokenId: '1',
			quantityRemaining: '1',
			priceCurrencyAddress: '0x0',
			chainId: 1,
			priceAmount: '1000000000000000000',
		};

		// First, mock loading state
		(useLoadData as Mock).mockReturnValue({
			collection: null,
			collectable: null,
			checkoutOptions: null,
			isLoading: true,
			isError: false,
		});

		(useBuyCollectable as Mock).mockReturnValue({
			buy: mockBuy,
			isLoading: false,
			isError: false,
			status: 'ready',
		});

		buyModal$.open({
			order: mockOrderERC721,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		const { rerender } = render(<BuyModal />);

		// Verify loading modal is shown
		expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();

		// Then update the mock to simulate data loaded
		(useLoadData as Mock).mockReturnValue({
			collection: { type: ContractType.ERC721 },
			collectable: { decimals: 0 },
			checkoutOptions: { someOption: true },
			isLoading: false,
			isError: false,
		});

		// Force a re-render with the new mock values
		rerender(<BuyModal />);

		// Wait for loading to complete and verify the rest of the flow
		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledWith({
				orderId: mockOrderERC721.orderId,
				collectableDecimals: 0,
				quantity: '1',
				marketplace: mockOrderERC721.marketplace,
				checkoutOptions: { someOption: true },
			});
		});

		expect(screen.queryByText('Loading Sequence Pay')).not.toBeInTheDocument();
		expect(screen.queryByText('Select Quantity')).not.toBeInTheDocument();
	});
});
