'use client';

import { Button, Spinner } from '@0xsequence/design-system';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import { useModalState } from '../../../store';

const TransferButton = ({
	onClick,
	isDisabled,
}: {
	onClick: () => Promise<void>;
	isDisabled: boolean | undefined;
}) => {
	const { wallet } = useWallet();
	const isWaaS = wallet?.isWaaS;
	const { transferIsProcessesing } = useModalState();

	const label = transferIsProcessesing ? (
		isWaaS ? (
			<div className="flex items-center justify-center gap-2">
				<Spinner size="sm" className="text-white" />
				<span>Loading fee options</span>
			</div>
		) : (
			<div className="flex items-center justify-center gap-2">
				<Spinner size="sm" className="text-white" />
				<span>Transferring</span>
			</div>
		)
	) : (
		'Transfer'
	);

	return (
		<Button
			className="flex justify-self-end px-10"
			onClick={onClick}
			disabled={!!isDisabled}
			title="Transfer"
			label={label}
			variant="primary"
			shape="square"
			size="sm"
		/>
	);
};

export default TransferButton;
