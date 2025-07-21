'use client';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { delay, HttpResponse, http } from 'msw';
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

const receiptSubscriptionHandler = http.post(
	/.*\/rpc\/Indexer\/SubscribeReceipts/,
	async ({ request }) => {
		const bodyText = await request.text(); // it's NDJSON so get raw text
		console.log('MSW: SubscribeReceipts request intercepted');
		console.log('Raw NDJSON body:', bodyText);

		await delay(1000);

		const mockReceipt = {
			receipt: {
				txnHash: '0x60e6c2c56e72c70d2de015b2c2cd5897771dac4fefc8a3a5a7',
				txnStatus: 'SUCCESSFUL',
				txnIndex: 1,
				txnType: 'LegacyTxnType',
				blockHash:
					'0xe7824d94c99bc153815da36053cac277b1c1917b680ccd9f694a68cac27b104f',
				blockNumber: 23971549,
				gasUsed: 288131,
				gasPrice: '51343618108',
				from: '0x0000000000000000000000000000000000000000',
				to: '0x0000000000000000000000000000000000000000',
				logs: [
					{
						contractAddress: '0x2e175ba84cce94d28be1379846c90c573a5b5ba0',
						data: '0x1f80c270867c739ea2a7b25293d1a',
					},
				],
			},
		};

		return new HttpResponse(JSON.stringify(mockReceipt) + '\n', {
			status: 200,
			headers: {
				'Content-Type': 'application/x-ndjson',
			},
		});
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

const waasFeeOptionsHandler = http.post(
	'*/rpc/WaasAuthenticator/SendIntent',
	() => {
		return HttpResponse.json({
			response: {
				code: 'feeOptions',
				data: {
					feeOptions: [
						{
							gasLimit: 100000,
							to: '0x7e08701cC9194eF4fFD82421dd0d986d1B43D521',
							token: {
								chainId: 137,
								contractAddress: null,
								decimals: 18,
								logoURL:
									'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png',
								name: 'POL',
								symbol: 'POL',
								tokenID: null,
								type: 'unknown',
							},
							value: '12034316824415928',
						},
						{
							gasLimit: 100000,
							to: '0x7e08701cC9194eF4fFD82421dd0d986d1B43D521',
							token: {
								chainId: 137,
								contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
								decimals: 18,
								logoURL:
									'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
								name: 'Wrapped Ether',
								symbol: 'WETH',
								tokenID: null,
								type: 'erc20Token',
							},
							value: '898040162002',
						},
						{
							gasLimit: 100000,
							to: '0x7e08701cC9194eF4fFD82421dd0d986d1B43D521',
							token: {
								chainId: 137,
								contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
								decimals: 6,
								logoURL:
									'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png',
								name: 'USDC',
								symbol: 'USDC',
								tokenID: null,
								type: 'erc20Token',
							},
							value: '3155',
						},
						{
							gasLimit: 100000,
							to: '0x7e08701cC9194eF4fFD82421dd0d986d1B43D521',
							token: {
								chainId: 137,
								contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
								decimals: 6,
								logoURL:
									'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png',
								name: 'Bridged USDC',
								symbol: 'USDC.e',
								tokenID: null,
								type: 'erc20Token',
							},
							value: '3116',
						},
						{
							gasLimit: 100000,
							to: '0x7e08701cC9194eF4fFD82421dd0d986d1B43D521',
							token: {
								chainId: 137,
								contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
								decimals: 6,
								logoURL:
									'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png',
								name: 'USDT',
								symbol: 'USDT',
								tokenID: null,
								type: 'erc20Token',
							},
							value: '3154',
						},
					],
					feeQuote:
						'/7N/AwEBCEZlZVF1b3RlAf+AAAEKARFUcmFuc2FjdGlvbkRpZ2VzdAH/ggABDUlzV2hpdGVsaXN0ZWQBAgABCkdhc1Nwb25zb3IBBgABB0dhc1RhbmsBBgABCEdhc1VzYWdlAQYAAQhHYXNQcmljZQH/hAABC05hdGl2ZVByaWNlAf+EAAELVG9rZW5QcmljZXMB/4YAAQlFeHBpcmVzQXQB/4gAAQlTaWduYXR1cmUBCgAAABT/gQEBAQRIYXNoAf+CAAEGAUAAAAr/gwUBAv+KAAAAJP+FBAEBE21hcFtzdHJpbmddKmJpZy5JbnQB/4YAAQwB/4QAAAr/hwUBAv+MAAAA/97/gAEgIP+JKQ0cGCc0YXob/+f//v/k/8//2SpuO21W/6n/kBAaIf+9/6b//mr/if+mBP0EPCQBBgIJKnHnuAEJAgNAq7rv4IAAAQQEd2V0aAoCubOcc3JCYAAABHVzZGMJAg3gX2PpfgAABXVzZGNlCQIN4F9j6X4AAAR1c2R0CQIN4Lazp2QAAAEPAQAAAA7gCwd2K3D+wf//AUG2LvwFR3uZbe3nL6/ZBH6G1Fv7t/nKSeaOchVvUNvfa2SlzeXCj3hDxazpFF3WeL1mXep7pjBArKp6kpp263dbHAA=',
				},
			},
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
				receiptSubscriptionHandler,
				sellOnlyHandler,
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

		// Click accept button to start transaction
		const acceptButton = body.getByText('Accept');
		await userEvent.click(acceptButton);

		// Wait for transaction status modal
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Verify transaction pending state
		const pendingTitle = body.getByText('Processing transaction');
		await expect(pendingTitle).toBeInTheDocument();

		// Wait for transaction to complete
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Verify success state
		const successTitle = body.getByText('Transaction complete');
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

		await userEvent.click(acceptButton);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const pendingTitle = body.getByText('Processing transaction');
		await expect(pendingTitle).toBeInTheDocument();

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const successTitle = body.getByText('Transaction complete');
		await expect(successTitle).toBeInTheDocument();

		const closeButton = body.getByRole('button', { name: /close/i });
		await userEvent.click(closeButton);

		await new Promise((resolve) => setTimeout(resolve, 500));
		await expect(sellModal$.isOpen.get()).toBe(false);
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

export const WithWaasFeeOptions: Story = {
	parameters: {
		msw: {
			handlers: [
				sellOnlyHandler,
				waasFeeOptionsHandler,
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

		// Check for specific fee options
		const polOption = body.getByText('POL');
		await expect(polOption).toBeInTheDocument();

		const wethOption = body.getByText('WETH');
		await expect(wethOption).toBeInTheDocument();

		const usdcOption = body.getByText('USDC');
		await expect(usdcOption).toBeInTheDocument();

		const usdceOption = body.getByText('USDC.e');
		await expect(usdceOption).toBeInTheDocument();

		const usdtOption = body.getByText('USDT');
		await expect(usdtOption).toBeInTheDocument();
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
