import {
	type ApprovalStep,
	type BuyStep,
	ContractType,
	MarketplaceKind,
	type Order,
	type OrderbookKind,
} from '@0xsequence/api-client';
import { buildErc20Approve, type Call, self } from '0xtrails';
import { type Address, encodeFunctionData, zeroAddress } from 'viem';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';
import { normalizeMarketplaceKind } from '../../../../../utils/normalizeMarketplace';
import { OPENSEA_CHAIN_CURRENCIES } from '../../_internal/constants/opensea-currencies';

export type TrailsMarketBuyCall = Call;

export type TrailsMarketBuyActions = {
	calls: TrailsMarketBuyCall[];
	paymentTokenAddress: Address;
	paymentAmount: bigint;
};

type BuildTrailsMarketBuyActionsParams = {
	chainId: number;
	buyStep: BuyStep;
	marketOrder: Order;
	contractType: ContractType.ERC721 | ContractType.ERC1155;
	recipientAddress: Address;
	approvalStep?: ApprovalStep;
	quantity?: bigint;
};

const WETH_ABI = [
	{
		type: 'function',
		name: 'withdraw',
		stateMutability: 'nonpayable',
		inputs: [{ name: 'wad', type: 'uint256' }],
		outputs: [],
	},
] as const;

const ERC721_TRANSFER_FROM_ABI = [
	{
		type: 'function',
		name: 'transferFrom',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'tokenId', type: 'uint256' },
		],
		outputs: [],
	},
] as const;

const ERC1155_SAFE_TRANSFER_FROM_ABI = [
	{
		type: 'function',
		name: 'safeTransferFrom',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'id', type: 'uint256' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'data', type: 'bytes' },
		],
		outputs: [],
	},
] as const;

const OPENSEA_FULFILL_WITHOUT_RECIPIENT_SELECTORS = new Set([
	'0xfb0f3ee1', // fulfillBasicOrder(...)
	'0xb1b747c3', // fulfillOrder(...)
]);

const isNativeCurrency = (currencyAddress: string) =>
	currencyAddress.toLowerCase() === zeroAddress;

const getPaymentAmount = ({
	buyStep,
	marketOrder,
	isErc20Payment,
}: {
	buyStep: BuyStep;
	marketOrder: Order;
	isErc20Payment: boolean;
}) => {
	if (isErc20Payment) {
		return buyStep.price > 0n ? buyStep.price : marketOrder.priceAmount;
	}

	if (buyStep.value > 0n) {
		return buyStep.value;
	}

	return buyStep.price > 0n ? buyStep.price : marketOrder.priceAmount;
};

const getWrappedNativeCurrencyAddress = (chainId: number) =>
	OPENSEA_CHAIN_CURRENCIES[chainId.toString()]?.wrappedNativeCurrency.address as
		| Address
		| undefined;

const buildWrappedNativeWithdrawCall = ({
	wrappedNativeAddress,
	amount,
}: {
	wrappedNativeAddress: Address;
	amount: bigint;
}): TrailsMarketBuyCall => ({
	to: wrappedNativeAddress,
	data: encodeFunctionData({
		abi: WETH_ABI,
		functionName: 'withdraw',
		args: [amount],
	}),
});

const isOpenSeaFulfillWithoutRecipient = (calldata: `0x${string}`) =>
	OPENSEA_FULFILL_WITHOUT_RECIPIENT_SELECTORS.has(
		calldata.slice(0, 10).toLowerCase(),
	);

const buildOpenSeaNftTransferCall = ({
	marketOrder,
	contractType,
	recipientAddress,
	quantity,
}: {
	marketOrder: Order;
	contractType: ContractType.ERC721 | ContractType.ERC1155;
	recipientAddress: Address;
	quantity: bigint;
}): TrailsMarketBuyCall | undefined => {
	if (marketOrder.tokenId === undefined) {
		return undefined;
	}

	const collectionAddress = marketOrder.collectionContractAddress as Address;
	const executorAddress = self() as Address;

	if (contractType === ContractType.ERC1155) {
		return {
			to: collectionAddress,
			data: encodeFunctionData({
				abi: ERC1155_SAFE_TRANSFER_FROM_ABI,
				functionName: 'safeTransferFrom',
				args: [
					executorAddress,
					recipientAddress,
					marketOrder.tokenId,
					quantity,
					'0x',
				],
			}),
		};
	}

	return {
		to: collectionAddress,
		data: encodeFunctionData({
			abi: ERC721_TRANSFER_FROM_ABI,
			functionName: 'transferFrom',
			args: [executorAddress, recipientAddress, marketOrder.tokenId],
		}),
	};
};

export function buildTrailsMarketBuyActions({
	chainId,
	buyStep,
	marketOrder,
	contractType,
	recipientAddress,
	approvalStep,
	quantity = 1n,
}: BuildTrailsMarketBuyActionsParams): TrailsMarketBuyActions | undefined {
	const calls: TrailsMarketBuyCall[] = [];
	const currencyAddress = marketOrder.priceCurrencyAddress as Address;
	const isErc20Payment = !isNativeCurrency(currencyAddress);
	const paymentAmount = getPaymentAmount({
		buyStep,
		marketOrder,
		isErc20Payment,
	});
	let paymentTokenAddress = currencyAddress;

	if (isErc20Payment && paymentAmount > 0n) {
		if (approvalStep) {
			calls.push({
				to: approvalStep.to,
				data: approvalStep.data,
			});
		} else {
			const spenderAddress = getConduitAddressForOrderbook(
				marketOrder.marketplace as unknown as OrderbookKind,
			);

			if (spenderAddress) {
				calls.push(
					buildErc20Approve({
						tokenAddress: currencyAddress,
						spender: spenderAddress,
						amount: paymentAmount,
					}),
				);
			}
		}
	} else if (!isErc20Payment) {
		const wrappedNativeAddress = getWrappedNativeCurrencyAddress(chainId);
		if (!wrappedNativeAddress) {
			return undefined;
		}

		paymentTokenAddress = wrappedNativeAddress;
		if (paymentAmount > 0n) {
			calls.push(
				buildWrappedNativeWithdrawCall({
					wrappedNativeAddress,
					amount: paymentAmount,
				}),
			);
		}
	}

	calls.push({
		to: buyStep.to,
		data: buyStep.data,
		...(!isErc20Payment && paymentAmount > 0n
			? { value: paymentAmount, sweepTokens: [zeroAddress] }
			: {}),
	});

	const isOpenSeaOrder =
		normalizeMarketplaceKind(marketOrder.marketplace) ===
		MarketplaceKind.opensea;
	if (isOpenSeaOrder && isOpenSeaFulfillWithoutRecipient(buyStep.data)) {
		const nftTransferCall = buildOpenSeaNftTransferCall({
			marketOrder,
			contractType,
			recipientAddress,
			quantity,
		});

		if (nftTransferCall) {
			calls.push(nftTransferCall);
		}
	}

	return {
		calls,
		paymentTokenAddress,
		paymentAmount,
	};
}
