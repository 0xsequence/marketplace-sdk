import '@testing-library/jest-dom/vitest';
import {
	render,
	screen,
	waitFor,
	within,
	fireEvent,
	act,
	cleanup,
} from '../../../../../_internal/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ERC1155QuantityModal } from '../Modal1155';
import { buyModal$ } from '../../store';
import { useCurrency } from '../../../../../hooks';
import { MarketplaceKind } from '../../../../../_internal';
import type { Order, TokenMetadata } from '../../../../../_internal';

// Mock dependencies
vi.mock('../../../../../hooks', () => ({
	useCurrency: vi.fn(),
}));

describe('ERC1155QuantityModal', () => {
	const mockOrder = {
		orderId: '1',
		priceAmount: '1000000000000000000', // 1 ETH in wei
		priceCurrencyAddress: '0x0',
		quantityRemaining: '10',
		quantityDecimals: 0,
		chainId: 1,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		createdAt: new Date().toISOString(),
		quantityAvailableFormatted: '1',
	} as Order;

	const mockCollectable: TokenMetadata = {
		decimals: 0,
		tokenId: '1',
		name: 'Test Token',
		description: 'Test Description',
		image: 'https://example.com/image.png',
		attributes: [],
	};

	const mockBuy = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		// Reset the modal state
		buyModal$.close();
		buyModal$.state.checkoutModalLoaded.set(false);
		buyModal$.state.checkoutModalIsLoading.set(false);
		buyModal$.state.invalidQuantity.set(false);
		buyModal$.state.quantity.set('1');

		// Mock currency hook
		(useCurrency as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: {
				symbol: 'ETH',
				decimals: 18,
				imageUrl: 'https://example.com/eth.png',
			},
		});
	});

	afterEach(() => {
		buyModal$.close();
		cleanup();
		vi.clearAllMocks();
	});

	it('should render quantity input correctly', async () => {
		// Open the modal with initial state
		buyModal$.open({
			order: mockOrder,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		render(
			<ERC1155QuantityModal
				buy={mockBuy}
				collectable={mockCollectable}
				order={mockOrder}
				chainId="1"
				collectionAddress="0x123"
				collectibleId="1"
			/>,
		);

		// Verify modal title
		expect(screen.getByText('Select Quantity')).toBeInTheDocument();

		// Verify quantity input is present with initial value
		const quantityInput = screen.getByRole('textbox', {
			name: /enter quantity/i,
		});
		expect(quantityInput).toBeInTheDocument();
		expect(quantityInput).toHaveValue('1');

		// Verify total price calculation (1 ETH)
		const priceLabels = screen.getAllByText('Total Price');
		const priceContainer = priceLabels[0].parentElement;
		if (!priceContainer) throw new Error('Price container not found');
		expect(within(priceContainer).getByText('1')).toBeInTheDocument();
		expect(within(priceContainer).getByText('ETH')).toBeInTheDocument();

		// Verify buy button
		const buyButton = screen.getByRole('button', { name: /buy now/i });
		expect(buyButton).toBeInTheDocument();
		expect(buyButton).not.toBeDisabled();

		// Verify token image
		const tokenImage = screen.getByRole('img', { name: '' });
		expect(tokenImage).toBeInTheDocument();
		expect(tokenImage).toHaveAttribute('src', 'https://example.com/eth.png');

		// Ensure loading state is false and button is enabled before clicking
		buyModal$.state.checkoutModalIsLoading.set(false);
		buyModal$.state.invalidQuantity.set(false);
	});

	it('should update total price when quantity changes', async () => {
		buyModal$.open({
			order: mockOrder,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		render(
			<ERC1155QuantityModal
				buy={mockBuy}
				collectable={mockCollectable}
				order={mockOrder}
				chainId="1"
				collectionAddress="0x123"
				collectibleId="1"
			/>,
		);

		const quantityInput = screen.getByRole('textbox', {
			name: /enter quantity/i,
		});

		// Change quantity to 2
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '2' } });
		});

		// Verify total price updates to 2 ETH
		const priceLabels = screen.getAllByText('Total Price');
		const priceContainer = priceLabels[0].parentElement;
		if (!priceContainer) throw new Error('Price container not found');

		await waitFor(() => {
			expect(within(priceContainer).getByText('2')).toBeInTheDocument();
		});
	});

	it('should disable buy button when quantity is invalid', async () => {
		buyModal$.open({
			order: mockOrder,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		// Set invalid quantity and loading state
		buyModal$.state.invalidQuantity.set(true);
		buyModal$.state.checkoutModalIsLoading.set(true);

		render(
			<ERC1155QuantityModal
				buy={mockBuy}
				collectable={mockCollectable}
				order={mockOrder}
				chainId="1"
				collectionAddress="0x123"
				collectibleId="1"
			/>,
		);

		const buyButton = screen.getByRole('button', { name: /buy now/i });

		// Wait for the button to be disabled
		await waitFor(() => {
			expect(buyButton).toBeDisabled();
		});

		// Click should not trigger buy function
		fireEvent.click(buyButton);
		expect(mockBuy).not.toHaveBeenCalled();
	});

	it('should calculate total price correctly', async () => {
		// Open the modal with initial state
		buyModal$.open({
			order: mockOrder,
			callbacks: {},
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '1',
		});

		render(
			<ERC1155QuantityModal
				buy={mockBuy}
				collectable={mockCollectable}
				order={mockOrder}
				chainId="1"
				collectionAddress="0x123"
				collectibleId="1"
			/>,
		);

		// Verify initial total price (1 ETH)
		const priceLabels = screen.getAllByText('Total Price');
		const priceContainer = priceLabels[0].parentElement;
		if (!priceContainer) throw new Error('Price container not found');
		expect(within(priceContainer).getByText('1')).toBeInTheDocument();
		expect(within(priceContainer).getByText('ETH')).toBeInTheDocument();

		// Change quantity to 3
		const quantityInput = screen.getByRole('textbox', {
			name: /enter quantity/i,
		});
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '3' } });
		});

		// Verify total price updates to 3 ETH
		await waitFor(() => {
			expect(within(priceContainer).getByText('3')).toBeInTheDocument();
		});
	});
});
