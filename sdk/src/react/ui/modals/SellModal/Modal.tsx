'use client';

import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSellModalContext } from './internal/context';

export function SellModal() {
	const ctx = useSellModalContext();

	if (!ctx.isOpen) {
		return null;
	}

	const primaryAction = ctx.actions.approve ?? ctx.actions.sell;
	const secondaryAction = ctx.actions.approve ? ctx.actions.sell : undefined;

	return (
		<ActionModal
			chainId={ctx.chainId}
			onClose={() => {
				ctx.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
			title="You have an offer"
			type="sell"
			primaryAction={primaryAction}
			secondaryAction={secondaryAction}
			queries={ctx.queries}
			externalError={ctx.error}
		>
			{({ collection, currency }) => (
				<>
					<TransactionHeader
						title="Offer received"
						currencyImageUrl={currency?.imageUrl}
						date={
							ctx.offer.order ? new Date(ctx.offer.order.createdAt) : undefined
						}
					/>

					<TokenPreview
						collectionName={collection.name}
						collectionAddress={ctx.collectionAddress}
						tokenId={ctx.tokenId}
						chainId={ctx.chainId}
					/>

					<TransactionDetails
						tokenId={ctx.tokenId}
						collectionAddress={ctx.collectionAddress}
						chainId={ctx.chainId}
						includeMarketplaceFee={true}
						price={
							ctx.offer.priceAmount
								? {
										amountRaw: ctx.offer.priceAmount,
										currency,
									}
								: undefined
						}
						currencyImageUrl={currency.imageUrl}
					/>

					{ctx.steps.fee?.isSelecting && (
						<SelectWaasFeeOptions
							chainId={ctx.chainId}
							onCancel={ctx.steps.fee.cancel}
							titleOnConfirm="Accepting offer..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
}
