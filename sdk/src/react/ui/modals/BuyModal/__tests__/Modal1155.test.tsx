import {
	act,
	fireEvent,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Order } from '../../../../_internal';
import { MarketplaceKind, OrderSide, OrderStatus } from '../../../../_internal';
import type { DatabeatAnalytics } from '../../../../_internal/databeat';
import { ERC1155QuantityModal } from '../components/ERC1155QuantityModal';
import { buyModalStore } from '../store';

const analyticsFn = {
	trackBuyModalOpened: vi.fn(),
} as unknown as DatabeatAnalytics;

const testOrder: Order = {
	chainId: 1,
	orderId: '1',
	collectionContractAddress: '0x1234567890123456789012345678901234567890',
	createdAt: '2023-01-01T00:00:00Z',
	createdBy: '0x123',
	feeBps: 250,
	feeBreakdown: [],
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: '1',
	priceAmountNet: 975000000000000000n,
	side: OrderSide.listing,
	status: OrderStatus.active,
	originName: '',
	slug: 'test-order',
	priceAmountNetFormatted: '',
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	priceDecimals: 0,
	priceUSD: 0,
	priceUSDFormatted: '',
	quantityInitial: 10n,
	quantityInitialFormatted: '10',
	quantityRemaining: 10n,
	quantityRemainingFormatted: '10',
	quantityAvailable: 10n,
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
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: 1n,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				cardType: 'market',
			},
			analyticsFn,
		});
	});

	afterEach(() => {
		// Reset the store after each test
		buyModalStore.send({ type: 'close' });
	});

	it.skip('should render quantity modal with order details', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				cardType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining={10n}
			/>,
		);

		// Check if the modal renders with the correct title
		expect(screen.getByText('Select Quantity')).toBeInTheDocument();

		// Wait for spinner to disappear if it exists
		try {
			await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
		} catch (_error) {
			// If no spinner or already gone, continue
		}

		// Check if the Buy now button exists
		const buyButton = await screen.findByRole('button', { name: /buy now/i });
		expect(buyButton).toBeInTheDocument();

		// Capture the initial store state
		const initialState = buyModalStore.getSnapshot();
		expect(initialState.context.quantity).toBeNull();

		// Check for Total Price section
		await act(async () => {
			expect(await screen.findByText('Total Price')).toBeInTheDocument();
		});

		// Click the Buy now button with default quantity "1"
		await act(async () => {
			fireEvent.click(buyButton);
		});

		// Ensure the store context was updated with the correct quantity
		const updatedState = buyModalStore.getSnapshot();
		expect(updatedState.context.quantity).toBe(1);
	});

	it.skip('should update quantity when user changes the input value', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				cardType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining={10n}
			/>,
		);

		// Wait for spinner to disappear if it exists
		try {
			await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
		} catch (_error) {
			// If no spinner or already gone, continue
		}

		// Find the quantity input using role and name
		const quantityInput = await screen.findByRole('textbox', {
			name: /enter quantity/i,
		});

		// Capture initial store state
		const initialState = buyModalStore.getSnapshot();
		expect(initialState.context.quantity).toBeNull();

		// Change quantity to 5
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '5' } });
		});

		// Click Buy now button
		const buyButton = await screen.findByRole('button', { name: /buy now/i });
		await act(async () => {
			fireEvent.click(buyButton);
		});

		// Check that the store is updated with quantity = 5
		const updatedState = buyModalStore.getSnapshot();
		expect(updatedState.context.quantity).toBe(5);
	});

	it.skip('should validate input quantity against available quantity', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				cardType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining={10n}
			/>,
		);

		// Wait for spinner to disappear if it exists
		try {
			await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
		} catch (_error) {
			// If no spinner or already gone, continue
		}

		// Find the quantity input using role and name
		const quantityInput = await screen.findByRole('textbox', {
			name: /enter quantity/i,
		});

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
	it.skip('should display total price based on selected quantity', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				cardType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining={10n}
			/>,
		);

		// Wait for spinner to disappear - this indicates queries have loaded
		await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));

		// Now that queries have loaded, the Total Price section should be displayed
		expect(screen.getByText('Total Price')).toBeInTheDocument();

		// The price should be calculated and displayed (not loading anymore)
		// Based on testOrder: priceAmount: '1000000000000000000' (1 ETH) with quantity 1
		// Should show formatted price with currency symbol
		expect(screen.getByText('ETH')).toBeInTheDocument();
	});

	//   it("should show error modal when required props are missing", async () => {
	//     render(
	//       <ERC1155QuantityModal
	//         order={testOrder}
	//         cardType={'market'}
	//         chainId={1}
	//       />
	//     );

	//     // Should show error modal
	//     expect(screen.getByText("Error")).toBeInTheDocument();
	//   });
});
