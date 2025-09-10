'use client';

import { cn, IconButton, Text } from '@0xsequence/design-system';
import { useAccount } from 'wagmi';
import { compareAddress } from '../../../../../../../utils/address';
import type { Order } from '../../../../../../_internal';
import SvgBellIcon from '../../../../../icons/BellIcon';

interface FooterNameProps {
	name: string;
	isShop?: boolean;
	highestOffer?: Order;
	onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	quantityInitial?: string;
	quantityRemaining?: string;
	balance?: string;
}

export const FooterName = ({
	name,
	isShop,
	highestOffer,
	onOfferClick,
	quantityInitial,
	quantityRemaining,
	balance,
}: FooterNameProps) => {
	const { address: currentUserAddress } = useAccount();
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

			{highestOffer &&
				onOfferClick &&
				!isShop &&
				(() => {
					// Check if the current user made the offer
					const isOfferMadeBySelf =
						currentUserAddress &&
						highestOffer.createdBy &&
						compareAddress(highestOffer.createdBy, currentUserAddress);

					// Check if user owns the token (has balance > 0)
					const userOwnsToken = balance && Number(balance) > 0;

					// Can accept offer: didn't make the offer AND owns the token
					const canAcceptOffer = !isOfferMadeBySelf && userOwnsToken;

					// Should show disabled styling: can't accept offer
					const shouldDisable = !canAcceptOffer;

					return (
						<IconButton
							className={`absolute top-0 right-0 z-10 h-[22px] w-[22px] ${shouldDisable ? 'opacity-50 hover:animate-none hover:opacity-50' : 'hover:animate-bell-ring'}`}
							size="xs"
							variant="primary"
							onClick={(e) => {
								if (!canAcceptOffer) {
									// For cases where user can't accept offer (offer maker or non-owner), allow normal wrapper behavior
									return;
								}

								// Only stop propagation and open offer modal if user can accept the offer
								e.stopPropagation();
								e.preventDefault();
								onOfferClick?.(e);
							}}
							onMouseEnter={(e) => {
								if (canAcceptOffer) {
									// Only prevent parent hover effects when user can accept offer
									e.stopPropagation();
								}
							}}
							icon={(props) => <SvgBellIcon {...props} size="xs" />}
						/>
					);
				})()}
		</div>
	);
};
