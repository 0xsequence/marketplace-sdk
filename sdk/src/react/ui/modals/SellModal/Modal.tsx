'use client';

import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { type SellStep, useSellModalContext } from './internal/context';

export function SellModal() {
	const { item, offer, flow, feeSelection, error, close, isOpen } =
		useSellModalContext();

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	const ctas = [
		...(showApprovalButton
			? [
					{
						label: approvalStep.label,
						onClick: approvalStep.run,
						pending: approvalStep.isPending,
						disabled: !flow.nextStep || !!error || flow.isPending,
						variant: 'glass' as const,
						testid: 'sell-modal-approve-button',
					},
				]
			: []),
		{
			label: sellStep.label,
			onClick: sellStep.run,
			pending: sellStep.isPending && !showApprovalButton,
			disabled:
				!flow.nextStep || !!error || (showApprovalButton && flow.isPending),
			testid: 'sell-modal-accept-button',
		},
	];

	return (
		<ActionModal
			isOpen={isOpen}
			chainId={item.chainId}
			onClose={close}
			title={'You have an offer'}
			ctas={ctas}
			modalLoading={false}
		>
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

			{error && (
				<div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
					<p className="text-sm">{error.message}</p>
				</div>
			)}
		</ActionModal>
	);
}
