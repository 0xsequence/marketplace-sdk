import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, fn, userEvent, within } from 'storybook/test';
import { defaultHandlers } from '../../../../../test/handlers';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
	StepType,
} from '../../../_internal';
import TransactionStatusModal from '../../modals/_internal/components/transactionStatusModal';
import { SellModal } from './Modal';
import { sellModal$ } from './store';

const meta: Meta<typeof SellModal> = {
	title: 'Modals/SellModal',
	component: SellModal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The SellModal component handles accepting offers for collectibles in the marketplace.
It shows offer details, token preview, and transaction details with support for WaaS fee options.

## Manual Testing

**Test the modal functionality:**

1. **Open/Close** - Modal should open with offer details and close properly
2. **WaaS Integration** - Should show fee options for WaaS wallets
3. **Transaction Flow** - Should handle approval and transaction steps
4. **Error States** - Should display error modal for invalid data

## MSW Integration

All stories use Mock Service Worker (MSW) to mock API requests, ensuring the modal works with realistic data.
        `,
			},
		},
		msw: {
			handlers: [
				...defaultHandlers.success,
				// Override the GenerateSellTransaction handler to only return sell step
				http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
					return HttpResponse.json({
						steps: [
							{
								id: StepType.sell,
								data: '0x61c2926c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fdb42a198a932c8d3b506ffa5e855bc4b348a712000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000104dd0de6ec00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f2ea13ce762226468deac9d69c8e77d29182167600000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006876445400000000000000000000000041e94eb019c0762f9bfcf9fb1e58725bfb0e7582000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000',
								to: '0x1234567890123456789012345678901234567890',
								value: '0',
								price: '0',
							},
						],
					});
				}),
			],
		},
	},
	decorators: [
		(Story) => (
			<>
				<Story />
				<TransactionStatusModal />
			</>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SellModal>;

// Mock data
const MOCK_ADDRESS = '0x1234567890123456789012345678901234567890' as const;
const MOCK_ORDER = {
	orderId: 'order-123',
	marketplace: MarketplaceKind.sequence_marketplace_v1,
	side: OrderSide.offer,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'Mock Origin',
	collectionContractAddress: MOCK_ADDRESS,
	tokenId: '123',
	createdBy: MOCK_ADDRESS,
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000',
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	priceDecimals: 18,
	priceUSD: 1000,
	priceUSDFormatted: '$1,000.00',
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: '2024-01-01T00:00:00Z',
	validUntil: '2024-12-31T23:59:59Z',
	blockNumber: 12345678,
	orderCreatedAt: '2024-01-01T00:00:00Z',
	orderUpdatedAt: '2024-01-01T00:00:00Z',
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

type ModalCallbacks = {
	onSuccess?: (args: { hash?: `0x${string}`; orderId?: string }) => void;
	onError?: (error: Error) => void;
	onBuyAtFloorPrice?: undefined & (() => void);
};

type ModalState = {
	tokenId: string;
	collectionAddress: `0x${string}`;
	chainId: number;
	order?: typeof MOCK_ORDER;
	callbacks?: ModalCallbacks;
	steps: {
		approval: {
			exist: boolean;
			isExecuting: boolean;
			execute: Promise<void> & (() => Promise<void>);
		};
		transaction: {
			exist: boolean;
			isExecuting: boolean;
			execute: Promise<void> & (() => Promise<void>);
		};
	};
	isOpen: boolean;
	sellIsBeingProcessed: boolean;
	open: () => void;
	close: () => void;
};

const initializeModalState = (overrides: Partial<ModalState> = {}) => {
	const defaultState: ModalState = {
		tokenId: '123',
		collectionAddress: MOCK_ADDRESS,
		chainId: 1,
		order: MOCK_ORDER,
		callbacks: {
			onSuccess: (args) => fn()(args),
			onError: (error) => fn()(error),
		},
		steps: {
			approval: {
				exist: false,
				isExecuting: false,
				execute: Promise.resolve() as Promise<void> & (() => Promise<void>),
			},
			transaction: {
				exist: false,
				isExecuting: false,
				execute: Promise.resolve() as Promise<void> & (() => Promise<void>),
			},
		},
		isOpen: true,
		sellIsBeingProcessed: false,
		open: () => {},
		close: () => sellModal$.isOpen.set(false),
	};

	// Deep merge for steps to preserve execute functions
	if (overrides.steps) {
		return {
			...defaultState,
			...overrides,
			steps: {
				approval: {
					...defaultState.steps.approval,
					...overrides.steps.approval,
					execute:
						overrides.steps.approval?.execute ??
						defaultState.steps.approval.execute,
				},
				transaction: {
					...defaultState.steps.transaction,
					...overrides.steps.transaction,
					execute:
						overrides.steps.transaction?.execute ??
						defaultState.steps.transaction.execute,
				},
			},
		};
	}

	return { ...defaultState, ...overrides };
};

export const Default: Story = {
	decorators: [
		(Story) => {
			// Initialize modal state with mock transaction functions
			sellModal$.set(
				initializeModalState({
					steps: {
						approval: {
							exist: false,
							isExecuting: false,
							execute: Promise.resolve() as Promise<void> &
								(() => Promise<void>),
						},
						transaction: {
							exist: false,
							isExecuting: false,
							execute: Promise.resolve() as Promise<void> &
								(() => Promise<void>),
						},
					},
				}),
			);
			return <Story />;
		},
	],
	play: async () => {
		const body = within(document.body);

		// Wait for modal to render
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify modal content
		const title = body.getByText('You have an offer');
		await expect(title).toBeInTheDocument();

		const offerPrice = body.getByText('1.0 ETH');
		await expect(offerPrice).toBeInTheDocument();

		// Click accept button to start transaction
		const acceptButton = body.getByText('Accept');
		await userEvent.click(acceptButton);

		// Wait for transaction status modal
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify transaction pending state
		const pendingTitle = body.getByText('Transaction Pending');
		await expect(pendingTitle).toBeInTheDocument();

		// Wait for transaction to complete
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Verify success state
		const successTitle = body.getByText('Transaction Complete');
		await expect(successTitle).toBeInTheDocument();

		// Close transaction status modal
		const closeButton = body.getByRole('button', { name: /close/i });
		await userEvent.click(closeButton);

		// Verify both modals are closed
		await new Promise((resolve) => setTimeout(resolve, 500));
		await expect(sellModal$.isOpen.get()).toBe(false);
	},
};

export const WithApprovalStep: Story = {
	decorators: [
		(Story) => {
			sellModal$.set(
				initializeModalState({
					steps: {
						approval: {
							exist: true,
							isExecuting: false,
							execute: Promise.resolve() as Promise<void> &
								(() => Promise<void>),
						},
						transaction: {
							exist: false,
							isExecuting: false,
							execute: Promise.resolve() as Promise<void> &
								(() => Promise<void>),
						},
					},
				}),
			);
			return <Story />;
		},
	],
	play: async () => {
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify approval button exists
		const approveButton = body.getByText('Approve TOKEN');
		await expect(approveButton).toBeInTheDocument();
	},
};

export const WithWaaSFeeOptions: Story = {
	decorators: [
		(Story) => {
			sellModal$.set(
				initializeModalState({
					sellIsBeingProcessed: true,
				}),
			);
			return <Story />;
		},
	],
	play: async () => {
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// Click accept button to show fee options
		const acceptButton = body.getByText('Accept');
		await userEvent.click(acceptButton);

		// Verify fee options appear
		await new Promise((resolve) => setTimeout(resolve, 500));
		const feeOptions = body.getByText('Loading fee options');
		await expect(feeOptions).toBeInTheDocument();
	},
};

export const ErrorState: Story = {
	parameters: {
		msw: {
			handlers: defaultHandlers.error,
		},
	},
	decorators: [
		(Story) => {
			sellModal$.set(
				initializeModalState({
					tokenId: '999',
					collectionAddress: '0xInvalidAddress',
					order: undefined,
				}),
			);
			return <Story />;
		},
	],
	play: async () => {
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify error state
		const errorTitle = body.getByText('You have an offer');
		await expect(errorTitle).toBeInTheDocument();
	},
};
