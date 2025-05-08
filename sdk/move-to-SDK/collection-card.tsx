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
				'relative cursor-pointer overflow-hidden',
				'h-[240px] md:h-[250px]',
				'rounded-xl',
				bannerImage ? 'border border-primary/15' : '',
				'ring-selected-highlight',
				bannerImage
					? 'active:border-selected-highlight active:ring-1'
					: 'active:border-none active:ring-2',
				'focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-0 focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
				'group',
			)}
		>
			<div className="relative h-full w-full overflow-hidden">
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
					className="absolute top-0 h-full w-full object-cover"
					style={{
						background:
							'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)',
					}}
				/>
			</div>

			<div className="absolute bottom-4 left-4 flex flex-col content-end gap-3">
				<div className="flex items-center gap-2">
					{collectionImage ? (
						<CollectionImage
							src={collectionImage}
							alt={symbol}
							className="h-10 w-10 rounded-full md:h-12 md:w-12"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-secondary p-2 md:h-12 md:w-12">
							<CollectionAvatarPlaceholderImage className="h-5 w-5 text-primary md:h-6 md:w-6" />
						</div>
					)}

					<div className="flex flex-col">
						<div className="flex items-center">
							<Text
								className="max-w-[200px] truncate font-semibold text-primary text-xl"
								title={name}
							>
								{name}
							</Text>

							<div className="ml-2 flex-shrink-0">
								<CustomNetworkImage size="sm" chainId={chainId} />
							</div>
						</div>

						<Text className="line-clamp-1 text-secondary text-sm">{type}</Text>
					</div>
				</div>
			</div>
		</div>
	);
};
