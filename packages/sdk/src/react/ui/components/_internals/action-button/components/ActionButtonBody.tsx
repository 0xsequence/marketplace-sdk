import { Button } from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import { useAccount } from 'wagmi';
import { setPendingAction } from '../store';
import { actionButton } from '../styles.css';
import type { CollectibleCardAction } from '../types';

type ActionButtonBodyProps = {
	label: 'Buy now' | 'Sell' | 'Make an offer' | 'Create listing' | 'Transfer';
	tokenId: string;
	onClick: () => void;
	icon?: React.ComponentType<{
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
	}>;
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
			className={actionButton}
			variant="primary"
			label={label}
			onClick={handleClick}
			leftIcon={icon}
			size="xs"
			shape="square"
			width="full"
		/>
	);
}
