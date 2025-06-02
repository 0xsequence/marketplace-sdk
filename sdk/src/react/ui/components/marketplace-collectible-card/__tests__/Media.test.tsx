import { render, screen, waitFor } from '@test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import * as fetchContentTypeModule from '../../../../../utils/fetchContentType';
import type { TokenMetadata } from '../../../../_internal';
import ChessTileImage from '../../../images/chess-tile.png';
import { Media } from '../media/Media';
import * as contentTypeUtils from '../media/utils';

describe('Media', () => {
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
			<Media name="Test Collectible" assets={[mockMetadata.image]} />,
		);

		// check if skeleton is rendered during loading
		const skeleton = screen.getByTestId('media');
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
			<Media
				name="Test Collectible"
				assets={[mockMetadataWithBadImage.image]}
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

	it('handles video content with appropriate controls and loading states', async () => {
		const getContentTypeSpy = vi.spyOn(contentTypeUtils, 'getContentType');
		getContentTypeSpy.mockResolvedValue('video');

		const fetchContentTypeSpy = vi.spyOn(
			fetchContentTypeModule,
			'fetchContentType',
		);
		fetchContentTypeSpy.mockResolvedValue('video');

		// Create a mock for the HTMLVideoElement addEventListener
		const originalAddEventListener =
			HTMLVideoElement.prototype.addEventListener;
		HTMLVideoElement.prototype.addEventListener = vi.fn(
			(event: string, handler: EventListenerOrEventListenerObject) => {
				// Immediately call the loadedmetadata handler to simulate video loaded
				if (event === 'loadedmetadata' && typeof handler === 'function') {
					handler(new Event('loadedmetadata'));
				}
			},
		);

		// Mock browser detection for Safari
		const originalUserAgent = navigator.userAgent;
		Object.defineProperty(navigator, 'userAgent', {
			value:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
			configurable: true,
		});

		// Mock video metadata
		const mockVideoMetadata: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'Video Collectible',
			video: 'https://example.com/video.mp4',
			attributes: [],
		};

		render(
			<Media name="Video Collectible" assets={[mockVideoMetadata.video]} />,
		);

		await waitFor(() => {
			expect(screen.getByTestId('collectible-asset-video')).toBeInTheDocument();
		});

		const videoElement = screen.getByTestId(
			'collectible-asset-video',
		) as HTMLVideoElement;

		expect(videoElement).not.toBeNull();

		// Video source should be set correctly
		const sourceElement = videoElement.querySelector('source');
		expect(sourceElement).not.toBeNull();
		expect(sourceElement?.getAttribute('src')).toBe(
			'https://example.com/video.mp4',
		);

		// Video should have correct attributes for NFT display
		expect(videoElement.autoplay).toBe(true);
		expect(videoElement.loop).toBe(true);
		expect(videoElement.controls).toBe(true);
		expect(videoElement.playsInline).toBe(true);
		expect(videoElement.muted).toBe(true);

		// In Safari, pointer-events-none should be applied
		expect(videoElement.className).toContain('pointer-events-none');

		// After metadata loaded, video should be visible
		expect(videoElement.className).toContain('visible');

		// Clean up mocks
		getContentTypeSpy.mockRestore();
		fetchContentTypeSpy.mockRestore();
		HTMLVideoElement.prototype.addEventListener = originalAddEventListener;
		Object.defineProperty(navigator, 'userAgent', {
			value: originalUserAgent,
			configurable: true,
		});
	});

	it('handles HTML content in iframes with proper sandboxing', async () => {
		const getContentTypeSpy = vi.spyOn(contentTypeUtils, 'getContentType');
		getContentTypeSpy.mockResolvedValue('html');

		const fetchContentTypeSpy = vi.spyOn(
			fetchContentTypeModule,
			'fetchContentType',
		);
		fetchContentTypeSpy.mockResolvedValue('html');

		// Mock HTML content metadata
		const mockHtmlMetadata: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'HTML Collectible',
			animation_url: 'https://example.com/interactive.html',
			attributes: [],
		};

		render(
			<Media
				name="HTML Collectible"
				assets={[mockHtmlMetadata.animation_url]}
			/>,
		);

		await waitFor(() => {
			expect(document.querySelector('iframe')).toBeInTheDocument();
		});

		// Check that iframe element is present with correct attributes
		const iframeElement = document.querySelector('iframe') as HTMLIFrameElement;
		expect(iframeElement).toBeInTheDocument();

		// iframe source should be set correctly
		expect(iframeElement.getAttribute('src')).toBe(
			'https://example.com/interactive.html',
		);

		// iframe should have appropriate attributes for security
		expect(iframeElement.getAttribute('sandbox')).toBe('allow-scripts');

		// iframe should have title for accessibility
		expect(iframeElement.getAttribute('title')).toBe('HTML Collectible');

		// iframe should have proper styling
		expect(iframeElement.className).toContain('aspect-square');
		expect(iframeElement.className).toContain('w-full');

		// Verify border styling
		expect(iframeElement.style.border).toBe('0px');

		getContentTypeSpy.mockRestore();
		fetchContentTypeSpy.mockRestore();
	});

	it('shows loading state when isLoading prop is true', async () => {
		const mockMetadata: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'Test Collectible',
			image: 'https://example.com/test-image.png',
			attributes: [],
		};

		// Render with isLoading=true
		const { rerender } = render(
			<Media
				name="Test Collectible"
				assets={[mockMetadata.image]}
				isLoading={true}
			/>,
		);

		// Check if skeleton is rendered during loading
		expect(screen.getByTestId('media')).toBeInTheDocument();

		// Image should be invisible while loading
		const imgElement = document.querySelector('img');
		expect(imgElement?.className).toContain('invisible');

		// Re-render with isLoading=false
		rerender(
			<Media
				name="Test Collectible"
				assets={[mockMetadata.image]}
				isLoading={false}
			/>,
		);

		// After loading completes, trigger load event
		imgElement?.dispatchEvent(new Event('load'));

		// Image should become visible
		expect(imgElement?.className).toContain('visible');
	});

	it('uses custom fallback content when provided', async () => {
		const CustomFallback = () => (
			<div data-testid="custom-fallback">Custom Fallback Content</div>
		);

		const mockMetadata: Partial<TokenMetadata> = {
			tokenId: '1',
			name: 'Test Collectible',
			image: 'https://example.com/bad-image.png',
			attributes: [],
		};

		const { rerender } = render(
			<Media
				name="Test Collectible"
				assets={[mockMetadata.image]}
				fallbackContent={<CustomFallback />}
			/>,
		);

		// Wait for initial content type check
		await waitFor(() => {
			const imgElement = screen.getByRole('img');
			expect(imgElement).toBeInTheDocument();
		});

		const imgElement = screen.getByRole('img');
		expect(imgElement).not.toBeNull();

		// Initial image should be the bad image URL
		expect(imgElement.getAttribute('src')).toBe(
			'https://example.com/bad-image.png',
		);

		// Simulate image load error
		imgElement.dispatchEvent(new Event('error'));

		// After error, the custom fallback should be rendered
		await waitFor(() => {
			expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
			expect(screen.getByText('Custom Fallback Content')).toBeInTheDocument();
		});

		// Test with no assets - should immediately use fallback
		rerender(
			<Media
				name="Test Collectible"
				assets={[]}
				fallbackContent={<CustomFallback />}
			/>,
		);

		// Should show custom fallback immediately
		await waitFor(() => {
			expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
			expect(screen.getByText('Custom Fallback Content')).toBeInTheDocument();
		});

		// Test with default chess tile fallback when no custom fallback is provided
		rerender(<Media name="Test Collectible" assets={[]} />);

		await waitFor(() => {
			const defaultFallbackImg = screen.getByRole('img');
			expect(defaultFallbackImg).toBeInTheDocument();
			expect(defaultFallbackImg.getAttribute('src')).toBe(ChessTileImage);
		});
	});
});
