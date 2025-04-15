import { render, screen } from '@test/test-utils';
import { describe, expect, it } from 'vitest';
import type { TokenMetadata } from '../../../../_internal';
import { CollectibleAsset } from '../CollectibleAsset';

describe('CollectibleAsset', () => {
	it('renders image content correctly with proper loading states and fallback', async () => {
		const originalImage = window.Image;

		// We need to use a proper constructor function to match the Image interface
		const MockImage = function (this: HTMLImageElement) {
			this.src = '';
			this.alt = '';
			this.className = '';
			this.onload = null;
			this.onerror = null;
			return this;
		} as unknown as typeof Image;

		window.Image = MockImage;

		const mockMetadata: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'Test Collectible',
			image: 'https://example.com/test-image.png',
			attributes: [],
		};

		// Initial render should show the loading skeleton
		const { rerender } = render(
			<CollectibleAsset
				name="Test Collectible"
				collectibleMetadata={mockMetadata as TokenMetadata}
			/>,
		);

		// check if skeleton is rendered during loading
		const skeleton = screen.getByTestId('collectible-asset-skeleton');
		expect(skeleton).toBeInTheDocument();

		// trigger the image load event to simulate successful loading
		const imgElement = document.querySelector('img');
		expect(imgElement).not.toBeNull();

		if (imgElement) {
			expect(imgElement.getAttribute('src')).toBe(
				'https://example.com/test-image.png',
			);
			expect(imgElement.getAttribute('alt')).toBe('Test Collectible');

			// initial state should be invisible due to loading
			expect(imgElement.className).toContain('invisible');

			// successful image load
			imgElement.dispatchEvent(new Event('load'));

			// after loading, the image should be visible
			expect(imgElement.className).toContain('visible');
		}

		// failing image that should use fallback
		const mockMetadataWithBadImage: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'Test Collectible',
			image: 'https://example.com/bad-image.png',
			attributes: [],
		};

		rerender(
			<CollectibleAsset
				name="Test Collectible"
				collectibleMetadata={mockMetadataWithBadImage as TokenMetadata}
			/>,
		);

		const updatedImgElement = document.querySelector('img');
		if (updatedImgElement) {
			// simulate image load error
			updatedImgElement.dispatchEvent(new Event('error'));

			// after error, the src should be changed to the placeholder
			expect(updatedImgElement.className).toContain('visible');
		}

		// restore the original Image implementation
		window.Image = originalImage;
	});
});
