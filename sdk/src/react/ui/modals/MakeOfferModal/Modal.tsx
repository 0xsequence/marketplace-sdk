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

	const showApproveButton =
		ctx.steps.approval && ctx.steps.approval.status !== 'success';

	const approveAction = showApproveButton
		? {
				label: 'Approve',
				onClick: ctx.steps.approval?.execute || (() => {}),
				loading: ctx.steps.approval?.isPending,
				disabled: ctx.steps.approval?.isDisabled,
				testid: 'make-offer-approve-button',
			}
		: undefined;

	const offerAction = {
		label: 'Make Offer',
		onClick: ctx.steps.offer.execute,
		loading: ctx.steps.offer.isPending,
		disabled: ctx.steps.offer.isDisabled,
		variant: showApproveButton ? ('ghost' as const) : undefined,
		testid: 'make-offer-button',
	};

	return (
		<ActionModal
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title="Make an offer"
			type="offer"
			primaryAction={showApproveButton ? approveAction : offerAction}
			secondaryAction={showApproveButton ? offerAction : undefined}
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
								chainId={ctx.item.chainId}
								collectionAddress={ctx.item.collectionAddress}
								tokenId={ctx.item.tokenId}
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
											ctx.currencies.select(
												newPrice.currency.contractAddress as `0x${string}`,
											);
										}
									}}
									includeNativeCurrency={false}
									orderbookKind={ctx.item.orderbookKind}
									modalType="offer"
									disabled={ctx.flow.isPending}
								/>
							)}

							{collection.type === 'ERC1155' && (
								<QuantityInput
									quantity={ctx.form.quantity.input}
									invalidQuantity={!ctx.form.quantity.validation.isValid}
									onQuantityChange={(quantity) =>
										ctx.form.quantity.update(quantity)
									}
									onInvalidQuantityChange={() => {}}
									decimals={collectible.decimals || 0}
									maxQuantity={String(Number.MAX_SAFE_INTEGER)}
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
										onBuyNow={() => {
											console.log('Buy now clicked');
										}}
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

							{!ctx.form.isValid && (
								<div className="mt-2 text-red-500 text-sm">
									{ctx.form.errors.price ||
										ctx.form.errors.quantity ||
										ctx.form.errors.balance ||
										ctx.form.errors.openseaCriteria}
								</div>
							)}
						</>
					)}
				</>
			)}
		</ActionModal>
	);
};
