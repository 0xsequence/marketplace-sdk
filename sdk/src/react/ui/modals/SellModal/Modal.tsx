'use client';

import { useConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
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
		flow,
		error,
		close,
		isOpen,
		queries,
	} = useSellModalContext();
	const isUserRejectedError = error
		?.toString()
		.includes('User rejected the request');
	const { waasFeeOptionSelectionType } = useConfig();

	if (!isOpen) {
		return null;
	}

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell');
	const pendingStep = flow.steps.find((s) => s.isPending);

	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	const approvalAction = showApprovalButton
		? {
				label: approvalStep.label,
				actionName: approvalStep.label,
				onClick: approvalStep.run,
				loading: approvalStep.isPending,
				disabled:
					!flow.nextStep || (!!error && !isUserRejectedError) || flow.isPending,
				variant: 'secondary' as const,
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	const sellAction = {
		label: sellStep?.label,
		actionName: sellStep?.label,
		onClick: sellStep?.run || (() => {}),
		loading: sellStep?.isPending && !showApprovalButton,
		disabled:
			!flow.nextStep ||
			(!!error && !isUserRejectedError) ||
			(showApprovalButton && flow.isPending) ||
			flow.isPending,
		testid: 'sell-modal-accept-button',
	};

	return (
		<ActionModal
			chainId={chainId}
			onClose={() => {
				close();
				//waasFees.reset();
			}}
			title="You have an offer"
			type="sell"
			primaryAction={
				sellStep?.waasFee.selectedOption &&
				waasFeeOptionSelectionType === 'manual'
					? undefined
					: sellAction
			}
			secondaryAction={
				sellStep?.waasFee.selectedOption &&
				waasFeeOptionSelectionType === 'manual'
					? undefined
					: approvalAction
			}
			queries={queries}
			externalError={error}
			actionError={sellStep?.waasFee.waasFeeSelectionError}
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

					{pendingStep?.waasFee.selectedOption &&
						waasFeeOptionSelectionType === 'manual' && (
							<SelectWaasFeeOptions
								chainId={chainId}
								feeOptionConfirmation={
									pendingStep.waasFee.feeOptionConfirmation
								}
								selectedOption={pendingStep.waasFee.selectedOption}
								onSelectedOptionChange={
									pendingStep.waasFee.setSelectedFeeOption
								}
								onConfirm={() => {
									const confirmationId =
										pendingStep.waasFee.feeOptionConfirmation?.id;
									// null is used to indicate that the currency is the native currency
									const currencyAddress =
										pendingStep.waasFee.selectedOption?.token.contractAddress ||
										null;
									if (confirmationId) {
										pendingStep.waasFee.confirmFeeOption?.(
											confirmationId,
											currencyAddress,
										);
										pendingStep.waasFee.setOptionConfirmed(true);
									}
								}}
								optionConfirmed={pendingStep.waasFee.optionConfirmed}
								titleOnConfirm="Confirming sale..."
							/>
						)}
				</>
			)}
		</ActionModal>
	);
}
