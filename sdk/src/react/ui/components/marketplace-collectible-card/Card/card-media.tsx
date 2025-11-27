'use client';

import { forwardRef } from 'react';
import { cn } from '../../../../../utils';
import { Media } from '../../media/Media';

export interface CollectibleMetadata {
	name?: string;
	image?: string;
	video?: string;
	animation_url?: string;
	decimals?: number;
}

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
	name?: string;
	image?: string;
	video?: string;
	animationUrl?: string;

	metadata?: CollectibleMetadata;

	assetSrcPrefixUrl?: string;
	fallbackContent?: React.ReactNode;
}

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
	(
		{
			name,
			image,
			video,
			animationUrl,
			metadata,
			assetSrcPrefixUrl,
			className,
			fallbackContent,
			...props
		},
		ref,
	) => {
		const finalName = name ?? metadata?.name ?? '';
		const finalImage = image ?? metadata?.image;
		const finalVideo = video ?? metadata?.video;
		const finalAnimationUrl = animationUrl ?? metadata?.animation_url;

		return (
			<div
				className="w-full overflow-hidden"
				style={{
					aspectRatio: '1',
				}}
				ref={ref}
				{...props}
			>
				<Media
					name={finalName}
					assets={[finalImage, finalVideo, finalAnimationUrl]}
					assetSrcPrefixUrl={assetSrcPrefixUrl}
					mediaClassname={cn('object-contain', className)}
					fallbackContent={fallbackContent}
					containerClassName="w-full h-full"
				/>
			</div>
		);
	},
);

CardMedia.displayName = 'CardMedia';
