'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { Button, Spinner } from '@0xsequence/design-system';
import { useConnectorMetadata } from '../../../../../../hooks/config/useConnectorMetadata';
import { useModalState } from '../../../store';

const TransferButton = ({
	onClick,
	isDisabled,
}: {
	onClick: () => Promise<void>;
	isDisabled: boolean | undefined;
}) => {
	const { isWaaS } = useConnectorMetadata();
	const { transferIsProcessing } = useModalState();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();

	const getLabel = () => {
		if (!transferIsProcessing) return 'Transfer';

		if (isWaaS) {
			// If there are no fee options (sponsored tx) or fee options are confirmed
			if (
				!pendingFeeOptionConfirmation ||
				pendingFeeOptionConfirmation.options.length === 0
			) {
				return (
					<div className="flex items-center justify-center gap-2">
						<Spinner size="sm" className="text-white" />
						<span>Sending transaction</span>
					</div>
				);
			}

			return (
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" className="text-white" />
					<span>Loading fee options</span>
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center gap-2">
				<Spinner size="sm" className="text-white" />
				<span>Transferring</span>
			</div>
		);
	};

	return (
		<Button
			className="flex justify-self-end px-10"
			onClick={onClick}
			disabled={!!isDisabled}
			title="Transfer"
			variant="primary"
			shape="square"
			size="sm"
		>
			{getLabel()}
		</Button>
	);
};

export default TransferButton;
