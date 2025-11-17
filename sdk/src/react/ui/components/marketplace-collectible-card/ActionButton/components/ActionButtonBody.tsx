'use client';

import { Button } from '@0xsequence/design-system';
import type { JSX } from 'react';
import { useAccount } from 'wagmi';
import type { CollectibleCardAction } from '../../../../../../types';
import { cn } from '../../../../../../utils';
import { useOpenConnectModal } from '../../../../../hooks';
import { useActionButtonStore } from '../store';

type ActionButtonBodyProps = {
	label:
		| 'Buy now'
		| 'Sell'
		| 'Make an offer'
		| 'Create listing'
		| 'Transfer'
		| string;
	tokenId: bigint;
	onClick: () => void;
	icon?: JSX.Element;
	action?: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
	className?: string;
};

export function ActionButtonBody({
	tokenId,
	label,
	onClick,
	icon,
	action,
	className,
}: ActionButtonBodyProps) {
	const { openConnectModal } = useOpenConnectModal();
	const { setPendingAction } = useActionButtonStore();
	const { address } = useAccount();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!address && action) {
			setPendingAction(action, onClick, tokenId);
			openConnectModal();
		} else {
			onClick();
		}
	};

	return (
		<Button
			className={cn('flex w-full items-center justify-center', className ?? '')}
			variant="primary"
			onClick={handleClick}
			size="xs"
			shape="square"
		>
			{icon && icon}

			{label}
		</Button>
	);
}
