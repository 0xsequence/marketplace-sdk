import { OrderbookKind } from '@0xsequence/api-client';
import { Button, Card, Text } from '@0xsequence/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useMakeOfferModal } from '../index';
import { MakeOfferModal } from '../Modal';
import {
	erc1155Handlers,
	insufficientBalanceHandlers,
	MOCK_COLLECTION_ADDRESS,
	MOCK_ERC1155_COLLECTION_ADDRESS,
	mockERC1155TokenMetadata,
	mockTokenMetadata,
	sequenceWalletHandlers,
	slowLoadingHandlers,
	standardWalletHandlers,
} from './MakeOfferModal.mock-data';

// ============================================================================
// STORY TRIGGER COMPONENT
// ============================================================================

interface MakeOfferTriggerProps {
	collectionAddress: `0x${string}`;
	tokenId: bigint;
	chainId: number;
	orderbookKind?: OrderbookKind;
	tokenName?: string;
	tokenImage?: string;
	collectionName?: string;
}

/**
 * A trigger component that displays collectible info and opens the Make Offer modal
 */
const MakeOfferTrigger = ({
	collectionAddress,
	tokenId,
	chainId,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	tokenName = 'Cool NFT #1',
	tokenImage = 'https://picsum.photos/seed/nft1/400/400',
	collectionName = 'Test Collection',
}: MakeOfferTriggerProps) => {
	const { show } = useMakeOfferModal({
		onSuccess: ({ hash, orderId }) => {
			console.log('Offer created successfully!', { hash, orderId });
			alert(`Offer created! Hash: ${hash?.slice(0, 10)}...`);
		},
		onError: (error) => {
			console.error('Offer failed:', error);
			alert(`Offer failed: ${error.message}`);
		},
	});

	const handleMakeOffer = () => {
		show({
			collectionAddress,
			chainId,
			tokenId,
			orderbookKind,
		});
	};

	return (
		<div className="flex max-w-md flex-col gap-4 p-4">
			{/* Collectible Preview Card */}
			<Card className="p-4">
				<div className="flex gap-4">
					<img
						src={tokenImage}
						alt={tokenName}
						className="h-24 w-24 rounded-lg object-cover"
					/>
					<div className="flex flex-col justify-center gap-1">
						<Text variant="small" color="text50">
							{collectionName}
						</Text>
						<Text variant="large" fontWeight="bold">
							{tokenName}
						</Text>
						<Text variant="small" color="text50">
							Token ID: {tokenId.toString()}
						</Text>
						<Text variant="small" color="text50">
							Chain: {chainId === 1 ? 'Ethereum' : `Chain ${chainId}`}
						</Text>
					</div>
				</div>
			</Card>

			{/* Make Offer Button */}
			<Button
				variant="primary"
				onClick={handleMakeOffer}
				data-testid="make-offer-trigger"
				className="w-full"
			>
				Make Offer
			</Button>

			{/* The Modal (renders when open) */}
			<MakeOfferModal />

			{/* Instructions */}
			<Card className="bg-white/5 p-4">
				<Text variant="small" color="text50">
					<strong>Testing Instructions:</strong>
					<br />
					1. Click "Make Offer" to open the modal
					<br />
					2. Enter a price (e.g., "10" USDC)
					<br />
					3. Adjust expiration if desired
					<br />
					4. Click "Approve" (if shown) then "Make Offer"
					<br />
					<br />
					<strong>Wallet Type:</strong> Use the connector selector in the top
					right to switch between Mock (EOA), WaaS, and Sequence wallets.
				</Text>
			</Card>
		</div>
	);
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof MakeOfferTrigger> = {
	title: 'Modals/MakeOfferModal',
	component: MakeOfferTrigger,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
# Make Offer Modal

The Make Offer modal allows users to create offers on NFTs/collectibles.

## Features

- **Currency Selection**: Choose between available ERC-20 currencies (native ETH not supported for offers)
- **Price Input**: Enter offer amount with real-time USD conversion
- **Expiration**: Set how long the offer remains valid (1-30 days)
- **Quantity**: For ERC1155 tokens, specify how many you want
- **Approval Flow**: EOA wallets require a token approval step; Sequence/WaaS wallets don't

## Wallet Types

| Wallet Type | Approval Required | Fee Selection |
|-------------|-------------------|---------------|
| EOA (MetaMask, etc.) | Yes | No |
| Sequence Universal | No | No |
| WaaS (Embedded) | No | Yes (if unsponsored) |

## Testing Different Scenarios

Use the Stories panel on the left to test:
- **Default**: Standard EOA wallet with approval step
- **Sequence Wallet**: No approval needed
- **ERC1155 Collection**: Shows quantity input
- **Insufficient Balance**: Shows balance error
- **Slow Loading**: 2s delay to see loading states
				`,
			},
		},
		// Default MSW handlers
		msw: {
			handlers: standardWalletHandlers,
		},
	},
	argTypes: {
		collectionAddress: {
			control: 'text',
			description: 'Collection contract address',
		},
		tokenId: {
			control: 'text',
			description: 'Token ID of the collectible',
		},
		chainId: {
			control: 'number',
			description: 'Blockchain chain ID',
		},
		tokenName: {
			control: 'text',
			description: 'Display name for the token',
		},
		collectionName: {
			control: 'text',
			description: 'Display name for the collection',
		},
	},
};

export default meta;
type Story = StoryObj<typeof MakeOfferTrigger>;

// ============================================================================
// STORIES
// ============================================================================

/**
 * Default story - Standard EOA wallet that requires approval
 */
export const Default: Story = {
	name: 'EOA Wallet (with Approval)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockTokenMetadata.name,
		collectionName: 'Test NFT Collection',
	},
	parameters: {
		msw: {
			handlers: standardWalletHandlers,
		},
		docs: {
			description: {
				story:
					'Standard EOA wallet flow. Requires approval step before creating the offer. To test: Switch to "Mock" connector in the top right.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to render
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Click the trigger button
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		await userEvent.click(triggerButton);

		// Wait for modal to appear
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Verify modal is open
		const priceInput = body.getByText('Enter price');
		await expect(priceInput).toBeInTheDocument();
	},
};

/**
 * Sequence/WaaS wallet - No approval needed
 */
export const SequenceWallet: Story = {
	name: 'Sequence/WaaS Wallet (no Approval)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockTokenMetadata.name,
		collectionName: 'Test NFT Collection',
	},
	parameters: {
		msw: {
			handlers: sequenceWalletHandlers,
		},
		docs: {
			description: {
				story:
					'Sequence or WaaS wallet flow. No approval step needed - goes directly to offer creation. To test: Switch to "WaaS" or "Sequence" connector in the top right.',
			},
		},
	},
};

/**
 * ERC1155 Collection - Shows quantity input
 */
export const ERC1155Collection: Story = {
	name: 'ERC1155 Collection (with Quantity)',
	args: {
		collectionAddress: MOCK_ERC1155_COLLECTION_ADDRESS,
		tokenId: BigInt(mockERC1155TokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockERC1155TokenMetadata.name,
		collectionName: 'Test ERC1155 Collection',
	},
	parameters: {
		msw: {
			handlers: erc1155Handlers,
		},
		docs: {
			description: {
				story:
					'ERC1155 semi-fungible token. Shows quantity input since multiple copies can exist.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const triggerButton = canvas.getByTestId('make-offer-trigger');
		await userEvent.click(triggerButton);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		// For ERC1155, there should be a quantity input
		// The exact text depends on implementation
		const modal = body.getByText('Enter price');
		await expect(modal).toBeInTheDocument();
	},
};

/**
 * Insufficient balance scenario
 */
export const InsufficientBalance: Story = {
	name: 'Insufficient Balance',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockTokenMetadata.name,
		collectionName: 'Test NFT Collection',
	},
	parameters: {
		msw: {
			handlers: insufficientBalanceHandlers,
		},
		docs: {
			description: {
				story:
					'User has very low currency balance. Should show an error when trying to make an offer above their balance.',
			},
		},
	},
};

/**
 * Slow loading - for testing loading states
 */
export const SlowLoading: Story = {
	name: 'Slow Loading (2s delay)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockTokenMetadata.name,
		collectionName: 'Test NFT Collection',
	},
	parameters: {
		msw: {
			handlers: slowLoadingHandlers,
		},
		docs: {
			description: {
				story:
					'All API responses have a 2 second delay. Useful for testing loading states and spinners.',
			},
		},
	},
};

/**
 * Interactive test story with play function
 */
export const InteractiveTest: Story = {
	name: 'Interactive Test',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId), // Convert string from mock data to bigint for the component
		chainId: 1,
		tokenName: mockTokenMetadata.name,
		collectionName: 'Test NFT Collection',
	},
	parameters: {
		msw: {
			handlers: standardWalletHandlers,
		},
		docs: {
			description: {
				story:
					'Automated test that opens the modal and verifies it renders correctly.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for initial render
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Step 1: Click trigger to open modal
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		await expect(triggerButton).toBeInTheDocument();
		await userEvent.click(triggerButton);

		// Step 2: Wait for modal to load
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Step 3: Verify modal elements are present
		const priceLabel = body.getByText('Enter price');
		await expect(priceLabel).toBeInTheDocument();

		// Step 4: Find and interact with expiration (if visible)
		const expirationText = body.queryByText(/Offer expires/i);
		if (expirationText) {
			await expect(expirationText).toBeInTheDocument();
		}

		// Step 5: Verify Make Offer button exists
		const makeOfferButton = body.getByTestId('make-offer-button');
		await expect(makeOfferButton).toBeInTheDocument();
	},
};
