import { useOpenConnectModal } from '@0xsequence/connect';
import { Button, type IconProps } from '@0xsequence/design-system';
import type { ComponentType } from 'react';
import { useAccount } from 'wagmi';
import { setPendingAction } from '../store';
import type { CollectibleCardAction } from '../types';

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
	const { address } = useAccount();
	const { setOpenConnectModal } = useOpenConnectModal();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!address && action) {
			setPendingAction(action, onClick, tokenId);
			setOpenConnectModal(true);
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
