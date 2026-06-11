import {
	type OrderbookKind,
	type BuyStep,
	type Order,
} from '@0xsequence/api-client';
import { buildErc20Approve, dynamic, type Call } from '0xtrails';
import { zeroAddress, type Address } from 'viem';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';

export type TrailsMarketBuyCall = Call;

type BuildTrailsMarketBuyActionsParams = {
	buyStep: BuyStep;
	marketOrder: Order;
};

const isNativeCurrency = (currencyAddress: string) =>
	currencyAddress.toLowerCase() === zeroAddress;

export function buildTrailsMarketBuyActions({
	buyStep,
	marketOrder,
}: BuildTrailsMarketBuyActionsParams): TrailsMarketBuyCall[] {
	const calls: TrailsMarketBuyCall[] = [];
	const currencyAddress = marketOrder.priceCurrencyAddress as Address;
	const isErc20Payment = !isNativeCurrency(currencyAddress);

	if (isErc20Payment) {
		const spenderAddress = getConduitAddressForOrderbook(
			marketOrder.marketplace as unknown as OrderbookKind,
		);

		if (spenderAddress) {
			calls.push(
				buildErc20Approve({
					tokenAddress: currencyAddress,
					spender: spenderAddress,
					amount: dynamic(),
				}),
			);
		}
	}

	const nativeValue = isErc20Payment
		? undefined
		: buyStep.value > 0n
			? buyStep.value
			: marketOrder.priceAmount;

	calls.push({
		to: buyStep.to,
		data: buyStep.data,
		...(nativeValue && nativeValue > 0n ? { value: nativeValue } : {}),
	});

	return calls;
}
