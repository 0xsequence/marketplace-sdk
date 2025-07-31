'use client';

import { Media } from '../../media/Media';
import { MarketplaceCollectibleCardSkeleton } from '../CollectibleCardSkeleton';
import type { MarketplaceCardBaseProps } from '../types';

export interface BaseCardProps extends MarketplaceCardBaseProps {
	isLoading: boolean;
	name: string;
	image?: string;
	video?: string;
	animationUrl?: string;
	onClick?: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	children: React.ReactNode;
}

export function BaseCard({
	isLoading,
	name,
	image,
	video,
	animationUrl,
	onClick,
	onKeyDown,
	assetSrcPrefixUrl,
	children,
}: BaseCardProps) {
	if (isLoading) {
		return <MarketplaceCollectibleCardSkeleton />;
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: div used as interactive card with proper role and keyboard support
		<div
			data-testid="collectible-card"
			className="w-card-width min-w-card-min-width overflow-hidden rounded-xl border border-border-base bg-background-primary focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus active:border-border-focus active:shadow-active-ring"
			onClick={onClick}
			onKeyDown={onKeyDown}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className="group relative z-10 flex h-full w-full cursor-pointer flex-col items-start overflow-hidden rounded-xl border-none bg-none p-0 focus:outline-none [&:focus]:rounded-[10px] [&:focus]:outline-[3px] [&:focus]:outline-black [&:focus]:outline-offset-[-3px]">
				<article className="w-full rounded-xl">
					<Media
						name={name || ''}
						assets={[image, video, animationUrl]}
						assetSrcPrefixUrl={assetSrcPrefixUrl}
						mediaClassname="object-contain"
					/>
					{children}
				</article>
			</div>
		</div>
	);
}
