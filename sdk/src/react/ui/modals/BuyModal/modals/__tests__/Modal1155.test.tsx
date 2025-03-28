import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@test';
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';
import { createMockWallet } from '../../../../../../../test/mocks/wallet';
import type { Order, TokenMetadata } from '../../../../../_internal';
import {
	mockOrder as baseMockOrder,
	mockTokenMetadata,
} from '../../../../../_internal/api/__mocks__/marketplace.msw';
import { buyModal$ } from '../../store';
import { ERC1155QuantityModal } from '../Modal1155';

vi.mock(import('../../../../../hooks'), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
	};
});

const mockWallet = createMockWallet();

const getChainIdMock = mockWallet.getChainId as Mock<
	typeof mockWallet.getChainId
>;
const switchChainMock = mockWallet.switchChain as Mock<
	typeof mockWallet.switchChain
>;

vi.mock('../../../../../_internal/wallet/useWallet', () => ({
	useWallet: () => ({
		wallet: mockWallet,
	}),
}));

// Mock switch chain modal hook
vi.mock('../../_internal/components/switchChainModal', () => ({
	useSwitchChainModal: () => ({
		show: vi.fn(),
	}),
}));

vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: vi.fn().mockReturnValue([]),
}));

describe.skip('ERC1155QuantityModal', () => {
	// Customize the mock order for ERC1155 testing with specific price for predictable calculations
	const mockOrder: Order = {
		...baseMockOrder,
		priceAmount: '1000000000000000000', // 1 ETH in wei
		priceAmountFormatted: '1',
		quantityRemaining: '10',
		quantityRemainingFormatted: '10',
		quantityAvailable: '10',
		quantityAvailableFormatted: '10',
		quantityDecimals: 0,
	};

	const mockCollectable: TokenMetadata = mockTokenMetadata;

	const mockBuy = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		// Reset the modal state
		buyModal$.close();
		buyModal$.state.checkoutModalLoaded.set(false);
		buyModal$.state.checkoutModalIsLoading.set(false);
		buyModal$.state.invalidQuantity.set(false);
		buyModal$.state.quantity.set('10'); // Match the initial quantity with the mock order

		// Reset mock wallet calls
		switchChainMock.mockClear();
	});

	afterEach(() => {
		buyModal$.close();
		cleanup();
		vi.clearAllMocks();
	});

	it.skip('should render quantity input correctly', async () => {
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
		expect(quantityInput).toHaveValue('10'); // Match the initial quantity

		// Wait for price to be displayed
		await waitFor(() => {
			const priceLabels = screen.getAllByText('Total Price');
			const priceContainer = priceLabels[0].parentElement;
			if (!priceContainer) throw new Error('Price container not found');

			// Check for the price without decimal
			const priceElement = within(priceContainer).getByText('10');
			expect(priceElement).toBeInTheDocument();
			expect(within(priceContainer).getByText('ETH')).toBeInTheDocument();
		});

		// Verify buy button
		const buyButton = screen.getByRole('button', { name: /buy now/i });
		expect(buyButton).toBeInTheDocument();
		expect(buyButton).not.toBeDisabled();

		// Verify currency image (not NFT image)
		const currencyImage = screen.getByRole('img', { name: '' });
		expect(currencyImage).toBeInTheDocument();
		// expect(currencyImage).toHaveAttribute('src', mockCurrencies[0].imageUrl);
	});

	it.skip('should update total price when quantity changes', async () => {
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

		// Wait for updated price to be displayed
		await waitFor(() => {
			const priceLabels = screen.getAllByText('Total Price');
			const priceContainer = priceLabels[0].parentElement;
			if (!priceContainer) throw new Error('Price container not found');

			// Check for the price without decimal
			const priceElement = within(priceContainer).getByText('2');
			expect(priceElement).toBeInTheDocument();
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

	it.skip('should calculate total price correctly', async () => {
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

		// Wait for modal content to be fully loaded
		await waitFor(() => {
			expect(screen.getByText('Select Quantity')).toBeInTheDocument();
			expect(
				screen.getByRole('textbox', { name: /enter quantity/i }),
			).toBeInTheDocument();
			expect(screen.getAllByText('Total Price')[0]).toBeInTheDocument();
		});

		// Wait for initial price
		await waitFor(() => {
			const priceLabels = screen.getAllByText('Total Price');
			const priceContainer = priceLabels[0].parentElement;
			if (!priceContainer) throw new Error('Price container not found');

			// Check for the price without decimal
			const priceElement = within(priceContainer).getByText('10');
			expect(priceElement).toBeInTheDocument();
			expect(within(priceContainer).getByText('ETH')).toBeInTheDocument();
		});

		// Change quantity to 3
		const quantityInput = screen.getByRole('textbox', {
			name: /enter quantity/i,
		});
		await act(async () => {
			fireEvent.change(quantityInput, { target: { value: '3' } });
		});

		// Wait for updated price
		await waitFor(() => {
			const priceLabels = screen.getAllByText('Total Price');
			const priceContainer = priceLabels[0].parentElement;
			if (!priceContainer) throw new Error('Price container not found');

			// Check for the price without decimal
			const priceElement = within(priceContainer).getByText('3');
			expect(priceElement).toBeInTheDocument();
		});
	});

	it.skip('should handle chain mismatch correctly', async () => {
		// Mock wallet to return a different chain ID
		getChainIdMock.mockResolvedValueOnce(2); // Different from order.chainId (1)

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

		const buyButton = screen.getByRole('button', { name: /buy now/i });

		// Click buy button
		fireEvent.click(buyButton);

		// Verify chain switch was attempted
		await waitFor(() => {
			expect(getChainIdMock).toHaveBeenCalled();
		});

		// Verify buy function was not called
		expect(mockBuy).not.toHaveBeenCalled();
	});
});
