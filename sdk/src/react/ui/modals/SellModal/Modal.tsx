'use client';

import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { type SellStep, useSellModalContext } from './internal/context';

export function SellModal() {
	const { item, offer, flow, feeSelection, error, close, isOpen, queries } =
		useSellModalContext();

	if (!isOpen) {
		return null;
	}

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	const approvalAction = showApprovalButton
		? {
				label: approvalStep.label,
				actionName: approvalStep.label,
				onClick: approvalStep.run,
				loading: approvalStep.isPending,
				disabled: !flow.nextStep || !!error || flow.isPending,
				variant: 'secondary' as const,
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	const sellAction = {
		label: sellStep.label,
		actionName: sellStep.label,
		onClick: sellStep.run,
		loading: sellStep.isPending && !showApprovalButton,
		disabled:
			!flow.nextStep || !!error || (showApprovalButton && flow.isPending),
		testid: 'sell-modal-accept-button',
	};

	return (
		<ActionModal
			chainId={item.chainId}
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
			{() => (
				<>
					<TransactionHeader
						title="Offer received"
						currencyImageUrl={offer.currency?.imageUrl}
						date={offer.order && new Date(offer.order.createdAt)}
					/>

					<TokenPreview
						collectionName={item.collection?.name}
						collectionAddress={item.collectionAddress}
						collectibleId={item.tokenId}
						chainId={item.chainId}
					/>

					<TransactionDetails
						collectibleId={item.tokenId}
						collectionAddress={item.collectionAddress}
						chainId={item.chainId}
						includeMarketplaceFee={true}
						price={
							offer.currency
								? {
										amountRaw: offer.priceAmount,
										currency: offer.currency,
									}
								: undefined
						}
						currencyImageUrl={offer.currency?.imageUrl}
					/>

					{feeSelection?.isSelecting && (
						<SelectWaasFeeOptions
							chainId={item.chainId}
							onCancel={feeSelection.cancel}
							titleOnConfirm="Accepting offer..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
}
