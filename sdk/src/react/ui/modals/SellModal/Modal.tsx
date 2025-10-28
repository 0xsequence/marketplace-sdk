'use client';

import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './internal/context';
import { getModalTitle, getWalletActionMessage } from './internal/utils';

export function SellModal() {
	const context = useSellModalContext();
	const { item, offer, flow, feeSelection, error, close, isOpen } = context;

	const isProcessing = flow.isPending;
	const hasError = !!error;

	const modalTitle = getModalTitle(isProcessing, hasError);

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	const ctas = [
		...(showApprovalButton
			? [
					{
						label: 'Approve NFT',
						onClick: flow.nextStep?.run ?? (() => {}),
						pending: flow.isPending,
						disabled: !flow.nextStep || !!error || flow.isPending,
						variant: 'glass' as const,
						testid: 'sell-modal-approve-button',
					},
				]
			: []),
		{
			label:
				offer.order?.quantityRemaining === '1' ? 'Accept Offer' : 'Accept All',
			onClick: flow.nextStep?.run ?? (() => {}),
			pending: flow.isPending && !showApprovalButton,
			disabled:
				!flow.nextStep || !!error || (showApprovalButton && flow.isPending),
			testid: 'sell-modal-accept-button',
		},
	];

	const walletActionMessage = getWalletActionMessage(
		isProcessing,
		false, // isGeneratingSteps - sellSteps.isLoading is included in flow.isPending
		false, // transaction.isPending not exposed in public context
		flow.nextStep?.id === 'sell' && isProcessing,
		flow.nextStep?.id === 'approve' && isProcessing,
	);

	return (
		<ActionModal
			isOpen={isOpen}
			chainId={item.chainId}
			onClose={close}
			title={modalTitle}
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

			{walletActionMessage && (
				<div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300">
					<div className="h-4 w-4 animate-pulse rounded-full bg-blue-500" />
					{walletActionMessage}
				</div>
			)}

			{feeSelection?.isSponsored && (
				<div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-700 text-sm dark:bg-green-900/20 dark:text-green-300">
					<span className="text-base">✨</span>
					Sponsored Transaction - No fees required
				</div>
			)}

			{feeSelection?.selectedOption &&
				!feeSelection.isSponsored &&
				!feeSelection.isSelecting &&
				feeSelection.balance && (
					<div className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800">
						<span className="text-gray-600 dark:text-gray-400">
							Transaction fee:
						</span>
						<span className="font-medium text-gray-900 dark:text-gray-100">
							{String(feeSelection.balance?.formattedValue ?? '')}{' '}
							{String(feeSelection.selectedOption?.token.symbol ?? '')}
						</span>
					</div>
				)}

			{feeSelection?.isSelecting && (
				<SelectWaasFeeOptions
					chainId={item.chainId}
					onCancel={feeSelection.cancel}
					titleOnConfirm="Accepting offer..."
				/>
			)}

			{error && (
				<div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
					<p className="text-sm">{error.message}</p>
				</div>
			)}
		</ActionModal>
	);
}
