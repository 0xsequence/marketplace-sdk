'use client';

import { cn, IconButton } from '@0xsequence/design-system';
import { forwardRef } from 'react';
import type { Order } from '../../../../_internal';
import { useCollectibleCardOfferState } from '../../../../hooks/ui/useCollectibleCardOfferState';
import SvgBellIcon from '../../../icons/BellIcon';
import { OFFER_BELL_RESERVED_CHARS } from '../constants';

export interface CardTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	highestOffer?: Order;
	onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	balance?: string;
	maxLength?: number;
}

interface OfferBellProps {
	canAcceptOffer: boolean;
	onOfferClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function OfferBell({ canAcceptOffer, onOfferClick }: OfferBellProps) {
	return (
		<IconButton
			className={`absolute top-0 right-0 z-10 h-[22px] w-[22px] ${!canAcceptOffer ? 'opacity-50 hover:animate-none hover:opacity-50' : 'hover:animate-bell-ring'}`}
			size="xs"
			variant="primary"
			onClick={(e) => {
				if (!canAcceptOffer) {
					return;
				}

				e.stopPropagation();
				e.preventDefault();
				onOfferClick?.(e);
			}}
			onMouseEnter={(e) => {
				if (canAcceptOffer) {
					e.stopPropagation();
				}
			}}
			icon={(props) => <SvgBellIcon {...props} size="xs" />}
		/>
	);
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	(
		{
			children,
			className,
			as: Comp = 'h3',
			highestOffer,
			onOfferClick,
			balance,
			maxLength,
			...props
		},
		ref,
	) => {
		const collectibleCardOfferState = useCollectibleCardOfferState(
			highestOffer,
			balance,
		);
		const name =
			typeof children === 'string'
				? children
				: typeof children === 'number'
					? String(children)
					: '';

		const truncateAt = maxLength
			? collectibleCardOfferState
				? maxLength - OFFER_BELL_RESERVED_CHARS
				: maxLength
			: Number.POSITIVE_INFINITY;

		const displayName =
			name.length > truncateAt ? `${name.substring(0, truncateAt)}...` : name;

		const showOfferBell = collectibleCardOfferState && onOfferClick;

		return (
			<div className="relative flex w-full items-center justify-between">
				<Comp
					ref={ref}
					className={cn(
						'overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100',
						className,
					)}
					{...props}
				>
					{displayName || 'Untitled'}
				</Comp>

				{showOfferBell && (
					<OfferBell
						canAcceptOffer={collectibleCardOfferState.canAcceptOffer}
						onOfferClick={onOfferClick}
					/>
				)}
			</div>
		);
	},
);

CardTitle.displayName = 'CardTitle';
