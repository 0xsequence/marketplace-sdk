'use client';

import { ErrorLogBox } from '../../components/_internals/ErrorLogBox';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useCreateListingModalContext } from './internal/context';
import { useCreateListingModal } from './internal/store';

export function CreateListingModal() {
	const { isOpen } = useCreateListingModal();

	if (!isOpen) return null;

	return <Modal />;
}

function Modal() {
	const ctx = useCreateListingModalContext();

	const showApprovalButton =
		ctx.steps.approve && ctx.steps.approve.status === 'idle';

	const ctas = [
		...(showApprovalButton && ctx.steps.approve
			? [
					{
						label: 'Approve Token',
						onClick: ctx.steps.approve.execute,
						pending: ctx.steps.approve.isPending,
						disabled:
							ctx.steps.approve.isDisabled ||
							!ctx.nextStep ||
							!!ctx.error ||
							ctx.isPending,
						variant: 'glass' as const,
						testid: 'create-listing-approve-button',
					},
				]
			: []),
		{
			label: 'Create Listing',
			onClick: ctx.steps.list.execute,
			pending: ctx.steps.list.isPending && !showApprovalButton,
			disabled:
				ctx.steps.list.isDisabled ||
				!ctx.nextStep ||
				!!ctx.error ||
				(showApprovalButton && ctx.isPending),
			testid: 'create-listing-submit-button',
		},
	];

	// Error states
	if ((ctx.error && !ctx.isLoading) || ctx.currencies.available.length === 0) {
		return (
			<ErrorModal
				isOpen={ctx.isOpen}
				chainId={Number(ctx.item.chainId)}
				onClose={ctx.close}
				title="List item for sale"
				message={
					ctx.currencies.available.length === 0
						? 'No currencies configured for this marketplace'
						: undefined
				}
			/>
		);
	}

	return (
		<ActionModal
			isOpen={ctx.isOpen}
			chainId={Number(ctx.item.chainId)}
			onClose={ctx.close}
			title="List item for sale"
			ctas={ctas}
			modalLoading={ctx.isLoading}
			spinnerContainerClassname="h-[220px]"
			hideCtas={ctx.steps.fee?.isSelecting}
		>
			<TokenPreview
				collectionName={ctx.item.collection?.name}
				collectionAddress={ctx.item.collectionAddress}
				collectibleId={ctx.item.tokenId}
				chainId={ctx.item.chainId}
			/>

			{ctx.steps.approve?.invalidated && (
				<div className="mb-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
					<p className="text-sm text-yellow-800 dark:text-yellow-200">
						⚠️ You've changed the listing details. Token approval will need to be
						redone.
					</p>
				</div>
			)}

			<div className="flex w-full flex-col gap-1">
				<PriceInput
					chainId={ctx.item.chainId}
					collectionAddress={ctx.item.collectionAddress}
					price={{
						amountRaw: ctx.listing.price.amountRaw,
						currency: ctx.currencies.selected,
					}}
					availableCurrencies={ctx.currencies.available}
					onPriceChange={(newPrice) => {
						ctx.listing.price.update(newPrice.amountRaw);
					}}
					onCurrencyChange={ctx.currencies.select}
					disabled={ctx.steps.fee?.isSelecting}
					modalType="listing"
				/>

				{ctx.listing.price.amountRaw !== '0' && (
					<FloorPriceText
						tokenId={ctx.item.tokenId}
						chainId={ctx.item.chainId}
						collectionAddress={ctx.item.collectionAddress}
						price={{
							amountRaw: ctx.listing.price.amountRaw,
							currency: ctx.currencies.selected,
						}}
					/>
				)}
			</div>

			{ctx.item.collection?.type === 'ERC1155' && ctx.item.balance && (
				<QuantityInput
					quantity={ctx.listing.quantity.input}
					invalidQuantity={!!ctx.listing.quantity.error}
					onQuantityChange={(quantity) => ctx.listing.quantity.update(quantity)}
					onInvalidQuantityChange={() => {
						// Validation is now automatic - no need to manually set invalid state
					}}
					decimals={ctx.item.collectible?.decimals || 0}
					maxQuantity={ctx.item.balanceWithDecimals.toString()}
					disabled={ctx.steps.fee?.isSelecting}
				/>
			)}

			<ExpirationDateSelect
				date={ctx.listing.expiry.date}
				onDateChange={(date) => {
					// Calculate days from now
					const days = Math.ceil(
						(date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
					);
					ctx.listing.expiry.update(days > 0 ? days : 7);
				}}
				disabled={ctx.steps.fee?.isSelecting}
			/>

			<TransactionDetails
				collectibleId={ctx.item.tokenId}
				collectionAddress={ctx.item.collectionAddress}
				chainId={ctx.item.chainId}
				price={{
					amountRaw: ctx.listing.price.amountRaw,
					currency: ctx.currencies.selected,
				}}
				currencyImageUrl={ctx.currencies.selected.imageUrl}
				includeMarketplaceFee={false}
			/>

			{ctx.steps.fee?.isSelecting && (
				<SelectWaasFeeOptions
					chainId={Number(ctx.item.chainId)}
					onCancel={ctx.steps.fee.cancel}
					titleOnConfirm="Processing listing..."
				/>
			)}

			{ctx.isPending && !ctx.steps.fee?.isSelecting && (
				<div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300">
					<div className="h-4 w-4 animate-pulse rounded-full bg-blue-500" />
					{ctx.nextStep === 'approve' &&
						'Confirm the token approval in your wallet'}
					{ctx.nextStep === 'list' && 'Confirm the listing in your wallet'}
				</div>
			)}

			{ctx.error && (
				<ErrorLogBox
					title="An error occurred while listing"
					message="Please try again"
					error={ctx.error as Error}
				/>
			)}
		</ActionModal>
	);
}
