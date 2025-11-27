'use client';

import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './internal/context';

export function SellModal() {
	const {
		tokenId,
		collectionAddress,
		chainId,
		offer,
		steps,
		flow,
		error,
		close,
		isOpen,
		queries,
	} = useSellModalContext();

	if (!isOpen) {
		return null;
	}

	const approvalStep = steps.approval;
	const sellStep = steps.sell;
	const feeStep = steps.fee;

	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	const approvalAction = showApprovalButton
		? {
				label: approvalStep.label,
				actionName: approvalStep.label,
				onClick: approvalStep.execute,
				loading: approvalStep.isPending,
				disabled: approvalStep.isDisabled || !!error || flow.isPending,
				variant: 'secondary' as const,
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	const sellAction = {
		label: sellStep.label,
		actionName: sellStep.label,
		onClick: sellStep.execute,
		loading: sellStep.isPending && !showApprovalButton,
		disabled:
			sellStep.isDisabled || !!error || (showApprovalButton && flow.isPending),
		testid: 'sell-modal-accept-button',
	};

	return (
		<ActionModal
			chainId={chainId}
			onClose={() => {
				close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
			title="You have an offer"
			type="sell"
			primaryAction={sellAction}
			secondaryAction={approvalAction}
			queries={queries}
			externalError={error}
		>
			{({ collection, currency }) => (
				<>
					<TransactionHeader
						title="Offer received"
						currencyImageUrl={currency?.imageUrl}
						date={offer.order ? new Date(offer.order.createdAt) : undefined}
					/>

					<TokenPreview
						collectionName={collection.name}
						collectionAddress={collectionAddress}
						tokenId={tokenId}
						chainId={chainId}
					/>

					<TransactionDetails
						tokenId={tokenId}
						collectionAddress={collectionAddress}
						chainId={chainId}
						includeMarketplaceFee={true}
						price={
							offer.priceAmount
								? {
										amountRaw: offer.priceAmount,
										currency,
									}
								: undefined
						}
						currencyImageUrl={currency.imageUrl}
					/>

					{feeStep?.isSelecting && (
						<SelectWaasFeeOptions
							chainId={chainId}
							onCancel={feeStep.cancel}
							titleOnConfirm="Accepting offer..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
}
