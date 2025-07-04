'use client';

import { Media } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';

// Mock assets for testing - using stable URLs that won't change
const TEST_ASSETS = {
	// Using a data URL for truly stable testing
	image:
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGMDAwMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5UZXN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
	video:
		'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
	brokenImage: 'https://broken-url-that-will-fail.com/image.jpg',
	iframe: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
	model3d: 'https://modelviewer.dev/shared-assets/models/Astronaut.gltf',
};

export default function MediaTestPage() {
	const [slowLoading, setSlowLoading] = useState(false);

	// Check if slow loading is requested via query param
	if (typeof window !== 'undefined') {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('slow') === 'true' && !slowLoading) {
			setSlowLoading(true);
		}
	}

	return (
		<div className="container mx-auto p-8">
			<h1 className="mb-8 font-bold text-2xl">Media Component Test Page</h1>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{/* Image Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">Image Media</h2>
					<div data-testid="media-image">
						<Media
							name="Test Image"
							assets={[TEST_ASSETS.image]}
							containerClassName="aspect-square rounded-lg border"
							isLoading={slowLoading}
						/>
					</div>
				</div>

				{/* Video Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">Video Media</h2>
					<div data-testid="media-video">
						<Media
							name="Test Video"
							assets={[TEST_ASSETS.video]}
							containerClassName="aspect-square rounded-lg border"
							isLoading={slowLoading}
						/>
					</div>
				</div>

				{/* Fallback Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">Fallback Media</h2>
					<div data-testid="media-fallback">
						<Media
							name="Test Fallback"
							assets={[TEST_ASSETS.brokenImage, TEST_ASSETS.image]}
							containerClassName="aspect-square rounded-lg border"
						/>
					</div>
				</div>

				{/* Iframe Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">Iframe Media</h2>
					<div data-testid="media-iframe">
						<Media
							name="Test Iframe"
							assets={[`${TEST_ASSETS.iframe}.html`]}
							containerClassName="aspect-square rounded-lg border"
						/>
					</div>
				</div>

				{/* 3D Model Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">3D Model Media</h2>
					<div data-testid="media-3d-model">
						<Media
							name="Test 3D Model"
							assets={[TEST_ASSETS.model3d]}
							containerClassName="aspect-square rounded-lg border"
						/>
					</div>
				</div>

				{/* Custom Fallback Test */}
				<div className="space-y-2">
					<h2 className="font-semibold">Custom Fallback</h2>
					<div data-testid="media-custom-fallback">
						<Media
							name="Test Custom Fallback"
							assets={[TEST_ASSETS.brokenImage]}
							containerClassName="aspect-square rounded-lg border"
							fallbackContent={
								<div className="flex h-full flex-col items-center justify-center">
									<div className="mb-2 text-4xl">🎨</div>
									<div className="font-medium text-sm">No Media Available</div>
								</div>
							}
						/>
					</div>
				</div>
			</div>

			{/* Showcase for visual regression testing */}
			<div className="mt-12" data-testid="media-showcase">
				<h2 className="mb-4 font-bold text-xl">Media Showcase</h2>
				<div className="grid grid-cols-4 gap-4">
					<Media
						name="Showcase 1"
						assets={[TEST_ASSETS.image]}
						containerClassName="aspect-square rounded border"
					/>
					<Media
						name="Showcase 2"
						assets={[TEST_ASSETS.video]}
						containerClassName="aspect-square rounded border"
					/>
					<Media
						name="Showcase 3"
						assets={[]}
						containerClassName="aspect-square rounded border"
					/>
					<Media
						name="Showcase 4"
						assets={[TEST_ASSETS.image]}
						containerClassName="aspect-square rounded border"
						isLoading={true}
					/>
				</div>
			</div>

			{/* SSR Test Section */}
			<div className="mt-12 rounded bg-gray-100 p-4">
				<h2 className="mb-4 font-bold text-xl">SSR Test</h2>
				<p className="mb-4 text-gray-600 text-sm">
					This section tests server-side rendering. Check the page source to
					verify proper HTML generation.
				</p>
				<Media
					name="SSR Test Media"
					assets={[TEST_ASSETS.image]}
					containerClassName="aspect-video rounded-lg border"
				/>
			</div>
		</div>
	);
}
