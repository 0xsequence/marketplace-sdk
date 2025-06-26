'use client';

import { Button, type IconProps } from '@0xsequence/design-system';
import type { ComponentType } from 'react';
import type { CollectibleCardAction } from '../../../../../../types';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { useOpenConnectModal } from '../../../../../hooks';
import { setPendingAction } from '../store';

type ActionButtonBodyProps = {
	label: 'Buy now' | 'Sell' | 'Make an offer' | 'Create listing' | 'Transfer';
	tokenId: string;
	onClick: () => void;
	icon?: ComponentType<IconProps>;
	action?: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
};

export function ActionButtonBody({
	tokenId,
	label,
	onClick,
	icon,
	action,
}: ActionButtonBodyProps) {
	const { wallet } = useWallet();
	const address = wallet?.address;
	const { openConnectModal } = useOpenConnectModal();

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
			className="flex w-full items-center justify-center"
			variant="primary"
			label={label}
			onClick={handleClick}
			leftIcon={icon}
			size="xs"
			shape="square"
		/>
	);
}
