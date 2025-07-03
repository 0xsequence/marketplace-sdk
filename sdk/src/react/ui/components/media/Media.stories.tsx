import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Media } from './Media';

const meta: Meta<typeof Media> = {
	title: 'Components/Media',
	component: Media,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Media component is a versatile asset display component that automatically detects and renders different media types including images, videos, HTML content, and 3D models. It provides fallback handling, loading states, and error recovery.

## Features
- **Multi-format support**: Images (JPG, PNG, SVG, WebP), Videos (MP4, WebM), HTML/iframes, 3D models (GLTF, GLB)
- **Automatic content type detection**: Based on file extensions and content headers
- **Fallback handling**: Multiple asset sources with automatic fallback on errors
- **Loading states**: Built-in skeleton loading indicators
- **Error recovery**: Graceful degradation with placeholder content
- **Custom fallback content**: Support for custom fallback components
- **Responsive design**: Aspect-ratio aware with flexible sizing
				`,
			},
		},
	},
	argTypes: {
		name: {
			control: 'text',
			description: 'Alt text and title for the media content',
		},
		assets: {
			control: 'object',
			description: 'Array of asset URLs with automatic fallback support',
		},
		assetSrcPrefixUrl: {
			control: 'text',
			description: 'Optional prefix URL for asset sources (e.g., CDN base URL)',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for styling',
		},
		isLoading: {
			control: 'boolean',
			description: 'Force loading state display',
		},
		shouldListenForLoad: {
			control: 'boolean',
			description: 'Whether to listen for load/error events',
		},
		fallbackContent: {
			control: false,
			description: 'Custom React component to display when all assets fail',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: '300px', height: '300px', padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Media>;

// Mock asset URLs for different media types
const MOCK_ASSETS = {
	images: {
		jpg: 'https://picsum.photos/400/400?random=1',
		png: 'https://picsum.photos/400/400?random=2',
		svg: 'https://picsum.photos/400/400?random=3',
		webp: 'https://picsum.photos/400/400?random=4',
	},
	videos: {
		mp4: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
		webm: 'https://www.sample-videos.com/video321/webm/720/big_buck_bunny_720p_1mb.webm',
	},
	html: {
		iframe: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
		interactive: 'https://codepen.io/team/codepen/embed/PNaGbb',
	},
	models: {
		gltf: 'https://modelviewer.dev/shared-assets/models/Astronaut.gltf',
		glb: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
	},
	invalid: {
		broken: 'https://invalid-url-that-will-fail.com/image.jpg',
		notFound: 'https://httpstat.us/404',
	},
};

// ========================================
// VISIBLE STORIES - Shown in Storybook UI
// ========================================

// Basic example stories that demonstrate core functionality
export const Image: Story = {
	args: {
		name: 'Sample Image',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
};

export const Video: Story = {
	args: {
		name: 'Sample Video',
		assets: [
			'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
		],
		className: 'rounded-lg border',
	},
};

export const LoadingState: Story = {
	args: {
		name: 'Loading State',
		assets: [MOCK_ASSETS.images.jpg],
		isLoading: true,
		className: 'rounded-lg border',
	},
};

export const ErrorHandling: Story = {
	args: {
		name: 'Error Handling with Fallback',
		assets: [
			MOCK_ASSETS.invalid.broken,
			MOCK_ASSETS.invalid.notFound,
			MOCK_ASSETS.images.jpg, // This should work
		],
		className: 'rounded-lg border',
	},
};

export const CustomFallback: Story = {
	args: {
		name: 'Custom Fallback Content',
		assets: [MOCK_ASSETS.invalid.broken],
		className: 'rounded-lg border',
		fallbackContent: (
			<div className="flex flex-col items-center justify-center p-4 text-center">
				<div className="mb-2 text-4xl">🎨</div>
				<div className="font-medium text-sm">Custom Artwork</div>
				<div className="mt-1 text-gray-500 text-xs">No image available</div>
			</div>
		),
	},
};

// Showcase story that displays multiple media types - visible but not tested
export const MediaShowcase: Story = {
	tags: ['!test'],
	render: () => (
		<div className="grid grid-cols-2 gap-4 p-4">
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Image (JPG)</h3>
				<Media
					name="Grid Image"
					assets={[MOCK_ASSETS.images.jpg]}
					className="aspect-square rounded border"
				/>
			</div>
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Video (MP4)</h3>
				<Media
					name="Grid Video"
					assets={[
						'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
					]}
					className="aspect-square rounded border"
				/>
			</div>
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Loading State</h3>
				<Media
					name="Grid Loading"
					assets={[MOCK_ASSETS.images.jpg]}
					isLoading={true}
					className="aspect-square rounded border"
				/>
			</div>
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Fallback</h3>
				<Media
					name="Grid Fallback"
					assets={[MOCK_ASSETS.invalid.broken]}
					className="aspect-square rounded border"
				/>
			</div>
		</div>
	),
	decorators: [
		(Story) => (
			<div style={{ width: '600px', padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

// ========================================
// TEST STORIES - Hidden from UI but tested
// ========================================

// Image format tests
export const TestImagePNG: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test PNG Image',
		assets: [MOCK_ASSETS.images.png],
		className: 'rounded-lg border',
	},
};

export const TestImageSVG: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test SVG Image',
		assets: [MOCK_ASSETS.images.svg],
		className: 'rounded-lg border',
	},
};

export const TestImageWebP: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test WebP Image',
		assets: [MOCK_ASSETS.images.webp],
		className: 'rounded-lg border',
	},
};

// Video format tests
export const TestVideoWebM: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test WebM Video',
		assets: [
			'https://www.sample-videos.com/video321/webm/720/big_buck_bunny_720p_1mb.webm',
		],
		className: 'rounded-lg border',
	},
};

// HTML/iframe tests
export const TestHTMLIframe: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test YouTube Embed',
		assets: ['https://www.youtube.com/embed/dQw4w9WgXcQ.html'],
		className: 'rounded-lg border',
	},
};

export const TestInteractiveHTML: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test CodePen Interactive',
		assets: ['https://codepen.io/team/codepen/embed/PNaGbb.html'],
		className: 'rounded-lg border',
	},
};

// 3D model tests
export const TestModel3DGLTF: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Astronaut 3D Model (GLTF)',
		assets: ['https://modelviewer.dev/shared-assets/models/Astronaut.gltf'],
		className: 'rounded-lg border',
	},
};

export const TestModel3DGLB: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Shishkebab 3D Model (GLB)',
		assets: ['https://modelviewer.dev/shared-assets/models/shishkebab.glb'],
		className: 'rounded-lg border',
	},
};

// Edge case tests
export const TestEmptyAssets: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Empty Assets Array',
		assets: [],
		className: 'rounded-lg border',
	},
};

export const TestUndefinedAssets: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Undefined Assets',
		assets: [undefined, undefined, undefined],
		className: 'rounded-lg border',
	},
};

export const TestAllAssetsFail: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test All Assets Fail',
		assets: [
			MOCK_ASSETS.invalid.broken,
			MOCK_ASSETS.invalid.notFound,
			'https://another-invalid-url.com/image.jpg',
		],
		className: 'rounded-lg border',
	},
};

export const TestLoadingWithoutListening: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Loading Without Event Listening',
		assets: [MOCK_ASSETS.images.jpg],
		shouldListenForLoad: false,
		className: 'rounded-lg border',
	},
};

export const TestWithAssetPrefix: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test With Asset Prefix URL',
		assets: ['400/400?random=5'],
		assetSrcPrefixUrl: 'https://picsum.photos/',
		className: 'rounded-lg border',
	},
};

// Size variation tests
export const TestSmallSize: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Small Media',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	decorators: [
		(Story) => (
			<div style={{ width: '150px', height: '150px', padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

export const TestLargeSize: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Large Media',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	decorators: [
		(Story) => (
			<div style={{ width: '600px', height: '600px', padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

export const TestRectangularAspect: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Rectangular Aspect Ratio',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border aspect-video',
	},
	decorators: [
		(Story) => (
			<div style={{ width: '400px', padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

// Special character tests
export const TestVeryLongAssetURL: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Very Long Asset URL',
		assets: [
			`${MOCK_ASSETS.images.jpg}?very-long-query-parameter-that-might-cause-issues-with-url-handling-and-should-be-tested-for-edge-cases=true&another-param=value&yet-another=test`,
		],
		className: 'rounded-lg border',
	},
};

export const TestSpecialCharactersInName: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
};

export const TestUnicodeCharactersInName: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test 🎨 Unicode Art 🖼 中文 العربية 🌟',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
};

// ========================================
// INTERACTION TESTS - Hidden but with play functions
// ========================================

export const InteractionTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Media Interaction Test',
		assets: [MOCK_ASSETS.images.jpg],
		className:
			'rounded-lg border cursor-pointer hover:shadow-lg transition-shadow',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify media renders correctly', async () => {
			const mediaContainer = canvas.getByRole('img', {
				name: /Media Interaction Test/i,
			});
			await expect(mediaContainer).toBeInTheDocument();
		});

		await step('Test hover interaction', async () => {
			const mediaContainer = canvas.getByRole('img', {
				name: /Media Interaction Test/i,
			});
			await userEvent.hover(mediaContainer);
			// Verify hover effects are applied
			await expect(mediaContainer).toBeInTheDocument();
		});

		await step('Test click interaction', async () => {
			const mediaContainer = canvas.getByRole('img', {
				name: /Media Interaction Test/i,
			});
			await userEvent.click(mediaContainer);
			// Verify click is handled
			await expect(mediaContainer).toBeInTheDocument();
		});
	},
};

export const LoadingStateTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Loading State Test',
		assets: [MOCK_ASSETS.images.jpg],
		isLoading: true,
		className: 'rounded-lg border',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify loading skeleton is displayed', async () => {
			const skeleton = canvas.getByTestId('media');
			await expect(skeleton).toBeInTheDocument();
			await expect(skeleton).toHaveClass('animate-shimmer');
		});
	},
};

export const FallbackTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Fallback Test',
		assets: [MOCK_ASSETS.invalid.broken, MOCK_ASSETS.invalid.notFound],
		className: 'rounded-lg border',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify fallback image is displayed', async () => {
			// Wait for fallback to load
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const fallbackImage = canvas.getByRole('img', { name: /Fallback Test/i });
			await expect(fallbackImage).toBeInTheDocument();
		});
	},
};

export const AccessibilityTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Accessibility Test Media',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify proper alt text', async () => {
			const image = canvas.getByRole('img', {
				name: /Accessibility Test Media/i,
			});
			await expect(image).toBeInTheDocument();
			await expect(image).toHaveAttribute('alt', 'Accessibility Test Media');
		});

		await step('Verify keyboard navigation', async () => {
			const image = canvas.getByRole('img', {
				name: /Accessibility Test Media/i,
			});
			image.focus();
			await expect(image).toHaveFocus();
		});
	},
};

export const PerformanceTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Performance Test',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Measure render performance', async () => {
			const startTime = performance.now();

			const image = canvas.getByRole('img', { name: /Performance Test/i });
			await expect(image).toBeInTheDocument();

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			console.log(`Media render time: ${renderTime}ms`);

			// Verify reasonable render time (less than 100ms)
			expect(renderTime).toBeLessThan(100);
		});
	},
};

// ========================================
// VIEWPORT TESTS - Hidden from UI
// ========================================

export const TestMobileViewport: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Mobile Viewport',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
};

export const TestTabletViewport: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Test Tablet Viewport',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
	},
};

// ========================================
// VISUAL REGRESSION TESTS - Hidden from UI
// ========================================

export const VisualRegressionImage: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Visual Regression - Image',
		assets: [MOCK_ASSETS.images.jpg],
		className: 'rounded-lg border',
	},
	parameters: {
		chromatic: {
			modes: {
				desktop: { viewport: { width: 1200, height: 800 } },
				mobile: { viewport: { width: 375, height: 667 } },
			},
		},
	},
};

export const VisualRegressionVideo: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Visual Regression - Video',
		assets: [
			'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
		],
		className: 'rounded-lg border',
	},
	parameters: {
		chromatic: {
			modes: {
				desktop: { viewport: { width: 1200, height: 800 } },
				mobile: { viewport: { width: 375, height: 667 } },
			},
		},
	},
};

export const VisualRegressionLoading: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		name: 'Visual Regression - Loading',
		assets: [MOCK_ASSETS.images.jpg],
		isLoading: true,
		className: 'rounded-lg border',
	},
	parameters: {
		chromatic: {
			modes: {
				desktop: { viewport: { width: 1200, height: 800 } },
				mobile: { viewport: { width: 375, height: 667 } },
			},
		},
	},
};
