'use client';

import type { Currency } from '@0xsequence/api-client';
import { useSelector } from '@xstate/store/react';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useCreateListingModalContext } from './internal/context';
import { createListingModalStore } from './internal/store';

export const CreateListingModal = () => {
	const isOpen = useSelector(
		createListingModalStore,
		(state) => state.context.isOpen,
	);
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const ctx = useCreateListingModalContext();

	if (!ctx.isOpen) {
		return null;
	}

	return (
		<ActionModal
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title="List item for sale"
			type="listing"
			primaryAction={
				ctx.steps.fee?.isSelecting
					? undefined
					: (ctx.actions.approve ?? ctx.actions.listing)
			}
			secondaryAction={
				ctx.steps.fee?.isSelecting
					? undefined
					: ctx.actions.approve
						? ctx.actions.listing
						: undefined
			}
			queries={{
				collectible: ctx.queries.collectible,
				collection: ctx.queries.collection,
				currencies: ctx.queries.currencies,
				collectibleBalance: ctx.queries.collectibleBalance,
			}}
			externalError={ctx.error}
		>
			{({ collectible, collection, currencies, collectibleBalance }) => (
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
								collectionName={collection?.name}
								collectionAddress={ctx.item.collectionAddress}
								tokenId={ctx.item.tokenId}
								chainId={ctx.item.chainId}
							/>

							{ctx.listing.price.currency && (
								<PriceInput
									chainId={ctx.item.chainId}
									collectionAddress={ctx.item.collectionAddress}
									price={{
										amountRaw: ctx.listing.price.amountRaw,
										currency: ctx.listing.price.currency,
									}}
									onPriceChange={(newPrice) => {
										ctx.form.price.update(newPrice.amountRaw.toString());
										if (newPrice.currency) {
											ctx.currencies.select(
												newPrice.currency.contractAddress as `0x${string}`,
											);
										}
									}}
									onCurrencyChange={(newCurrency) => {
										ctx.currencies.select(
											newCurrency.contractAddress as `0x${string}`,
										);
									}}
									includeNativeCurrency={true}
									orderbookKind={ctx.item.orderbookKind}
									modalType="listing"
									disabled={ctx.flow.isPending}
								/>
							)}

							{ctx.form.isValid && ctx.listing.price.currency && (
								<FloorPriceText
									tokenId={ctx.item.tokenId}
									chainId={ctx.item.chainId}
									collectionAddress={ctx.item.collectionAddress}
									price={{
										amountRaw: ctx.listing.price.amountRaw,
										currency: ctx.listing.price.currency,
									}}
								/>
							)}

							{collection?.type === 'ERC1155' &&
								collectibleBalance?.balance && (
									<QuantityInput
										quantity={ctx.listing.quantity.parsed}
										invalidQuantity={!ctx.form.quantity.validation.isValid}
										onQuantityChange={(quantity) =>
											ctx.form.quantity.update(quantity.toString())
										}
										onInvalidQuantityChange={() => {}}
										maxQuantity={BigInt(collectibleBalance.balance)}
										disabled={ctx.flow.isPending}
									/>
								)}

							<ExpirationDateSelect
								date={ctx.listing.expiry}
								onDateChange={(date) => {
									const days = Math.ceil(
										(date.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
									);
									ctx.form.expiry.update(days);
								}}
								disabled={ctx.flow.isPending}
							/>

							<TransactionDetails
								tokenId={ctx.item.tokenId}
								collectionAddress={ctx.item.collectionAddress}
								chainId={ctx.item.chainId}
								price={{
									amountRaw: ctx.listing.price.amountRaw,
									currency: ctx.listing.price.currency as Currency,
								}}
								currencyImageUrl={ctx.listing.price.currency?.imageUrl}
								includeMarketplaceFee={false}
							/>

							{ctx.steps.fee?.isSelecting && (
								<SelectWaasFeeOptions
									chainId={ctx.item.chainId}
									onCancel={ctx.steps.fee.cancel}
									titleOnConfirm="Creating listing..."
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
