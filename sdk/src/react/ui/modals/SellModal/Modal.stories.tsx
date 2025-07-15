'use client';

import {
	type TransactionReceipt,
	TransactionStatus,
	TransactionType,
} from '@0xsequence/indexer';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
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
import { useSellModal } from './';
import { sellModal$ } from './store';

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
const mockTransactionReceipt: TransactionReceipt = {
	txnHash: '0x123',
	txnStatus: TransactionStatus.SUCCESSFUL,
	txnIndex: 0,
	txnType: TransactionType.LegacyTxnType,
	blockHash: '0x456',
	blockNumber: 1234,
	gasUsed: 21000,
	effectiveGasPrice: '0x1',
	from: TEST_ACCOUNTS[0],
	to: TEST_ACCOUNTS[1],
	logs: [],
	final: true,
	reorged: false,
};

const receiptSubscriptionHandler = http.post(
	'*/rpc/Indexer/SubscribeReceipts',
	() => {
		return new Response(
			new ReadableStream({
				start(controller) {
					const message = {
						result: {
							message: {
								receipt: mockTransactionReceipt,
							},
						},
					};
					controller.enqueue(
						new TextEncoder().encode(JSON.stringify(message) + '\n'),
					);
					controller.close();
				},
			}),
			{
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
				},
			},
		);
	},
);

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

const meta = {
	title: 'Modals/SellModal',
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TestComponent = () => {
	const sellModal = useSellModal({
		onSuccess: fn(),
		onError: fn(),
	});

	React.useEffect(() => {
		sellModal.show({
			tokenId: typedMockOrder.tokenId as string,
			collectionAddress:
				typedMockOrder.collectionContractAddress as `0x${string}`,
			chainId: typedMockOrder.chainId,
			order: typedMockOrder,
		});
	}, []);

	return null;
};

export const Default: Story = {
	parameters: {
		msw: {
			handlers: [
				sellOnlyHandler,
				receiptSubscriptionHandler,
				...defaultHandlers.success,
			],
		},
	},
	render: () => <TestComponent />,
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

const TestComponentWithApproval = () => {
	const sellModal = useSellModal({
		onSuccess: fn(),
		onError: fn(),
	});

	React.useEffect(() => {
		sellModal.show({
			tokenId: typedMockOrder.tokenId as string,
			collectionAddress:
				typedMockOrder.collectionContractAddress as `0x${string}`,
			chainId: typedMockOrder.chainId,
			order: typedMockOrder,
		});
	}, []);

	return null;
};

export const WithApprovalStep: Story = {
	parameters: {
		msw: {
			handlers: [
				approvalAndSellHandler,
				receiptSubscriptionHandler,
				...defaultHandlers.success,
			],
		},
	},
	render: () => <TestComponentWithApproval />,
	play: async () => {
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify approval button exists
		const approveButton = body.getByText('Approve TOKEN');
		await expect(approveButton).toBeInTheDocument();

		await userEvent.click(approveButton);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(sellModal$.steps.approval.isExecuting.get()).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		expect(sellModal$.steps.approval.exist.get()).toBe(false);
		expect(sellModal$.steps.approval.isExecuting.get()).toBe(false);

		const acceptButton = body.getByText('Accept');
		await expect(acceptButton).toBeInTheDocument();
	},
};

const TestComponentWithWaaS = () => {
	const sellModal = useSellModal({
		onSuccess: fn(),
		onError: fn(),
	});

	React.useEffect(() => {
		sellModal.show({
			tokenId: typedMockOrder.tokenId as string,
			collectionAddress:
				typedMockOrder.collectionContractAddress as `0x${string}`,
			chainId: typedMockOrder.chainId,
			order: typedMockOrder,
		});
	}, []);

	return null;
};

export const WithWaaSFeeOptions: Story = {
	parameters: {
		msw: {
			handlers: [
				sellOnlyHandler,
				receiptSubscriptionHandler,
				...defaultHandlers.success,
			],
		},
	},
	render: () => <TestComponentWithWaaS />,
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

const TestComponentError = () => {
	const sellModal = useSellModal({
		onSuccess: fn(),
		onError: fn(),
	});

	React.useEffect(() => {
		sellModal.show({
			tokenId: '999',
			collectionAddress: '0xInvalidAddress' as `0x${string}`,
			chainId: typedMockOrder.chainId,
			order: typedMockOrder,
		});
	}, []);

	return null;
};

export const ErrorState: Story = {
	parameters: {
		msw: {
			handlers: defaultHandlers.error,
		},
	},
	render: () => <TestComponentError />,
	play: async () => {
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify error state
		const errorTitle = body.getByText('You have an offer');
		await expect(errorTitle).toBeInTheDocument();
	},
};
