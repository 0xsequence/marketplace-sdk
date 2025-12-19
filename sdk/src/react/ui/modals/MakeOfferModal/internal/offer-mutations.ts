import {
	type ContractType,
	type CreateReq,
	type GenerateOfferTransactionRequest,
	OfferType,
	type Step,
	StepType,
} from '@0xsequence/api-client';
import { useMutation } from '@tanstack/react-query';
import { toNumber } from 'dnum';
import type { Address, Hex } from 'viem';
import { encodeFunctionData, maxUint256 } from 'viem';
import { useAccount } from 'wagmi';
import { OrderbookKind } from '../../../../../types';
import { ERC20_ABI } from '../../../../../utils/abi';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';
import { getMarketplaceClient, TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import {
	useConfig,
	useConnectorMetadata,
	useCurrency,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { fromBigIntString } from '../../_internal/helpers/dnum-utils';
import { useMakeOfferModalState } from './store';

export type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

export interface OfferParams {
	tokenId: bigint;
	quantity: bigint;
	expiry: string;
	currencyAddress: Address;
	pricePerToken: bigint;
}

export interface UseOfferMutationsArgs {
	chainId: number;
	collectionAddress: Address;
	contractType: ContractType | undefined;
	orderbookKind: OrderbookKind | undefined;
	offer: OfferParams;
	currencyDecimals: number;
	needsApproval: boolean;
}

export const useOfferMutations = ({
	chainId,
	collectionAddress,
	contractType,
	orderbookKind,
	offer,
	currencyDecimals,
	needsApproval,
}: UseOfferMutationsArgs) => {
	const sdkConfig = useConfig();
	const { address: makerAddress } = useAccount();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useMakeOfferModalState();
	const { processStep } = useProcessStep();
	const { walletKind } = useConnectorMetadata();
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: offer.currencyAddress,
	});

	async function executeStepAndWait(step: Step) {
		const res = await processStep(step, chainId);
		if (res.type === 'transaction' && res.hash) {
			await waitForTransactionReceipt({
				txHash: res.hash,
				chainId,
				sdkConfig,
			});
		}
		return res;
	}

	/**
	 * Generate the approval step on the frontend.
	 * This approves max uint256 for the marketplace contract to spend the user's tokens.
	 */
	function createApprovalStep(): Step {
		const spenderAddress = getConduitAddressForOrderbook(orderbookKind);
		if (!spenderAddress) {
			throw new Error(`Unknown orderbook kind: ${orderbookKind}`);
		}

		const approvalCalldata = encodeFunctionData({
			abi: ERC20_ABI,
			functionName: 'approve',
			args: [spenderAddress, maxUint256],
		});

		return {
			id: StepType.tokenApproval,
			data: approvalCalldata,
			to: offer.currencyAddress,
			value: 0n,
			price: 0n,
		};
	}

	async function generateOfferSteps(): Promise<{ offerStep: Step }> {
		if (!contractType) {
			throw new Error('Contract type is required to generate offer steps');
		}
		if (!makerAddress) {
			throw new Error('Wallet not connected');
		}
		if (!orderbookKind) {
			throw new Error('Orderbook kind is required');
		}

		const marketplaceClient = getMarketplaceClient(sdkConfig);

		const request: GenerateOfferTransactionRequest = {
			chainId,
			collectionAddress,
			maker: makerAddress,
			walletType: walletKind,
			contractType,
			orderbook: orderbookKind,
			offer: {
				tokenId: offer.tokenId,
				quantity: offer.quantity,
				expiry: offer.expiry,
				currencyAddress: offer.currencyAddress,
				pricePerToken: offer.pricePerToken,
			} satisfies CreateReq,
			additionalFees: [],
			offerType: OfferType.item,
		};

		const response = await marketplaceClient.generateOfferTransaction(request);
		const steps = response.steps;

		if (steps.length === 0) {
			throw new Error('No steps generated');
		}

		// Find the offer step (not the approval step - we handle approval separately)
		const offerStep = steps.find((step) => step.id !== StepType.tokenApproval);
		if (!offerStep) {
			throw new Error('No offer step found in response');
		}

		return { offerStep };
	}

	const approve = useMutation({
		mutationFn: async () => {
			const approvalStep = createApprovalStep();
			const result = await executeStepAndWait(approvalStep);

			return result;
		},
	});

	const makeOffer = useMutation({
		mutationFn: async () => {
			// Generate steps via API only when user clicks Make Offer
			const { offerStep } = await generateOfferSteps();

			const res = await executeStepAndWait(offerStep);

			if (currency) {
				const currencyValueRaw = Number(offer.pricePerToken.toString());
				const priceDnum = fromBigIntString(
					offer.pricePerToken.toString(),
					currencyDecimals,
				);
				const currencyValueDecimal = toNumber(priceDnum);

				let requestId: string | undefined;

				if (res.type === 'signature') {
					requestId = res.orderId;
				}

				analytics.trackCreateOffer({
					props: {
						orderbookKind:
							orderbookKind || OrderbookKind.sequence_marketplace_v2,
						collectionAddress,
						currencyAddress: offer.currencyAddress,
						currencySymbol: currency.symbol || '',
						chainId: chainId.toString(),
						requestId: requestId || '',
						txnHash: res.type === 'transaction' ? (res.hash as string) : '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}

			return res;
		},
		onSuccess: (res) => {
			state.closeModal();
			showTxModal({
				type: TransactionType.OFFER,
				chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				collectionAddress,
				tokenId: state.tokenId,
				queriesToInvalidate: [
					['collectible', 'market-highest-offer'],
					['collectible', 'market-list-offers'],
					['collectible', 'market-count-offers'],
				],
			});
		},
	});

	return {
		approve,
		makeOffer,
		needsApproval,
	};
};
