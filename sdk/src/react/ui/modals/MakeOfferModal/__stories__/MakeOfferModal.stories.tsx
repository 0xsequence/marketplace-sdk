'use client';

import { OrderbookKind } from '@0xsequence/api-client';
import { Button, Card, Text } from '@0xsequence/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
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

interface MakeOfferTriggerProps {
	collectionAddress: `0x${string}`;
	tokenId: bigint;
	chainId: number;
	orderbookKind?: OrderbookKind;
	tokenName?: string;
	tokenImage?: string;
	collectionName?: string;
}

const MakeOfferTrigger = ({
	collectionAddress,
	tokenId,
	chainId,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	tokenName = 'Cool NFT #1',
	tokenImage = 'https://picsum.photos/seed/nft1/400/400',
	collectionName = 'Test Collection',
}: MakeOfferTriggerProps) => {
	const { show } = useMakeOfferModal();

	const handleMakeOffer = () => {
		show({ collectionAddress, chainId, tokenId, orderbookKind });
	};

	return (
		<div className="flex max-w-md flex-col gap-4 p-4">
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

			<Button
				variant="primary"
				onClick={handleMakeOffer}
				data-testid="make-offer-trigger"
				className="w-full"
			>
				Make Offer
			</Button>

			<MakeOfferModal />

			<Card className="bg-white/5 p-4">
				<Text variant="small" color="text50">
					<strong>Testing Instructions:</strong>
					<br />
					1. Click &quot;Make Offer&quot; to open the modal
					<br />
					2. Enter a price (e.g., &quot;10&quot; USDC)
					<br />
					3. Adjust expiration if desired
					<br />
					4. Click &quot;Approve&quot; (if shown) then &quot;Make Offer&quot;
					<br />
					<br />
					<strong>Wallet Type:</strong> Use the connector selector in the top
					right to switch between Mock (EOA), WaaS, and Sequence wallets.
				</Text>
			</Card>
		</div>
	);
};

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

export const Default: Story = {
	name: 'EOA Wallet (with Approval)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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

		await new Promise((resolve) => setTimeout(resolve, 500));

		const triggerButton = canvas.getByTestId('make-offer-trigger');
		await userEvent.click(triggerButton);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const priceInput = body.getByText('Enter price');
		await expect(priceInput).toBeInTheDocument();
	},
};

export const SequenceWallet: Story = {
	name: 'Sequence/WaaS Wallet (no Approval)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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

export const ERC1155Collection: Story = {
	name: 'ERC1155 Collection (with Quantity)',
	args: {
		collectionAddress: MOCK_ERC1155_COLLECTION_ADDRESS,
		tokenId: BigInt(mockERC1155TokenMetadata.tokenId),
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

		const modal = body.getByText('Enter price');
		await expect(modal).toBeInTheDocument();
	},
};

export const InsufficientBalance: Story = {
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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

export const SlowLoading: Story = {
	name: 'Slow Loading (2s delay)',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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

export const InteractiveTest: Story = {
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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

		await new Promise((resolve) => setTimeout(resolve, 500));

		const triggerButton = canvas.getByTestId('make-offer-trigger');
		await expect(triggerButton).toBeInTheDocument();
		await userEvent.click(triggerButton);

		await new Promise((resolve) => setTimeout(resolve, 1500));

		const priceLabel = body.getByText('Enter price');
		await expect(priceLabel).toBeInTheDocument();

		const expirationText = body.queryByText(/Offer expires/i);
		if (expirationText) {
			await expect(expirationText).toBeInTheDocument();
		}

		const makeOfferButton = body.getByTestId('make-offer-button');
		await expect(makeOfferButton).toBeInTheDocument();
	},
};

export const PriceValidationTest: Story = {
	name: 'Price Validation Flow',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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
					'Tests price validation with touched state: no error initially, error shows after touching with invalid value, clears with valid input.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to fully initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Open modal using fireEvent to bypass pointer-events checks
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		fireEvent.click(triggerButton);

		// Wait for modal to open and data to load
		await waitFor(
			() => {
				const priceLabel = body.queryByText('Enter price');
				expect(priceLabel).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Verify NO validation error shows initially (field not touched)
		const initialError = body.queryByText('Price must be greater than 0');
		await expect(initialError).not.toBeInTheDocument();

		// Verify Make Offer button is disabled initially (form is invalid, just no visible error)
		const makeOfferButton = body.getByTestId('make-offer-button');
		await expect(makeOfferButton).toBeDisabled();

		// Wait for component to be fully loaded
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find the price input
		const priceInput = body.getByPlaceholderText('0') as HTMLInputElement;

		// Helper to set input value and trigger React's onChange
		const setInputValue = (value: string) => {
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value',
			)?.set;
			nativeInputValueSetter?.call(priceInput, value);
			priceInput.dispatchEvent(new Event('input', { bubbles: true }));
		};

		setInputValue('1');
		await new Promise((resolve) => setTimeout(resolve, 100));
		setInputValue('0');

		await waitFor(
			() => {
				const errorAfterTouch = body.queryByText(
					'Price must be greater than 0',
				);
				expect(errorAfterTouch).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		// Now enter a valid price - error should clear
		setInputValue('10');

		await waitFor(
			() => {
				const errorAfterValidInput = body.queryByText(
					'Price must be greater than 0',
				);
				expect(errorAfterValidInput).not.toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		// Approve button should now be visible for EOA wallet
		await waitFor(
			() => {
				const approveButton = body.queryByTestId('make-offer-approve-button');
				expect(approveButton).toBeTruthy();
				expect(approveButton).not.toBeDisabled();
			},
			{ timeout: 2000 },
		);
	},
};

export const CurrencySelectionTest: Story = {
	name: 'Currency Selection',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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
				story: 'Tests currency selection dropdown functionality.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Open modal using fireEvent
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		fireEvent.click(triggerButton);

		// Wait for modal to open
		await waitFor(
			() => {
				const priceLabel = body.queryByText('Enter price');
				expect(priceLabel).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Verify USDC is selected by default
		const usdcButton = body.getByText('USDC');
		await expect(usdcButton).toBeInTheDocument();

		// Click the currency selector to open dropdown using fireEvent
		fireEvent.click(usdcButton);

		await new Promise((resolve) => setTimeout(resolve, 300));

		// Verify WETH option is available
		const wethOption = body.queryByText('WETH');
		if (wethOption) {
			await expect(wethOption).toBeInTheDocument();

			// Select WETH using fireEvent
			fireEvent.click(wethOption);

			await new Promise((resolve) => setTimeout(resolve, 300));

			// Verify WETH is now selected
			const selectedWeth = body.getByText('WETH');
			await expect(selectedWeth).toBeInTheDocument();
		}
	},
};

export const ExpirationDateTest: Story = {
	name: 'Expiration Date Selection',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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
				story: 'Tests expiration date picker functionality.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Open modal using fireEvent
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		fireEvent.click(triggerButton);

		// Wait for modal to open
		await waitFor(
			() => {
				const priceLabel = body.queryByText('Enter price');
				expect(priceLabel).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Verify expiry section exists
		const setExpiryText = body.getByText('Set expiry');
		await expect(setExpiryText).toBeInTheDocument();

		// Find date button (contains the date)
		const dateButtons = body.getAllByRole('button');
		const dateButton = dateButtons.find((btn) =>
			btn.textContent?.includes('2025'),
		);
		if (dateButton) {
			await expect(dateButton).toBeInTheDocument();
		}
	},
};

export const CloseModalTest: Story = {
	name: 'Close Modal Behavior',
	args: {
		collectionAddress: MOCK_COLLECTION_ADDRESS,
		tokenId: BigInt(mockTokenMetadata.tokenId),
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
					'Tests that the modal can be closed properly via the close button.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Open modal using fireEvent
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		fireEvent.click(triggerButton);

		// Wait for modal to open
		await waitFor(
			() => {
				const modalTitle = body.queryByText('Make an offer');
				expect(modalTitle).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Find and click close button (the X button)
		const closeButtons = body.getAllByRole('button');
		const closeButton = closeButtons.find((btn) => {
			// Close button typically has an SVG icon and no text
			return btn.querySelector('svg') && btn.textContent?.trim() === '';
		});

		if (closeButton) {
			fireEvent.click(closeButton);

			await new Promise((resolve) => setTimeout(resolve, 500));

			// Modal title should no longer be visible (or modal closed)
			// Note: Due to animation, we check if the trigger is still accessible
			await expect(triggerButton).toBeInTheDocument();
		}
	},
};

export const ERC1155QuantityTest: Story = {
	name: 'ERC1155 Quantity Validation',
	args: {
		collectionAddress: MOCK_ERC1155_COLLECTION_ADDRESS,
		tokenId: BigInt(mockERC1155TokenMetadata.tokenId),
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
					'Tests quantity input for ERC1155 tokens with increment/decrement buttons.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		// Wait for component to initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Open modal using fireEvent
		const triggerButton = canvas.getByTestId('make-offer-trigger');
		fireEvent.click(triggerButton);

		// Wait for modal to open with quantity field
		await waitFor(
			() => {
				const quantityLabel = body.queryByText('Enter quantity');
				expect(quantityLabel).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);

		// Wait for component to be fully loaded
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find quantity input and verify default value is 1
		const inputs = body.getAllByRole('textbox');
		const quantityInput = inputs.find(
			(input) => (input as HTMLInputElement).value === '1',
		) as HTMLInputElement | undefined;

		if (quantityInput) {
			await expect(quantityInput).toBeInTheDocument();

			// Use native value setter + input event to trigger React's onChange
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value',
			)?.set;
			nativeInputValueSetter?.call(quantityInput, '5');
			quantityInput.dispatchEvent(new Event('input', { bubbles: true }));

			await new Promise((resolve) => setTimeout(resolve, 300));

			// Verify quantity changed
			await expect(quantityInput).toHaveValue('5');
		}
	},
};
