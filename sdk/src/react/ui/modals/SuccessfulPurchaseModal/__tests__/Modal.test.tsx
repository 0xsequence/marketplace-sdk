import { MetadataStatus } from '@0xsequence/api-client';
import { cleanup, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SuccessfulPurchaseModal, { useSuccessfulPurchaseModal } from '..';
import { successfulPurchaseModalStore } from '../store';

describe('SuccessfulPurchaseModal', () => {
	beforeEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it('should not render when modal is closed', () => {
		render(<SuccessfulPurchaseModal />);
		expect(screen.queryByText('Successful purchase!')).toBeNull();
	});

	it('should render with purchase details when opened', () => {
		const mockPurchaseData = {
			collectibles: [
				{
					tokenId: 1n,
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
					source: 'test',
					status: MetadataStatus.AVAILABLE,
				},
			],
			totalPrice: '1.5 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
		};

		successfulPurchaseModalStore.send({ type: 'open', ...mockPurchaseData });
		render(<SuccessfulPurchaseModal />);

		expect(screen.getByText('Successful purchase!')).toBeInTheDocument();
		expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument(); // Number of items
		expect(screen.getByText('View on Etherscan')).toBeInTheDocument();
	});

	it('should render CTA button when ctaOptions are provided', () => {
		const mockPurchaseData = {
			collectibles: [
				{
					tokenId: 1n,
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
					source: 'test',
					status: MetadataStatus.AVAILABLE,
				},
			],
			totalPrice: '1.5 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
			ctaOptions: {
				ctaLabel: 'View Collection',
				ctaOnClick: vi.fn(),
			},
		};

		successfulPurchaseModalStore.send({ type: 'open', ...mockPurchaseData });
		render(<SuccessfulPurchaseModal />);

		expect(screen.getByText('View Collection')).toBeInTheDocument();
	});

	it('should handle multiple collectibles correctly', () => {
		const mockPurchaseData = {
			collectibles: Array(5)
				.fill(null)
				.map((_, index) => ({
					tokenId: BigInt(index + 1),
					name: `Test NFT ${index + 1}`,
					image: `https://test.com/image${index + 1}.png`,
					attributes: [],
					source: 'test',
					status: MetadataStatus.AVAILABLE,
				})),
			totalPrice: '5.0 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
			status: MetadataStatus.AVAILABLE,
		};

		successfulPurchaseModalStore.send({ type: 'open', ...mockPurchaseData });
		render(<SuccessfulPurchaseModal />);

		expect(screen.getByText('5 TOTAL')).toBeInTheDocument();
	});

	it.skip('should close modal when close button is clicked', () => {
		const mockPurchaseData = {
			collectibles: [
				{
					tokenId: 1n,
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
					source: 'test',
					status: MetadataStatus.AVAILABLE,
				},
			],
			totalPrice: '1.5 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
			status: MetadataStatus.AVAILABLE,
		};

		successfulPurchaseModalStore.send({ type: 'open', ...mockPurchaseData });
		render(<SuccessfulPurchaseModal />);

		const closeButton = screen.getByLabelText('Close modal');
		closeButton.click();

		expect(successfulPurchaseModalStore.getSnapshot().context.isOpen).toBe(
			false,
		);
	});

	describe('useSuccessfulPurchaseModal', () => {
		it('should provide show and close functions', () => {
			const modal = useSuccessfulPurchaseModal();

			expect(modal.show).toBeDefined();
			expect(modal.close).toBeDefined();
		});

		it('should pass callbacks to modal state', () => {
			const modal = useSuccessfulPurchaseModal();
			modal.show({
				collectibles: [],
				totalPrice: '0',
				explorerName: '',
				explorerUrl: '',
				ctaOptions: undefined,
			});
		});
	});
});
