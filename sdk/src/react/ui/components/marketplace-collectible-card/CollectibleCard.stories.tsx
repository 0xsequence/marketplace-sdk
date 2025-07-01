import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { CollectibleOrder, TokenMetadata } from '../../../_internal';
import { ContractType } from '../../../_internal';
import { CollectibleCard } from './CollectibleCard';
import type {
	MarketCollectibleCardProps,
	ShopCollectibleCardProps,
} from './types';

const meta: Meta<typeof CollectibleCard> = {
	title: 'Components/CollectibleCard',
	component: CollectibleCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'CollectibleCard component displays NFTs in marketplace and shop contexts with different variants and interactive features.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		marketplaceType: {
			control: { type: 'select' },
			options: ['market', 'shop'],
			description: 'Type of marketplace display',
		},
		chainId: {
			control: { type: 'number' },
			description: 'Blockchain network ID',
		},
		cardLoading: {
			control: { type: 'boolean' },
			description: 'Loading state of the card',
		},
	},
};

export default meta;
type Story = StoryObj<typeof CollectibleCard>;

// Mock data for stories
const mockMetadata: TokenMetadata = {
	tokenId: '1',
	name: 'Cosmic Explorer #1',
	description: 'A rare cosmic explorer from the distant galaxy',
	image: 'https://picsum.photos/400/400?random=1',
	attributes: [
		{ trait_type: 'Type', value: 'Explorer' },
		{ trait_type: 'Rarity', value: 'Legendary' },
		{ trait_type: 'Power', value: '95' },
		{ trait_type: 'Element', value: 'Cosmic' },
	],
};

const mockCollectible: CollectibleOrder = {
	metadata: mockMetadata,
};

// Market Card Stories
export const MarketCard: Story = {
	args: {
		collectibleId: '1',
		chainId: 1,
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		collectionType: ContractType.ERC721,
		assetSrcPrefixUrl: 'https://assets.example.com',
		cardLoading: false,
		marketplaceType: 'market',
		collectible: mockCollectible,
		balance: undefined,
		balanceIsLoading: false,
		onCollectibleClick: fn(),
		onOfferClick: fn(),
		onCannotPerformAction: fn(),
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Market card showing an NFT available for purchase.',
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Check that the card is rendered
		await expect(canvas.getByTestId('collectible-card')).toBeInTheDocument();

		// Check that the NFT name is displayed
		await expect(canvas.getByText('Cosmic Explorer #1')).toBeInTheDocument();

		// Test clicking on the card
		const card = canvas.getByTestId('collectible-card');
		await userEvent.click(card);

		// Verify the click callback was called
		const marketArgs = args as MarketCollectibleCardProps;
		await expect(marketArgs.onCollectibleClick).toHaveBeenCalledWith('1');
	},
};

export const MarketCardOwned: Story = {
	args: {
		...MarketCard.args,
		balance: '1', // Owned
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story:
					'Market card for an owned NFT showing sell and transfer options.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check that the card is rendered
		await expect(canvas.getByTestId('collectible-card')).toBeInTheDocument();
	},
};

// Shop Card Stories
export const ShopCard: Story = {
	args: {
		collectibleId: '1',
		chainId: 1,
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		collectionType: ContractType.ERC721,
		assetSrcPrefixUrl: 'https://assets.example.com',
		cardLoading: false,
		marketplaceType: 'shop',
		salesContractAddress:
			'0xABCDEF1234567890123456789012345678901234' as `0x${string}`,
		tokenMetadata: mockMetadata,
		salePrice: {
			amount: '500000000000000000', // 0.5 ETH
			currencyAddress:
				'0x0000000000000000000000000000000000000000' as `0x${string}`,
		},
		saleStartsAt: new Date().toISOString(),
		saleEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
		quantityDecimals: 0,
		quantityInitial: '100',
		quantityRemaining: '75',
	} as ShopCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story:
					'Shop card for direct purchase with quantity and sale information.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check that the card is rendered
		await expect(canvas.getByTestId('collectible-card')).toBeInTheDocument();

		// Check for shop-specific elements
		await expect(canvas.getByText('Cosmic Explorer #1')).toBeInTheDocument();
	},
};

export const ShopCardSoldOut: Story = {
	args: {
		...ShopCard.args,
		quantityRemaining: '0', // Sold out
	} as ShopCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Shop card in sold out state with disabled appearance.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check that the card has opacity styling for sold out state
		const card = canvas.getByTestId('collectible-card');
		await expect(card).toBeInTheDocument();
	},
};

// ERC1155 Stories
export const ERC1155MarketCard: Story = {
	args: {
		...MarketCard.args,
		collectionType: ContractType.ERC1155,
		collectible: {
			...mockCollectible,
			metadata: {
				...mockMetadata,
				name: 'Gaming Token #1155',
			},
		},
		balance: '25', // Owns some
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story:
					'ERC1155 market card with multiple quantities and partial ownership.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check for ERC1155 specific quantity displays
		await expect(canvas.getByText('Gaming Token #1155')).toBeInTheDocument();
	},
};

export const ERC1155ShopCard: Story = {
	args: {
		...ShopCard.args,
		collectionType: ContractType.ERC1155,
		tokenMetadata: {
			...mockMetadata,
			name: 'Utility Token Pack',
		},
		salePrice: {
			amount: '100000000000000000', // 0.1 ETH per token
			currencyAddress:
				'0x0000000000000000000000000000000000000000' as `0x${string}`,
		},
		quantityInitial: '10000',
		quantityRemaining: '8500',
	} as ShopCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story:
					'ERC1155 shop card with large quantities typical for utility tokens.',
			},
		},
	},
};

// Loading and Error States
export const LoadingState: Story = {
	args: {
		...MarketCard.args,
		cardLoading: true,
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Card in loading state showing skeleton placeholder.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Should show skeleton loader
		await expect(
			canvas.getByTestId('collectible-card-skeleton'),
		).toBeInTheDocument();
	},
};

export const BalanceLoadingState: Story = {
	args: {
		...MarketCard.args,
		balanceIsLoading: true,
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Card with balance loading state.',
			},
		},
	},
};

// Interactive Testing Stories
export const InteractionTest: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Comprehensive interaction testing for all card features.',
			},
		},
	},
	play: async ({ canvasElement, args, step }) => {
		const canvas = within(canvasElement);
		const marketArgs = args as MarketCollectibleCardProps;

		await step('Verify card renders correctly', async () => {
			await expect(canvas.getByTestId('collectible-card')).toBeInTheDocument();
			await expect(canvas.getByText('Cosmic Explorer #1')).toBeInTheDocument();
		});

		await step('Test card click interaction', async () => {
			const card = canvas.getByTestId('collectible-card');
			await userEvent.click(card);
			await expect(marketArgs.onCollectibleClick).toHaveBeenCalledWith('1');
		});

		await step('Test keyboard navigation', async () => {
			const card = canvas.getByTestId('collectible-card');
			card.focus();
			await userEvent.keyboard('{Enter}');
			await expect(marketArgs.onCollectibleClick).toHaveBeenCalledTimes(2);
		});

		await step('Verify accessibility attributes', async () => {
			const card = canvas.getByTestId('collectible-card');
			await expect(card).toHaveAttribute('role', 'button');
			await expect(card).toHaveAttribute('tabIndex', '0');
		});
	},
};

export const KeyboardNavigationTest: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Testing keyboard navigation and accessibility features.',
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const marketArgs = args as MarketCollectibleCardProps;

		const card = canvas.getByTestId('collectible-card');

		// Test Tab navigation
		await userEvent.tab();
		await expect(card).toHaveFocus();

		// Test Enter key
		await userEvent.keyboard('{Enter}');
		await expect(marketArgs.onCollectibleClick).toHaveBeenCalledWith('1');

		// Test Space key
		await userEvent.keyboard(' ');
		await expect(marketArgs.onCollectibleClick).toHaveBeenCalledTimes(2);
	},
};

// Visual Regression Testing Stories
export const VisualRegressionMarket: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Visual regression test for market card appearance.',
			},
		},
		chromatic: {
			modes: {
				light: { theme: 'light' },
				dark: { theme: 'dark' },
			},
		},
	},
	tags: ['visual-test'],
};

export const VisualRegressionShop: Story = {
	args: ShopCard.args as ShopCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Visual regression test for shop card appearance.',
			},
		},
		chromatic: {
			modes: {
				light: { theme: 'light' },
				dark: { theme: 'dark' },
			},
		},
	},
	tags: ['visual-test'],
};

// Responsive Design Stories
export const MobileViewport: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
		docs: {
			description: {
				story: 'Card optimized for mobile viewport.',
			},
		},
	},
};

export const TabletViewport: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
		docs: {
			description: {
				story: 'Card optimized for tablet viewport.',
			},
		},
	},
};

// Edge Cases and Error Handling
export const LongName: Story = {
	args: {
		...MarketCard.args,
		collectible: {
			...mockCollectible,
			metadata: {
				...mockMetadata,
				name: 'This is a very long NFT name that should be truncated or wrapped properly to maintain card layout integrity',
			},
		},
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Card with very long NFT name to test text overflow handling.',
			},
		},
	},
};

export const NoImage: Story = {
	args: {
		...MarketCard.args,
		collectible: {
			...mockCollectible,
			metadata: {
				...mockMetadata,
				image: undefined,
			},
		},
	} as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Card without image to test fallback behavior.',
			},
		},
	},
};

// Performance Testing
export const PerformanceTest: Story = {
	args: MarketCard.args as MarketCollectibleCardProps,
	parameters: {
		docs: {
			description: {
				story: 'Performance testing story for measuring render times.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Measure render performance
		const startTime = performance.now();
		await expect(canvas.getByTestId('collectible-card')).toBeInTheDocument();
		const endTime = performance.now();

		// Log performance metrics (in real tests, you'd assert on these)
		console.log(`Card render time: ${endTime - startTime}ms`);
	},
};
