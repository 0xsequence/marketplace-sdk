'use client';

import { useSelector } from '@xstate/store/react';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import { useMakeOfferModalContext } from './internal/context';
import { makeOfferModalStore } from './internal/store';

export const MakeOfferModal = () => {
	const isOpen = useSelector(
		makeOfferModalStore,
		(state) => state.context.isOpen,
	);
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const ctx = useMakeOfferModalContext();

	if (!ctx.isOpen) {
		return null;
	}

	return (
		<ActionModal
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title="Make an offer"
			type="offer"
			primaryAction={
				ctx.steps.fee?.isSelecting
					? undefined
					: (ctx.actions.approve ?? ctx.actions.offer)
			}
			secondaryAction={
				ctx.steps.fee?.isSelecting
					? undefined
					: ctx.actions.approve
						? ctx.actions.offer
						: undefined
			}
			queries={{
				collectible: ctx.queries.collectible,
				collection: ctx.queries.collection,
				currencies: ctx.queries.currencies,
			}}
			externalError={ctx.error}
		>
			{({ collectible, collection, currencies }) => (
				<>
					{currencies.length === 0 && (
						<div className="text-center text-gray-400">
							No ERC-20s are configured for the marketplace, contact the
							marketplace owners
						</div>
					)}

					{currencies.length > 0 && (
						<>
							<TokenPreview
								chainId={collection.chainId}
								collectionAddress={collection.address}
								tokenId={collectible?.tokenId}
								collectionName={collection.name}
							/>

							{ctx.offer.price.currency && (
								<PriceInput
									chainId={ctx.item.chainId}
									collectionAddress={ctx.item.collectionAddress}
									price={{
										amountRaw: ctx.offer.price.amountRaw,
										currency: ctx.offer.price.currency,
									}}
									onPriceChange={(newPrice) => {
										ctx.form.price.update(newPrice.amountRaw.toString());
										if (newPrice.currency) {
											ctx.currencies.select(newPrice.currency.contractAddress);
										}
									}}
									onCurrencyChange={(newCurrency) => {
										ctx.currencies.select(newCurrency.contractAddress);
									}}
									includeNativeCurrency={false}
									orderbookKind={ctx.item.orderbookKind}
									modalType="offer"
									disabled={ctx.flow.isPending}
								/>
							)}

							{collection.type === 'ERC1155' && (
								<QuantityInput
									quantity={ctx.offer.quantity.parsed}
									invalidQuantity={!ctx.form.quantity.validation.isValid}
									onQuantityChange={(quantity) =>
										ctx.form.quantity.update(quantity.toString())
									}
									onInvalidQuantityChange={() => {}}
									maxQuantity={BigInt(Number.MAX_SAFE_INTEGER)}
									disabled={ctx.flow.isPending}
								/>
							)}

							{ctx.form.isValid &&
								!ctx.form.errors.balance &&
								ctx.offer.price.currency && (
									<FloorPriceText
										tokenId={ctx.item.tokenId}
										chainId={ctx.item.chainId}
										collectionAddress={ctx.item.collectionAddress}
										price={{
											amountRaw: ctx.offer.price.amountRaw,
											currency: ctx.offer.price.currency,
										}}
										onBuyNow={() => {}}
									/>
								)}

							<ExpirationDateSelect
								date={ctx.offer.expiry}
								onDateChange={(date) => {
									const days = Math.ceil(
										(date.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
									);
									ctx.form.expiry.update(days);
								}}
								disabled={ctx.flow.isPending}
							/>

							{ctx.steps.fee?.isSelecting && (
								<SelectWaasFeeOptions
									chainId={ctx.item.chainId}
									onCancel={ctx.steps.fee.cancel}
									titleOnConfirm="Creating offer..."
								/>
							)}

							{ctx.formError && (
								<div className="mt-2 text-red-500 text-sm">{ctx.formError}</div>
							)}
						</>
					)}
				</>
			)}
		</ActionModal>
	);
};
