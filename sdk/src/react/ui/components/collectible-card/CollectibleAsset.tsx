'use client';

import { Skeleton } from '@0xsequence/design-system';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utils';
import type { TokenMetadata } from '../../../_internal';
import ChessTileImage from '../../images/chess-tile.png';

export function CollectibleAssetSkeleton() {
	return (
		<Skeleton
			size="lg"
			className="absolute inset-0 h-full w-full animate-shimmer"
			style={{
				borderRadius: 0,
			}}
		/>
	);
}

export const isHtml = (fileName: string | undefined) => {
	const isHtml = /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase() || '');
	return isHtml;
};

export const isVideo = (fileName: string | undefined) => {
	const isVideo = /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase() || '');
	return isVideo;
};

export const is3dModel = (fileName: string | undefined) => {
	const isGltf = /.*\.gltf$/.test(fileName?.toLowerCase() || '');
	return isGltf;
};

type CollectibleImageProps = {
	name?: string;
	collectibleMetadata?: TokenMetadata;
	assetSrcPrefixUrl?: string;
};

export function CollectibleAsset({
	name,
	collectibleMetadata,
	assetSrcPrefixUrl,
}: CollectibleImageProps) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [assetLoading, setAssetLoading] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	const placeholderImage = ChessTileImage;
	const assetUrl =
		collectibleMetadata?.image ||
		collectibleMetadata?.video ||
		collectibleMetadata?.animation_url ||
		collectibleMetadata?.assets?.[0]?.url;
	const proxiedAssetUrl = assetSrcPrefixUrl
		? `${assetSrcPrefixUrl}${assetUrl}` // assetSrcPrefixUrl must have a trailing slash at the end
		: assetUrl;

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.addEventListener('loadedmetadata', () => {
				setAssetLoading(false);
			});
		}
	}, []);

	if (isHtml(assetUrl)) {
		return (
			<div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-background-secondary">
				{assetLoading && <CollectibleAssetSkeleton />}

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

	if (isVideo(assetUrl)) {
		return (
			<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-background-secondary">
				{assetLoading && <CollectibleAssetSkeleton />}
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
				>
					<source src={proxiedAssetUrl} />
				</video>
			</div>
		);
	}

	return (
		<div className="relative aspect-square overflow-hidden bg-background-secondary">
			{assetLoading && <CollectibleAssetSkeleton />}

			<img
				src={assetLoadFailed ? placeholderImage : proxiedAssetUrl}
				alt={name || 'Collectible'}
				className={`absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover ${
					assetLoading ? 'invisible' : 'visible'
				}`}
				onError={() => setAssetLoadFailed(true)}
				onLoad={() => setAssetLoading(false)}
			/>
		</div>
	);
}
