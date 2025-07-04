'use client';

import { useEffect, useState } from 'react';
import ChessTileImageImport from '../../../../react/ui/images/chess-tile.png';

// Handle both string and StaticImageData types
const ChessTileImage =
	typeof ChessTileImageImport === 'string'
		? ChessTileImageImport
		: (ChessTileImageImport as any).src || ChessTileImageImport;

import { cn } from '../../../../utils';
import { fetchContentType } from '../../../../utils/fetchContentType';
import {
	useIframeLoad,
	useImageLoad,
	useVideoLoad,
} from '../../../hooks/useMediaLoad';
import ModelViewer from '../ModelViewer';
import MediaSkeleton from './MediaSkeleton';
import type { ContentTypeState, MediaProps } from './types';
import { getContentType } from './utils';

/**
 * @description This component is used to display a collectible asset.
 * It will display the first valid asset from the assets array.
 * If no valid asset is found, it will display the fallback content or the default placeholder image.
 *
 * @example
 * <Media
 *  name="Collectible"
 *  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
 *  assetSrcPrefixUrl="https://example.com/"
 *  className="w-full h-full"
 *  fallbackContent={<YourCustomFallbackComponent />} // Optional custom fallback content
 * />
 */
export function Media({
	name,
	assets,
	assetSrcPrefixUrl,
	className = '',
	containerClassName = '',
	mediaClassname = '',
	isLoading,
	fallbackContent,
}: MediaProps) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
	const [isSafari, setIsSafari] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [contentType, setContentType] = useState<ContentTypeState>({
		type: null,
		loading: true,
		failed: false,
	});

	useEffect(() => {
		setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
		setIsClient(true);
	}, []);

	const validAssets = assets.filter((asset): asset is string => !!asset);
	const assetUrl = validAssets[currentAssetIndex];
	const proxiedAssetUrl = assetUrl
		? assetSrcPrefixUrl
			? `${assetSrcPrefixUrl}${assetUrl}`
			: assetUrl
		: '';

	const containerClassNames = cn(
		'relative aspect-square overflow-hidden bg-background-secondary',
		containerClassName || className,
	);

	useEffect(() => {
		if (!assetUrl) {
			setContentType({ type: null, loading: false, failed: true });
			return;
		}

		const determineContentType = async () => {
			try {
				const type = await getContentType(proxiedAssetUrl);
				setContentType({ type, loading: false, failed: false });
			} catch {
				try {
					const type = await fetchContentType(proxiedAssetUrl);
					setContentType({ type, loading: false, failed: false });
				} catch {
					handleAssetError();
					setContentType({ type: null, loading: false, failed: true });
				}
			}
		};

		determineContentType();
	}, [proxiedAssetUrl, assetUrl]);

	const handleAssetError = () => {
		const nextIndex = currentAssetIndex + 1;
		if (nextIndex < assets.length) {
			setCurrentAssetIndex(nextIndex);
			setAssetLoadFailed(false);
		} else {
			setAssetLoadFailed(true);
		}
	};

	// Use the SSR-safe hooks for loading detection
	const { imgRef, isLoaded: imageLoaded } = useImageLoad({
		onError: handleAssetError,
		src: proxiedAssetUrl,
		enabled:
			contentType.type !== 'video' &&
			contentType.type !== 'html' &&
			contentType.type !== '3d-model',
	});

	const { videoRef, isLoaded: videoLoaded } = useVideoLoad({
		onError: handleAssetError,
		src: proxiedAssetUrl,
		enabled: contentType.type === 'video',
	});

	const { iframeRef, isLoaded: iframeLoaded } = useIframeLoad({
		onError: handleAssetError,
		src: proxiedAssetUrl,
		enabled: contentType.type === 'html',
	});

	const renderFallback = () => {
		if (fallbackContent) {
			return (
				<div
					className={cn(
						'flex h-full w-full items-center justify-center',
						containerClassNames,
					)}
				>
					{fallbackContent}
				</div>
			);
		}

		return (
			<div className={cn('h-full w-full', containerClassNames)}>
				<img
					src={ChessTileImage}
					alt={name || 'Collectible'}
					className="h-full w-full object-cover"
					onError={(e) => {
						console.error('Failed to load placeholder image');
						e.currentTarget.style.display = 'none';
					}}
				/>
			</div>
		);
	};

	// Display fallback if asset fails to load or doesn't exist
	if (assetLoadFailed || (!isLoading && contentType.failed) || !assetUrl) {
		return renderFallback();
	}

	// Render based on content type
	if (contentType.type === 'html' && !assetLoadFailed) {
		const isIframeReady =
			isClient && iframeLoaded && !contentType.loading && !isLoading;
		const iframeSkeletonClassNames = cn(
			'transition-opacity duration-300 ease-in-out pointer-events-none',
			isIframeReady ? 'opacity-0' : 'opacity-100',
		);
		const iframeClassNames = cn(
			'aspect-square w-full transition-opacity duration-300',
			isIframeReady ? 'opacity-100' : 'opacity-0',
			mediaClassname,
		);

		return (
			<div
				className={cn(
					'flex w-full items-center justify-center rounded-lg',
					containerClassNames,
				)}
			>
				<MediaSkeleton className={iframeSkeletonClassNames} />

				<iframe
					ref={iframeRef}
					title={name || 'Collectible'}
					className={iframeClassNames}
					src={proxiedAssetUrl}
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					sandbox="allow-scripts"
					style={{ border: '0px' }}
				/>
			</div>
		);
	}

	if (contentType.type === '3d-model' && !assetLoadFailed) {
		return (
			<div className={cn('h-full w-full', containerClassNames)}>
				<ModelViewer
					src={proxiedAssetUrl}
					posterSrc={ChessTileImage as string}
					onError={handleAssetError}
				/>
			</div>
		);
	}

	if (contentType.type === 'video' && !assetLoadFailed) {
		const isVideoReady =
			isClient && videoLoaded && !contentType.loading && !isLoading;
		const videoSkeletonClassNames = cn(
			'transition-opacity duration-300 ease-in-out pointer-events-none',
			isVideoReady ? 'opacity-0' : 'opacity-100',
		);
		const videoClassNames = cn(
			'absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-hover',
			isVideoReady ? 'opacity-100' : 'opacity-0',
			// we can't hide the video controls in safari, when user hovers over the video they show up.
			// `pointer-events-none` is the only way to hide them on hover
			isSafari && 'pointer-events-none',
			mediaClassname,
		);

		return (
			<div className={containerClassNames}>
				<MediaSkeleton className={videoSkeletonClassNames} />

				<video
					ref={videoRef}
					className={videoClassNames}
					autoPlay
					loop
					controls
					playsInline
					muted
					controlsList="nodownload noremoteplayback nofullscreen"
					data-testid="collectible-asset-video"
				>
					<source src={proxiedAssetUrl} />
				</video>
			</div>
		);
	}

	// Default to image renderer
	const imgSrc =
		assetLoadFailed || contentType.failed ? ChessTileImage : proxiedAssetUrl;

	// Determine if content is ready to show
	const isContentReady =
		isClient && imageLoaded && !contentType.loading && !isLoading;

	const imgClassNames = cn(
		'absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-hover',
		isContentReady ? 'opacity-100' : 'opacity-0',
		mediaClassname,
	);

	const skeletonClassNames = cn(
		'transition-opacity duration-300 ease-in-out pointer-events-none',
		isContentReady ? 'opacity-0' : 'opacity-100',
	);

	return (
		<div className={containerClassNames}>
			<MediaSkeleton className={skeletonClassNames} />

			<img
				ref={imgRef}
				src={imgSrc}
				alt={name || 'Collectible'}
				className={imgClassNames}
				data-loaded={imageLoaded}
				data-src={imgSrc}
			/>
		</div>
	);
}
