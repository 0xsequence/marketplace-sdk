'use client';

import { UserRejectedError } from '../../../../utils/errors';
import { useConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import {
	type SellStep,
	useSellModalContext,
	type WaasFeeSelectionStep,
} from './internal/context';

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
	const isUserRejectedError = error instanceof UserRejectedError;
	const { waasFeeOptionSelectionType } = useConfig();

	if (!isOpen) {
		return null;
	}

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
	const waasFeeStep = flow.steps.find((s) => s.id === 'waas-fee-selection') as
		| WaasFeeSelectionStep
		| undefined;

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
		label: sellStep.label,
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
				waasFeeStep &&
				(waasFeeStep.status === 'idle' || waasFeeStep.status === 'pending') &&
				waasFeeOptionSelectionType === 'manual'
					? undefined
					: sellAction
			}
			secondaryAction={
				waasFeeStep &&
				(waasFeeStep.status === 'idle' || waasFeeStep.status === 'pending') &&
				waasFeeOptionSelectionType === 'manual'
					? undefined
					: approvalAction
			}
			queries={queries}
			externalError={error}
			actionError={waasFeeStep?.waasFee.waasFeeSelectionError}
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

					{(() => {
						const selectedOption = waasFeeStep?.waasFee.selectedOption;
						const onSelectedOptionChange =
							waasFeeStep?.waasFee.setSelectedFeeOption;
						const optionConfirmed =
							waasFeeStep?.waasFee.optionConfirmed || false;

						return ((waasFeeStep &&
							(waasFeeStep.status === 'idle' ||
								waasFeeStep.status === 'pending')) ||
							selectedOption) &&
							waasFeeOptionSelectionType === 'manual' &&
							selectedOption &&
							onSelectedOptionChange ? (
							<SelectWaasFeeOptions
								chainId={chainId}
								feeOptionConfirmation={
									waasFeeStep?.waasFee.feeOptionConfirmation
								}
								selectedOption={selectedOption}
								onSelectedOptionChange={onSelectedOptionChange}
								onConfirm={() => {
									const feeData = waasFeeStep?.waasFee;
									const confirmationId = feeData?.feeOptionConfirmation?.id;
									// null is used to indicate that the currency is the native currency
									const currencyAddress =
										feeData?.selectedOption?.token.contractAddress || null;
									if (confirmationId && feeData) {
										feeData.confirmFeeOption?.(confirmationId, currencyAddress);
										feeData.setOptionConfirmed(true);
									}
								}}
								optionConfirmed={optionConfirmed}
								titleOnConfirm="Confirming sale..."
							/>
						) : null;
					})()}
				</>
			)}
		</ActionModal>
	);
}
