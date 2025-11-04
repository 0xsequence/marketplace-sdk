'use client';

import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { type SellStep, useSellModalContext } from './internal/context';

export function SellModal() {
	const {
		tokenId,
		collectionAddress,
		chainId,
		offer,
		flow,
		error,
		close,
		isOpen,
		queries,
		waasFees,
	} = useSellModalContext();

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
			!flow.nextStep ||
			!!error ||
			(showApprovalButton && flow.isPending) ||
			flow.isPending,
		testid: 'sell-modal-accept-button',
	};

	return (
		<ActionModal
			chainId={chainId}
			onClose={() => {
				close();
				waasFees.reset();
			}}
			title="You have an offer"
			type="sell"
			primaryAction={waasFees.shouldHideActionButton ? undefined : sellAction}
			secondaryAction={
				waasFees.shouldHideActionButton ? undefined : approvalAction
			}
			queries={queries}
			externalError={error}
			actionError={waasFees.autoSelectError}
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
						collectibleId={tokenId}
						chainId={chainId}
					/>

					<TransactionDetails
						collectibleId={tokenId}
						collectionAddress={collectionAddress}
						chainId={chainId}
						includeMarketplaceFee={true}
						price={
							offer.priceAmount
								? {
										amountRaw: offer.priceAmount,
										currency: currency,
									}
								: undefined
						}
						currencyImageUrl={currency.imageUrl}
					/>

					{waasFees.waasFeeOptionsShown && (
						<SelectWaasFeeOptions
							chainId={Number(chainId)}
							waasFees={waasFees}
							titleOnConfirm="Confirming sell..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
}
