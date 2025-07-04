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
				marketplaceType: 'market',
			},
			analyticsFn,
		});
	});

	afterEach(() => {
		// Reset the store after each test
		buyModalStore.send({ type: 'close' });
	});

	it('should render quantity modal with order details', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				marketplaceType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining="10"
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

	it('should update quantity when user changes the input value', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				marketplaceType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining="10"
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

	it('should validate input quantity against available quantity', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				marketplaceType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining="10"
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
	it('should display total price based on selected quantity', async () => {
		render(
			<ERC1155QuantityModal
				order={testOrder}
				marketplaceType={'market'}
				chainId={1}
				quantityDecimals={0}
				quantityRemaining="10"
			/>,
		);

		// Wait for spinner to disappear if it exists
		try {
			await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
		} catch (_error) {
			// If no spinner or already gone, continue
		}

		// Check that Total Price section is displayed (using findByText for async)
		await act(async () => {
			expect(await screen.findByText('Total Price')).toBeInTheDocument();
		});

		// Initially, when no currency data is loaded, it should show loading
		await act(async () => {
			expect(await screen.findByText('Loading...')).toBeInTheDocument();
		});
	});

	//   it("should show error modal when required props are missing", async () => {
	//     render(
	//       <ERC1155QuantityModal
	//         order={testOrder}
	//         marketplaceType={'market'}
	//         chainId={1}
	//       />
	//     );

	//     // Should show error modal
	//     expect(screen.getByText("Error")).toBeInTheDocument();
	//   });
});
