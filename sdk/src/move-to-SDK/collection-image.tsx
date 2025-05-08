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
					'rounded-full flex items-center justify-center p-2 overflow-hidden',
					'w-10 h-10 md:w-12 md:h-12',
					props.fallbackClassName,
				)}
			>
				<CollectionAvatarPlaceholderImage
					className={cn(
						'w-5 h-5 md:w-6 md:h-6 text-primary',
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
