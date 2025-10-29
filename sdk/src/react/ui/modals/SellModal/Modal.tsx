'use client';

import {
	ActionModal,
	type CtaAction,
} from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { type SellStep, useSellModalContext } from './internal/context';

export function SellModal() {
	const { item, offer, flow, feeSelection, error, close, isOpen, loading } =
		useSellModalContext();

	// Only render if modal is open
	if (!isOpen) {
		return null;
	}

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	// Build approval action if needed
	const approvalAction: CtaAction | undefined = showApprovalButton
		? {
				label: approvalStep.label,
				actionName: 'token approval',
				onClick: approvalStep.run,
				loading: approvalStep.isPending,
				disabled: !flow.nextStep || !!error || flow.isPending,
				variant: 'ghost',
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	// Build sell action
	const sellAction: CtaAction = {
		label: sellStep.label,
		actionName: 'offer acceptance',
		onClick: sellStep.run,
		loading: sellStep.isPending && !showApprovalButton,
		disabled:
			!flow.nextStep || !!error || (showApprovalButton && flow.isPending),
		testid: 'sell-modal-accept-button',
	};

	// Create queries object for ActionModal v2
	// These are already loaded in the context, so we create mock queries that are always successful
	const queries = {
		collection: {
			data: item.collection,
			isLoading: loading.collection,
			isError: false,
			error: null,
		},
		currency: {
			data: offer.currency,
			isLoading: loading.currency,
			isError: false,
			error: null,
		},
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
			queries={queries as any}
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

					{flow.isPending && !feeSelection?.isSelecting && (
						<div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300">
							<div className="h-4 w-4 animate-pulse rounded-full bg-blue-500" />
							{flow.nextStep?.id === 'approve' &&
								'Confirm the token approval in your wallet'}
							{flow.nextStep?.id === 'sell' &&
								'Confirm the offer acceptance in your wallet'}
						</div>
					)}
				</>
			)}
		</ActionModal>
	);
}
