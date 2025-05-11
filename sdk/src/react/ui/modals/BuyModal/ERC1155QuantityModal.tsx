'use client';

import { use$, useObservable } from '@legendapp/state/react';

import { Text, TokenImage } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../consts';
import { compareAddress } from '../../../../utils/address';
import { formatPriceWithFee } from '../../../../utils/price';
import type { Order, StoreType } from '../../../_internal';
import { useCurrency, useMarketplaceConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import QuantityInput from '../_internal/components/quantityInput';
import { buyModalStore, useIsOpen } from './store';

type ERC1155QuantityModalProps = {
	order?: Order;
	storeType: StoreType;
	quantityDecimals?: number;
	quantityRemaining?: string;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	chainId: number;
};

export const ERC1155QuantityModal = ({
	order,
	quantityDecimals,
	quantityRemaining,
	salePrice,
	chainId,
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
				/>
			</div>
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityStr: string;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	chainId: number;
};

const TotalPrice = ({
	order,
	quantityStr,
	salePrice,
	chainId,
}: TotalPriceProps) => {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: order
			? order.priceCurrencyAddress
			: salePrice?.currencyAddress,
	});

	let error: null | string = null;
	let formattedPrice = '0';

	const quantity = BigInt(quantityStr);

	if (isMarket && marketCurrency && order) {
		try {
			const marketplaceFeePercentage =
				marketplaceConfig?.collections.find(
					(collection) =>
						compareAddress(
							collection.address,
							order ? order.collectionContractAddress : 'saleCollectionAddress',
						), // TODO: find a way to get the collection address
				)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
			const quantity = BigInt(quantityStr);
			const totalPriceRaw =
				BigInt(order ? order.priceAmount : salePrice ? salePrice.amount : '0') *
				quantity;

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

	if (isShop && salePrice) {
		const totalPriceRaw = BigInt(salePrice.amountRaw) * quantity;
		formattedPrice = formatPriceWithFee(
			totalPriceRaw,
			salePrice.currency.decimals,
			// Fee percentage isn't included if it's sale contract
			0,
		);
	}

	return error ? (
		<Text className="font-body font-medium text-xs" color="text50">
			{error}
		</Text>
	) : (
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
