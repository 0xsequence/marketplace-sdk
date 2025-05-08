import CollectionAvatarPlaceholderImage from '~/components/icons/CollectionAvatar';
import CustomNetworkImage from '~/components/network-image';
import { getProxyImageUrl } from '~/lib/image-proxy';
import { cn, isVideo } from '~/lib/utils';

import { Text } from '@0xsequence/design-system';
import { Image } from '@0xsequence/design-system';
import CollectionImage from './collection-image';

export const CollectionCard = ({
	bannerUrl,
	chainId,
	name,
	symbol,
	type,
	collectionImage,
}: {
	bannerUrl?: string;
	chainId: number;
	name: string;
	symbol: string;
	type: string;
	collectionImage: string;
}) => {
	const collectionBannerPlaceholderImageUrl =
		'/images/collection-banner-placeholder.png';

	const bannerImage = bannerUrl
		? bannerUrl
		: collectionBannerPlaceholderImageUrl;

	return (
		<div
			className={cn(
				'relative overflow-hidden cursor-pointer',
				'h-[240px] md:h-[250px]',
				'rounded-xl',
				bannerImage ? 'border border-primary/15' : '',
				'ring-selected-highlight',
				bannerImage
					? 'active:ring-1 active:border-selected-highlight'
					: 'active:ring-2 active:border-none',
				'focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary focus-visible:ring-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus-ring',
				'group',
			)}
		>
			<div className="relative w-full h-full overflow-hidden">
				{isVideo(bannerImage) ? (
					<video
						autoPlay
						loop
						muted
						playsInline
						src={bannerImage}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						onError={(e) => {
							e.currentTarget.src = collectionBannerPlaceholderImageUrl;
						}}
					/>
				) : (
					<Image
						src={getProxyImageUrl(bannerImage, 470, 300, { crop: false })}
						alt=""
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						onError={(e) => {
							e.currentTarget.src = collectionBannerPlaceholderImageUrl;
						}}
					/>
				)}
				<div
					className="absolute w-full h-full object-cover top-0"
					style={{
						background:
							'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)',
					}}
				/>
			</div>

			<div className="flex absolute bottom-4 left-4 flex-col gap-3 content-end">
				<div className="flex items-center gap-2">
					{collectionImage ? (
						<CollectionImage
							src={collectionImage}
							alt={symbol}
							className="w-10 h-10 md:w-12 md:h-12 rounded-full"
						/>
					) : (
						<div className="bg-background-secondary rounded-full p-2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
							<CollectionAvatarPlaceholderImage className="w-5 h-5 md:w-6 md:h-6 text-primary" />
						</div>
					)}

					<div className="flex flex-col">
						<div className="flex items-center">
							<Text
								className="text-xl font-semibold text-primary truncate max-w-[200px]"
								title={name}
							>
								{name}
							</Text>

							<div className="ml-2 flex-shrink-0">
								<CustomNetworkImage size="sm" chainId={chainId} />
							</div>
						</div>

						<Text className="text-sm text-secondary line-clamp-1">{type}</Text>
					</div>
				</div>
			</div>
		</div>
	);
};
