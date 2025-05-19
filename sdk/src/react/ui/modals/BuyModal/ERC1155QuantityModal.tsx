'use client';

import { use$, useObservable } from '@legendapp/state/react';

import { Text, TokenImage } from '@0xsequence/design-system';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../consts';
import type { Order, Price } from '../../../../types';
import { compareAddress } from '../../../../utils/address';
import { formatPriceWithFee } from '../../../../utils/price';
import { useCurrency, useMarketplaceConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import QuantityInput from '../_internal/components/quantityInput';
import { buyModalStore, useIsOpen } from './store';

type ERC1155QuantityModalProps = {
	order?: Order;
	salesType: 'primary' | 'secondary';
	quantityDecimals?: number;
	quantityRemaining?: string;
	salePrice?: Price;
	chainId: number;
};

export const ERC1155QuantityModal = ({
	order,
	quantityDecimals,
	quantityRemaining,
	salePrice,
	chainId,
	salesType,
}: ERC1155QuantityModalProps) => {
	const isOpen = useIsOpen();

	const localQuantity$ = useObservable('1');
	const localQuantity = use$(localQuantity$);
	const invalidQuantity$ = useObservable(false);
	const invalidQuantity = use$(invalidQuantity$);

	if (quantityDecimals === undefined) {
		throw new Error('quantityDecimals is required');
	}
	if (quantityRemaining === undefined) {
		throw new Error('quantityRemaining is required');
	}

	return (
		<ActionModal
			isOpen={isOpen}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Select Quantity"
			disableAnimation={true}
			ctas={[
				{
					label: 'Buy now',
					onClick: () => {
						buyModalStore.send({
							type: 'setQuantity',
							quantity: Number(localQuantity),
						});
					},
					disabled: invalidQuantity,
				},
			]}
		>
			<div className="flex w-full flex-col gap-4">
				<QuantityInput
					$quantity={localQuantity$}
					$invalidQuantity={invalidQuantity$}
					decimals={quantityDecimals}
					maxQuantity={quantityRemaining}
				/>

				<TotalPrice
					order={order}
					quantityStr={localQuantity}
					salePrice={salePrice}
					chainId={chainId}
					salesType={salesType}
				/>
			</div>
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityStr: string;
	salePrice?: Price;
	chainId: number;
	salesType: 'primary' | 'secondary';
};

const TotalPrice = ({
	order,
	quantityStr,
	salePrice,
	chainId,
	salesType,
}: TotalPriceProps) => {
	const isPrimary = salesType === 'primary';
	const isSecondary = salesType === 'secondary';
	const { data: marketplaceConfig } = useMarketplaceConfig();
	// Currency of sale contract is in salePrice, no need to fetch it
	const { data: marketCurrency, isLoading: isMarketCurrencyLoading } =
		useCurrency({
			chainId,
			currencyAddress: order?.priceCurrencyAddress,
			query: {
				enabled: isPrimary,
			},
		});
	const currency = isPrimary ? salePrice?.currency : marketCurrency;
	console.log(salePrice?.amountRaw);

	let error: null | string = null;
	let formattedPrice = '0';

	const quantity = BigInt(quantityStr);

	if (isSecondary && marketCurrency && order) {
		try {
			const marketplaceFeePercentage =
				marketplaceConfig?.collections.find((collection) =>
					compareAddress(
						collection.address,
						order ? order.collectionContractAddress : '',
					),
				)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
			const totalPriceRaw = BigInt(order.priceAmount) * quantity;

			formattedPrice = formatPriceWithFee(
				totalPriceRaw,
				marketCurrency.decimals,
				marketplaceFeePercentage,
			);
		} catch (e) {
			console.error('Error formatting price', e);
			error = 'Unable to calculate total price';
		}
	}

	if (isPrimary && salePrice) {
		const totalPriceRaw = BigInt(salePrice.amountRaw) * quantity;
		formattedPrice = formatPriceWithFee(
			totalPriceRaw,
			salePrice.currency.decimals,
			// Fee percentage isn't included if it's sale contract
			0,
		);
	}

	if (error) {
		return (
			<Text className="font-body font-medium text-xs" color="text50">
				{error}
			</Text>
		);
	}

	return (
		<div className="flex justify-between">
			<Text className="font-body font-medium text-xs" color="text50">
				Total Price
			</Text>

			<div className="flex items-center gap-0.5">
				{!currency || isMarketCurrencyLoading ? (
					<div className="flex items-center gap-2">
						<Text className="font-body text-text-50 text-xs">Loading...</Text>
					</div>
				) : (
					<>
						{currency?.imageUrl && (
							<TokenImage src={currency.imageUrl} size="xs" />
						)}

						<Text className="font-body font-bold text-text-100 text-xs">
							{formattedPrice}
						</Text>

						<Text className="font-body font-bold text-text-80 text-xs">
							{marketCurrency?.symbol}
						</Text>
					</>
				)}
			</div>
		</div>
	);
};
