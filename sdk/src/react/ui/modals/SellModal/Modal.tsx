'use client';

import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './internal/context';

export function SellModal() {
	const ctx = useSellModalContext();

	const showApprovalButton =
		ctx.steps.approve && ctx.steps.approve.status === 'idle';

	const ctas = [
		...(showApprovalButton
			? [
					{
						label: 'Approve Token',
						onClick: ctx.steps.approve?.execute,
						pending: ctx.steps.approve?.isPending,
						disabled:
							!ctx.steps.approve?.canExecute || !!ctx.error || ctx.isPending,
						variant: 'glass' as const,
						testid: 'sell-modal-approve-button',
					},
				]
			: []),
		{
			label: 'Accept Offer',
			onClick: ctx.steps.sell.execute,
			pending: ctx.steps.sell.isPending && !showApprovalButton,
			disabled:
				!ctx.steps.sell.canExecute ||
				!!ctx.error ||
				(showApprovalButton && ctx.isPending),
			testid: 'sell-modal-accept-button',
		},
	];

	return (
		<ActionModal
			isOpen={ctx.isOpen}
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title={'You have an offer'}
			ctas={ctas}
			modalLoading={false}
		>
			<TransactionHeader
				title="Offer received"
				currencyImageUrl={ctx.offer.currency?.imageUrl}
				date={ctx.offer.order && new Date(ctx.offer.order.createdAt)}
			/>

			<TokenPreview
				collectionName={ctx.item.collection?.name}
				collectionAddress={ctx.item.collectionAddress}
				collectibleId={ctx.item.tokenId}
				chainId={ctx.item.chainId}
			/>

			<TransactionDetails
				collectibleId={ctx.item.tokenId}
				collectionAddress={ctx.item.collectionAddress}
				chainId={ctx.item.chainId}
				includeMarketplaceFee={true}
				price={
					ctx.offer.currency
						? {
								amountRaw: ctx.offer.priceAmount,
								currency: ctx.offer.currency,
							}
						: undefined
				}
				currencyImageUrl={ctx.offer.currency?.imageUrl}
			/>

			{ctx.feeSelection?.isSelecting && (
				<SelectWaasFeeOptions
					chainId={ctx.item.chainId}
					onCancel={ctx.feeSelection.cancel}
					titleOnConfirm="Accepting offer..."
				/>
			)}

			{ctx.isPending && !ctx.feeSelection?.isSelecting && (
				<div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300">
					<div className="h-4 w-4 animate-pulse rounded-full bg-blue-500" />
					{ctx.nextStep === 'approve' &&
						'Confirm the token approval in your wallet'}
					{ctx.nextStep === 'sell' &&
						'Confirm the offer acceptance in your wallet'}
				</div>
			)}

			{ctx.error && (
				<div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
					<p className="text-sm">{ctx.error.message}</p>
				</div>
			)}
		</ActionModal>
	);
}
