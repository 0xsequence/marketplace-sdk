import { Button, Spinner } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { transferModal$ } from '../../../_store';

const TransferButton = observer(
	({
		onClick,
		isDisabled,
	}: {
		onClick: () => Promise<void>;
		isDisabled: boolean | undefined;
	}) => {
		const isProcessing = transferModal$.state.transferIsBeingProcessed.get();

		return (
			<Button
				className="flex justify-self-end px-10"
				onClick={onClick}
				disabled={!!isDisabled}
				title="Transfer"
				label={
					isProcessing ? (
						<div className="flex items-center justify-center gap-2">
							<Spinner size="sm" className="text-white" />
							<span>Transferring</span>
						</div>
					) : (
						'Transfer'
					)
				}
				variant="primary"
				shape="square"
				size="sm"
			/>
		);
	},
);

export default TransferButton;
