import { cleanup, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SuccessfulPurchaseModal, { useSuccessfulPurchaseModal } from '..';
import type { ModalCallbacks } from '../../_internal/types';
import { successfulPurchaseModal$ } from '../_store';

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
					tokenId: '1',
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
				},
			],
			totalPrice: '1.5 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
		};

		successfulPurchaseModal$.open(mockPurchaseData);
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
					tokenId: '1',
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
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

		successfulPurchaseModal$.open(mockPurchaseData);
		render(<SuccessfulPurchaseModal />);

		expect(screen.getByText('View Collection')).toBeInTheDocument();
	});

	it('should handle multiple collectibles correctly', () => {
		const mockPurchaseData = {
			collectibles: Array(5)
				.fill(null)
				.map((_, index) => ({
					tokenId: String(index + 1),
					name: `Test NFT ${index + 1}`,
					image: `https://test.com/image${index + 1}.png`,
					attributes: [],
				})),
			totalPrice: '5.0 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
		};

		successfulPurchaseModal$.open(mockPurchaseData);
		render(<SuccessfulPurchaseModal />);

		expect(screen.getByText('5 TOTAL')).toBeInTheDocument();
	});

	it('should close modal when close button is clicked', () => {
		const mockPurchaseData = {
			collectibles: [
				{
					tokenId: '1',
					name: 'Test NFT',
					image: 'https://test.com/image.png',
					attributes: [],
				},
			],
			totalPrice: '1.5 ETH',
			explorerUrl: 'https://etherscan.io/tx/123',
			explorerName: 'Etherscan',
		};

		successfulPurchaseModal$.open(mockPurchaseData);
		render(<SuccessfulPurchaseModal />);

		const closeButton = screen.getByLabelText('Close modal');
		closeButton.click();

		expect(successfulPurchaseModal$.isOpen.get()).toBe(false);
	});

	describe('useSuccessfulPurchaseModal', () => {
		it('should provide show and close functions', () => {
			const modal = useSuccessfulPurchaseModal();

			expect(modal.show).toBeDefined();
			expect(modal.close).toBeDefined();
		});

		it('should pass callbacks to modal state', () => {
			const callbacks = {
				onSuccess: vi.fn(),
			} satisfies ModalCallbacks;

			const modal = useSuccessfulPurchaseModal(callbacks);
			const mockPurchaseData = {
				collectibles: [
					{
						tokenId: '1',
						name: 'Test NFT',
						image: 'https://test.com/image.png',
						attributes: [],
					},
				],
				totalPrice: '1.5 ETH',
				explorerUrl: 'https://etherscan.io/tx/123',
				explorerName: 'Etherscan',
			};

			modal.show(mockPurchaseData);
			expect(successfulPurchaseModal$.callbacks.get()).toBe(callbacks);
		});
	});
});
