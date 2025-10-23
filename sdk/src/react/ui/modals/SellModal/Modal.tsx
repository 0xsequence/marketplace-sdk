'use client';

import type { Address } from 'viem';
import { useCollection } from '../../../hooks/data/collections';
import { useCurrency } from '../../../hooks/data/market';
import { ActionModal } from '../_internal/components/baseModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './context';
import { getModalTitle, getWalletActionMessage } from './utils';

export function SellModal() {
	const context = useSellModalContext();
	const { item, offer, flow, feeSelection, error, isValid, close, _internal } =
		context;
	const { transactionLogic } = _internal;

	const isProcessing = flow.nextAction.isProcessing;
	const hasError = !!error;

	const modalTitle = getModalTitle(isProcessing, hasError);
	const walletActionMessage = getWalletActionMessage(
		isProcessing,
		transactionLogic.isGeneratingSteps,
		transactionLogic.transaction.isPending,
		transactionLogic.executeSellMutation.isPending,
		transactionLogic.approvalMutation.isPending,
	);

	const collectionQuery = useCollection({
		chainId: item.chainId,
		collectionAddress: item.collectionAddress,
	});

	const currencyQuery = useCurrency({
		chainId: item.chainId,
		currencyAddress: offer.order.priceCurrencyAddress as Address,
	});

	const approvalStep = flow.steps.find((s) => s.type === 'approve');
	const showApprovalButton = approvalStep && approvalStep.status === 'active';

	const secondaryAction = showApprovalButton
		? {
				label: 'Approve NFT',
				onClick: flow.nextAction.execute,
				loading: flow.nextAction.isProcessing,
				disabled: !isValid || isProcessing,
				variant: 'ghost' as const,
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	const primaryAction = {
		label:
			offer.order.quantityRemaining === '1' ? 'Accept Offer' : 'Accept All',
		onClick: flow.nextAction.execute,
		loading: isProcessing && !showApprovalButton,
		disabled: !isValid || (showApprovalButton && isProcessing),
		testid: 'sell-modal-accept-button',
	};

	return (
		<ActionModal
			queries={{
				collection: collectionQuery,
				currency: currencyQuery,
			}}
			chainId={item.chainId}
			onClose={close}
			title={modalTitle}
			primaryAction={primaryAction}
			secondaryAction={secondaryAction}
		>
			{({ currency, collection }) => (
				<>
					<TransactionHeader
						title="Offer received"
						currencyImageUrl={currency.imageUrl}
						date={new Date(offer.order.createdAt)}
					/>

					<TokenPreview
						collectionName={collection.name}
						collectionAddress={item.collectionAddress}
						collectibleId={item.tokenId}
						chainId={item.chainId}
					/>

					<TransactionDetails
						collectibleId={item.tokenId}
						collectionAddress={item.collectionAddress}
						chainId={item.chainId}
						includeMarketplaceFee={true}
						price={{
							amountRaw: offer.priceAmount,
							currency: currency,
						}}
						currencyImageUrl={currency.imageUrl}
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
									{feeSelection.balance.formattedValue}{' '}
									{feeSelection.selectedOption.token.symbol}
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
				</>
			)}
		</ActionModal>
	);
}
