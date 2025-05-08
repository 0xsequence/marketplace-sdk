'use client';

import { useState } from 'react';

import CollectionAvatarPlaceholderImage from '~/components/icons/CollectionAvatar';
import { cn } from '~/lib/utils';

import { Image } from '@0xsequence/design-system';

type CollectionImageProps = React.ComponentPropsWithoutRef<typeof Image> & {
	placeholderClassName?: string;
	fallbackClassName?: string;
};

function CollectionImage(props: CollectionImageProps) {
	const [isError, setIsError] = useState(false);

	if (isError || !props.src) {
		console.log('isError', isError);
		return (
			<div
				className={cn(
					'flex items-center justify-center overflow-hidden rounded-full p-2',
					'h-10 w-10 md:h-12 md:w-12',
					props.fallbackClassName,
				)}
			>
				<CollectionAvatarPlaceholderImage
					className={cn(
						'h-5 w-5 text-primary md:h-6 md:w-6',
						props.placeholderClassName,
					)}
				/>
			</div>
		);
	}

	return (
		<Image
			{...props}
			onError={() => setIsError(true)}
			alt={props.alt || 'Collection image'}
			src={props.src}
		/>
	);
}

export default CollectionImage;
