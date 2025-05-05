'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../../utils';
import { fetchContentType } from '../../../../../utils/fetchContentType';
import ChessTileImage from '../../../images/chess-tile.png';
import CollectibleAssetSkeleton from './CollectibleAssetSkeleton';
import { getContentType } from './utils';

type CollectibleImageProps = {
	name?: string;
	assets?: (string | undefined)[];
	assetSrcPrefixUrl?: string;
	className?: string;
};

/**
 * @description This component is used to display a collectible asset.
 * It will display the first valid asset from the assets array.
 * If no valid asset is found, it will display the placeholder image.
 *
 * @example
 * <CollectibleAsset
 *  name="Collectible"
 *  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
 *  assetSrcPrefixUrl="https://example.com/"
 *  className="w-full h-full"
 * />
 */
export function CollectibleAsset({
	name,
	assets,
	assetSrcPrefixUrl,
	className,
}: CollectibleImageProps) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [assetLoading, setAssetLoading] = useState(true);
	const [contentType, setContentType] = useState<{
		type: 'image' | 'video' | 'html' | null;
		loading: boolean;
		failed: boolean;
	}>({ type: null, loading: true, failed: false });
	const videoRef = useRef<HTMLVideoElement>(null);
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	const placeholderImage = ChessTileImage;
	const assetUrl = assets?.find((asset) => asset) || placeholderImage;
	const proxiedAssetUrl = assetSrcPrefixUrl
		? `${assetSrcPrefixUrl}${assetUrl}` // assetSrcPrefixUrl must have a trailing slash at the end
		: assetUrl;

	useEffect(() => {
		getContentType(proxiedAssetUrl)
			.then((contentType) => {
				setContentType({ type: contentType, loading: false, failed: false });
			})
			.catch(() => {
				fetchContentType(proxiedAssetUrl)
					.then((contentType) => {
						setContentType({
							type: contentType,
							loading: false,
							failed: false,
						});
					})
					.catch(() => {
						setContentType({ type: null, loading: false, failed: true });
					});
			});
	}, [proxiedAssetUrl]);

	if (contentType.type === 'html' && !assetLoadFailed) {
		return (
			<div
				className={cn(
					'flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-background-secondary',
					className,
				)}
			>
				{(assetLoading || contentType.loading) && <CollectibleAssetSkeleton />}

				<iframe
					title={name || 'Collectible'}
					className="aspect-square w-full"
					src={proxiedAssetUrl}
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					sandbox="allow-scripts"
					style={{
						border: '0px',
					}}
					onError={() => setAssetLoadFailed(true)}
					onLoad={() => setAssetLoading(false)}
				/>
			</div>
		);
	}

	// TODO: Add 3d model support

	if (contentType.type === 'video' && !assetLoadFailed) {
		return (
			<div
				className={cn(
					'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-background-secondary',
					className,
				)}
			>
				{(assetLoading || contentType.loading) && <CollectibleAssetSkeleton />}

				<video
					ref={videoRef}
					className={cn(
						`absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover ${
							assetLoading ? 'invisible' : 'visible'
						}`,
						// we can't hide the video controls in safari, when user hovers over the video they show up. `pointer-events-none` is the only way to hide them on hover
						isSafari && 'pointer-events-none',
					)}
					autoPlay
					loop
					controls
					playsInline
					muted
					controlsList="nodownload noremoteplayback nofullscreen "
					onError={() => {
						setAssetLoadFailed(true);
					}}
					onLoadedMetadata={() => {
						setAssetLoading(false);
					}}
					data-testid="collectible-asset-video"
				>
					<source src={proxiedAssetUrl} />
				</video>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'relative aspect-square overflow-hidden bg-background-secondary',
				className,
			)}
		>
			{(assetLoading || contentType.loading) && <CollectibleAssetSkeleton />}

			<img
				src={
					assetLoadFailed || contentType.failed
						? placeholderImage
						: proxiedAssetUrl
				}
				alt={name || 'Collectible'}
				className={`absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover ${
					assetLoading || contentType.loading ? 'invisible' : 'visible'
				}`}
				onError={() => setAssetLoadFailed(true)}
				onLoad={() => setAssetLoading(false)}
			/>
		</div>
	);
}
