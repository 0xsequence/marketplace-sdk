'use client';

import { useEffect, useState } from 'react';
import ChessTileImage from '../../../../react/ui/images/chess-tile.png';
import { cn } from '../../../../utils';
import { fetchContentType } from '../../../../utils/fetchContentType';
import {
	useIframeLoad,
	useImageLoad,
	useVideoLoad,
} from '../../../hooks/useImageLoad';
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
	className,
	isLoading,
	fallbackContent,
	shouldListenForLoad = true,
}: MediaProps) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
	const [isSafari, setIsSafari] = useState(false);
	const [contentType, setContentType] = useState<ContentTypeState>({
		type: null,
		loading: true,
		failed: false,
	});

	useEffect(() => {
		setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
	}, []);

	const validAssets = assets.filter((asset): asset is string => !!asset);
	const assetUrl = validAssets[currentAssetIndex];
	const proxiedAssetUrl = assetUrl
		? assetSrcPrefixUrl
			? `${assetSrcPrefixUrl}${assetUrl}`
			: assetUrl
		: '';

	const classNames = cn(
		'relative aspect-square overflow-hidden bg-background-secondary',
		className,
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

	const handleAssetLoad = () => {
		// Asset loaded successfully
	};

	// Use the SSR-safe hooks for loading detection
	const { imgRef, isLoaded: imageLoaded } = useImageLoad({
		onLoad: shouldListenForLoad ? handleAssetLoad : undefined,
		onError: shouldListenForLoad ? handleAssetError : undefined,
		src: proxiedAssetUrl,
		enabled:
			shouldListenForLoad &&
			contentType.type !== 'video' &&
			contentType.type !== 'html' &&
			contentType.type !== '3d-model',
	});

	const { videoRef, isLoaded: videoLoaded } = useVideoLoad({
		onLoad: shouldListenForLoad ? handleAssetLoad : undefined,
		onError: shouldListenForLoad ? handleAssetError : undefined,
		src: proxiedAssetUrl,
		enabled: shouldListenForLoad && contentType.type === 'video',
	});

	const { iframeRef, isLoaded: iframeLoaded } = useIframeLoad({
		onLoad: shouldListenForLoad ? handleAssetLoad : undefined,
		onError: shouldListenForLoad ? handleAssetError : undefined,
		src: proxiedAssetUrl,
		enabled: shouldListenForLoad && contentType.type === 'html',
	});

	const renderFallback = () => {
		if (fallbackContent) {
			return (
				<div
					className={cn(
						'flex h-full w-full items-center justify-center',
						classNames,
					)}
				>
					{fallbackContent}
				</div>
			);
		}

		return (
			<div className={cn('h-full w-full', classNames)}>
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
		return (
			<div
				className={cn(
					'flex w-full items-center justify-center rounded-lg',
					classNames,
				)}
			>
				{(!iframeLoaded || contentType.loading || isLoading) && (
					<MediaSkeleton />
				)}

				<iframe
					ref={iframeRef}
					title={name || 'Collectible'}
					className="aspect-square w-full"
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
			<div className={cn('h-full w-full', classNames)}>
				<ModelViewer
					src={proxiedAssetUrl}
					posterSrc={ChessTileImage}
					onLoad={shouldListenForLoad ? handleAssetLoad : undefined}
					onError={shouldListenForLoad ? handleAssetError : undefined}
				/>
			</div>
		);
	}

	if (contentType.type === 'video' && !assetLoadFailed) {
		const videoClassNames = cn(
			'absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover',
			videoLoaded && !isLoading ? 'visible' : 'invisible',
			// we can't hide the video controls in safari, when user hovers over the video they show up.
			// `pointer-events-none` is the only way to hide them on hover
			isSafari && 'pointer-events-none',
		);

		return (
			<div className={classNames}>
				{(!videoLoaded || contentType.loading || isLoading) && (
					<MediaSkeleton />
				)}

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

	const imgClassNames = cn(
		'absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover',
		imageLoaded && !contentType.loading && !isLoading ? 'visible' : 'invisible',
	);

	return (
		<div className={classNames}>
			{(!imageLoaded || contentType.loading || isLoading) && <MediaSkeleton />}

			<img
				ref={imgRef}
				src={imgSrc}
				alt={name || 'Collectible'}
				className={imgClassNames}
			/>
		</div>
	);
}
