import { TEST_CURRENCY } from '@test/const';
import { render, screen } from '@test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ContractType } from '../../../../_internal';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { Footer } from '../Footer';
import { CollectibleCardType } from '../types';

const defaultProps = {
	name: 'Test',
	type: ContractType.ERC721,
	decimals: 18,
	onOfferClick: vi.fn(),
	highestOffer: mockOrder,
	lowestOffer: mockOrder,
	lowestListingPriceAmount: '100',
	lowestListingCurrency: TEST_CURRENCY,
	balance: '100',
	cardType: CollectibleCardType.MARKETPLACE,
};

describe('Footer', () => {
	it('Renders with basic props (name, type) correctly', () => {
		render(<Footer {...defaultProps} />);

		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.getByText('0.0001 TEST')).toBeInTheDocument();

		const notificationBell = screen.getByRole('button', {
			name: 'Notification Bell',
		});
		expect(notificationBell).toBeInTheDocument();
	});

	it('Truncates long names appropriately based on presence of offers', () => {
		const longName =
			'This is a very long collectible name that needs truncation';

		// Test truncation with offer present (truncates to 13 chars + "...")
		render(
			<Footer {...defaultProps} name={longName} highestOffer={mockOrder} />,
		);
		expect(screen.getByText('This is a ver...')).toBeInTheDocument();

		// Test truncation without offer present (truncates to 17 chars + "...")
		render(
			<Footer {...defaultProps} name={longName} highestOffer={undefined} />,
		);
		expect(screen.getByText('This is a very lo...')).toBeInTheDocument();

		// Test short name with offer (no truncation needed)
		render(
			<Footer {...defaultProps} name="Short Name" highestOffer={mockOrder} />,
		);
		expect(screen.getByText('Short Name')).toBeInTheDocument();
	});

	it('Formats prices correctly for different scenarios (normal, overflow, underflow)', () => {
		// Test normal price formatting
		render(
			<Footer
				{...defaultProps}
				lowestListingPriceAmount="1000000000000000000" // 1 TOKEN in wei
			/>,
		);
		expect(screen.getByText('1 TEST')).toBeInTheDocument();

		// Test small number formatting (shows more decimals)
		render(
			<Footer
				{...defaultProps}
				lowestListingPriceAmount="5000000000000000" // 0.005 TOKEN in wei
			/>,
		);
		expect(screen.getByText('0.005 TEST')).toBeInTheDocument();

		// Test underflow price (< 0.0001)
		render(
			<Footer
				{...defaultProps}
				lowestListingPriceAmount="10000000000000" // 0.00001 TOKEN in wei
			/>,
		);
		// Should display minimum price with chevron icon
		expect(screen.getByText('0.0001 TEST')).toBeInTheDocument();

		// Test overflow price (> 100,000,000)
		render(
			<Footer
				{...defaultProps}
				lowestListingPriceAmount="100000000000000000000000000" // 100M+ TOKEN in wei
			/>,
		);
		// Should display maximum price with chevron icon
		expect(screen.getByText('100,000,000 TEST')).toBeInTheDocument();
	});

	it("Displays 'Not listed yet' when no listing price is provided", () => {
		// Create props without listing price information
		const propsWithoutListing = {
			...defaultProps,
			lowestListingPriceAmount: undefined,
			lowestListingCurrency: undefined,
		};

		render(<Footer {...propsWithoutListing} />);

		// Verify "Not listed yet" text is displayed
		expect(screen.getByText('Not listed yet')).toBeInTheDocument();
	});

	it('Shows proper token balance information for ERC721 vs ERC1155 tokens', () => {
		// Test ERC721 token display
		render(<Footer {...defaultProps} type={ContractType.ERC721} />);
		expect(screen.getByText('ERC-721')).toBeInTheDocument();

		// Test ERC1155 token display without balance
		render(
			<Footer
				{...defaultProps}
				type={ContractType.ERC1155}
				balance={undefined}
			/>,
		);
		expect(screen.getByText('ERC-1155')).toBeInTheDocument();

		// Test ERC1155 token display with balance
		render(
			<Footer
				{...defaultProps}
				type={ContractType.ERC1155}
				balance="1000000000000000000"
				decimals={18}
			/>,
		);
		expect(screen.getByText('Owned: 1')).toBeInTheDocument();
	});
});
