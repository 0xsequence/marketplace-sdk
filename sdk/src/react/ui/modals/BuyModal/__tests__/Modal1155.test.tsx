import { act, fireEvent, render, screen } from '@test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Order } from '../../../../_internal';
import {
	MarketplaceKind,
	MarketplaceType,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';
import { ERC1155QuantityModal } from '../ERC1155QuantityModal';
import { buyModalStore } from '../store';

const testOrder: Order = {
	chainId: 1,
	orderId: '1',
	collectionContractAddress: '0x123',
	createdAt: '2023-01-01T00:00:00Z',
	createdBy: '0x123',
	feeBps: 250,
	feeBreakdown: [],
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1',
	priceAmountNet: '975000000000000000',
	side: OrderSide.listing,
	status: OrderStatus.active,
	originName: '',
	priceAmountNetFormatted: '',
	priceCurrencyAddress: '',
	priceDecimals: 0,
	priceUSD: 0,
	priceUSDFormatted: '',
	quantityInitial: '10',
	quantityInitialFormatted: '10',
	quantityRemaining: '10',
	quantityRemainingFormatted: '10',
	quantityAvailable: '10',
	quantityAvailableFormatted: '10',
	quantityDecimals: 0,
	validFrom: '',
	validUntil: '',
	blockNumber: 0,
	updatedAt: '',
};

describe('ERC1155QuantityModal', () => {
	beforeEach(() => {
		// Initialize the store before each test
		buyModalStore.send({
			type: 'open',
			props: {
				chainId: 1,
				orderId: '1',
				collectionAddress: '0x123' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				marketplaceType: MarketplaceType.MARKET,
			},
		});
	});

	afterEach(() => {
		// Reset the store after each test
		buyModalStore.send({ type: 'close' });
	});

	it('should render quantity modal with order details', async () => {
		render(<ERC1155QuantityModal order={testOrder} />);

		// Check if the modal renders with the correct title
		expect(screen.getByText('Select Quantity')).toBeInTheDocument();

		// Check if the Buy now button exists
		const buyButton = await screen.findByRole('button', { name: /buy now/i });
		expect(buyButton).toBeInTheDocument();
		// Capture the initial store state
		const initialState = buyModalStore.getSnapshot();
		expect(initialState.context.quantity).toBeUndefined();

		// Click the Buy now button with default quantity "1"
		await act(async () => {
			fireEvent.click(buyButton);
		});

		// Ensure the store context was updated with the correct quantity
		const updatedState = buyModalStore.getSnapshot();
		expect(updatedState.context.quantity).toBe(1);
	});

	it('should update quantity when user changes the input value', async () => {
		render(<ERC1155QuantityModal order={testOrder} />);

		// Find the quantity input using label text
		const quantityInput = await screen.findByLabelText('Enter quantity');

		// Capture initial store state
		const initialState = buyModalStore.getSnapshot();
		expect(initialState.context.quantity).toBeUndefined();

		// Change quantity to 5
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '5' } });
		});

		// Click Buy now button
		const buyButton = screen.getByRole('button', { name: /buy now/i });
		await act(async () => {
			fireEvent.click(buyButton);
		});

		// Check that the store is updated with quantity = 5
		const updatedState = buyModalStore.getSnapshot();
		expect(updatedState.context.quantity).toBe(5);
	});

	it('should validate input quantity against available quantity', async () => {
		render(<ERC1155QuantityModal order={testOrder} />);

		const quantityInput = await screen.findByLabelText('Enter quantity');

		const invalidQuantity = '';
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: invalidQuantity } });
		});

		const buyButton = await screen.findByRole('button', { name: /buy now/i });
		// The button should be disabled due to invalid quantity
		expect(buyButton).toBeDisabled();

		// Set valid quantity
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '10' } });
		});

		// Button should be enabled
		expect(buyButton).not.toBeDisabled();

		// Click the button and check store update
		await act(async () => {
			fireEvent.click(buyButton);
		});

		const updatedState = buyModalStore.getSnapshot();
		expect(updatedState.context.quantity).toBe(10);
	});
});
