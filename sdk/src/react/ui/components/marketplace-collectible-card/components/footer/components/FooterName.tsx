'use client';

import { cn, IconButton, Text } from '@0xsequence/design-system';
import type { Order } from '../../../../../../_internal';
import SvgBellIcon from '../../../../../icons/BellIcon';

interface FooterNameProps {
	name: string;
	isShop?: boolean;
	highestOffer?: Order;
	onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	quantityInitial?: string;
	quantityRemaining?: string;
}

export const FooterName = ({
	name,
	isShop,
	highestOffer,
	onOfferClick,
	quantityInitial,
	quantityRemaining,
}: FooterNameProps) => {
	const displayName = (() => {
		if (name.length > 15 && highestOffer && !isShop) {
			return `${name.substring(0, 13)}...`;
		}
		if (name.length > 17 && !highestOffer && !isShop) {
			return `${name.substring(0, 17)}...`;
		}
		if (name.length > 17) {
			return `${name.substring(0, 17)}...`;
		}
		return name;
	})();

	return (
		<div className="relative flex w-full items-center justify-between">
			<Text
				className={cn(
					'overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100',
					isShop &&
						(quantityInitial === undefined ||
							quantityRemaining === undefined) &&
						'text-text-50',
				)}
			>
				{displayName || 'Untitled'}
			</Text>

			{highestOffer && onOfferClick && !isShop && (
				<IconButton
					className="absolute top-0 right-0 h-[22px] w-[22px] hover:animate-bell-ring"
					size="xs"
					variant="primary"
					onClick={(e) => {
						e.stopPropagation();
						onOfferClick(e);
					}}
					icon={(props) => <SvgBellIcon {...props} size="xs" />}
				/>
			)}
		</div>
	);
};
