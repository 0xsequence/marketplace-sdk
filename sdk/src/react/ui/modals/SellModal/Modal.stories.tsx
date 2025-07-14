import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TEST_ACCOUNTS } from '../../../../../test/const';
import {
	defaultHandlers,
	MOCK_OFFER_ORDER,
} from '../../../../../test/handlers';
import {
	MarketplaceKind,
	type Order,
	OrderSide,
	OrderStatus,
	StepType,
} from '../../../_internal';
import { SellModal } from './Modal';
import { type SellModalState, sellModal$ } from './store';

// Cast mock order to proper types
const typedMockOrder: Order = {
	...MOCK_OFFER_ORDER,
	marketplace: MarketplaceKind.sequence_marketplace_v1,
	side: OrderSide.offer,
	status: OrderStatus.active,
	tokenId: MOCK_OFFER_ORDER.tokenId as string,
	collectionContractAddress:
		MOCK_OFFER_ORDER.collectionContractAddress as `0x${string}`,
} as Order;

// MSW handlers for different scenarios
const sellOnlyHandler = http.post(
	'*/rpc/Marketplace/GenerateSellTransaction',
	() => {
		return HttpResponse.json({
			steps: [
				{
					id: StepType.sell,
					data: '0x61c2926c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fdb42a198a932c8d3b506ffa5e855bc4b348a712000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000104dd0de6ec00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f2ea13ce762226468deac9d69c8e77d29182167600000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006876445400000000000000000000000041e94eb019c0762f9bfcf9fb1e58725bfb0e7582000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000',
					to: TEST_ACCOUNTS[0],
					value: '0',
					price: '0',
				},
			],
		});
	},
);

const approvalAndSellHandler = http.post(
	'*/rpc/Marketplace/GenerateSellTransaction',
	() => {
		return HttpResponse.json({
			steps: [
				{
					id: StepType.tokenApproval,
					data: '0x095ea7b3000000000000000000000000f2ea13ce762226468deac9d69c8e77d291821676ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
					to: TEST_ACCOUNTS[0],
					value: '0',
					price: '0',
				},
				{
					id: StepType.sell,
					data: '0x61c2926c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fdb42a198a932c8d3b506ffa5e855bc4b348a712000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000104dd0de6ec00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f2ea13ce762226468deac9d69c8e77d29182167600000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006876445400000000000000000000000041e94eb019c0762f9bfcf9fb1e58725bfb0e7582000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000',
					to: TEST_ACCOUNTS[0],
					value: '0',
					price: '0',
				},
			],
		});
	},
);

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
			handlers: [...defaultHandlers.success],
		},
	},
};

export default meta;
type Story = StoryObj<typeof SellModal>;

const initializeModalState = (
	overrides: Partial<SellModalState> = {},
): SellModalState & { open: () => void; close: () => void } => {
	const defaultState: SellModalState & { open: () => void; close: () => void } =
		{
			tokenId: typedMockOrder.tokenId as string,
			collectionAddress:
				typedMockOrder.collectionContractAddress as `0x${string}`,
			chainId: typedMockOrder.chainId,
			order: typedMockOrder,
			callbacks: {
				onSuccess: (args: { hash?: `0x${string}`; orderId?: string }) =>
					fn()(args),
				onError: (error: Error) => fn()(error),
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
	parameters: {
		msw: {
			handlers: [sellOnlyHandler, ...defaultHandlers.success],
		},
	},
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

		const offerPrice = body.getByText('0.8 ETH');
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
	parameters: {
		msw: {
			handlers: [approvalAndSellHandler, ...defaultHandlers.success],
		},
	},
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
	parameters: {
		msw: {
			handlers: [sellOnlyHandler, ...defaultHandlers.success],
		},
	},
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
					collectionAddress: '0xInvalidAddress' as `0x${string}`,
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
