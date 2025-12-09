'use client';

import { useSelector } from '@xstate/store/react';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './internal/context';
import { sellModalStore } from './internal/store';

export const SellModal = () => {
	const isOpen = useSelector(sellModalStore, (state) => state.context.isOpen);

	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const ctx = useSellModalContext();

	if (!ctx.isOpen) {
		return null;
	}

	const primaryAction = ctx.steps.fee?.isSelecting
		? undefined
		: (ctx.actions.approve ?? ctx.actions.sell);
	const secondaryAction = ctx.steps.fee?.isSelecting
		? undefined
		: ctx.actions.approve
			? ctx.actions.sell
			: undefined;

	return (
		<ActionModal
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title="You have an offer"
			type="sell"
			primaryAction={primaryAction}
			secondaryAction={secondaryAction}
			queries={{
				collectible: ctx.queries.collectible,
				collection: ctx.queries.collection,
				currency: ctx.queries.currency,
			}}
			externalError={ctx.error}
		>
			{({ collection, currency }) => (
				<>
					<TokenPreview
						collectionName={collection?.name}
						collectionAddress={ctx.item.collectionAddress}
						tokenId={ctx.item.tokenId}
						chainId={ctx.item.chainId}
					/>

					<TransactionHeader
						title="Offer received"
						currencyImageUrl={currency?.imageUrl}
						date={
							ctx.offer.order ? new Date(ctx.offer.order.createdAt) : undefined
						}
					/>

					{currency && (
						<TransactionDetails
							tokenId={ctx.item.tokenId}
							collectionAddress={ctx.item.collectionAddress}
							chainId={ctx.item.chainId}
							includeMarketplaceFee={true}
							price={
								ctx.offer.priceAmount
									? {
											amountRaw: ctx.offer.priceAmount,
											currency,
										}
									: undefined
							}
							currencyImageUrl={currency?.imageUrl}
						/>
					)}

					{ctx.steps.fee?.isSelecting && (
						<SelectWaasFeeOptions
							chainId={ctx.item.chainId}
							onCancel={ctx.steps.fee.cancel}
							titleOnConfirm="Accepting offer..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
};
