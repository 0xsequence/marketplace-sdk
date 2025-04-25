import { formatUnits } from 'viem';
import type { Address, Hex } from 'viem';
import {
	type MarketplaceKind,
	type Step,
	StepType,
	balanceQueries,
	collectableKeys,
	getMarketplaceClient,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import type {
	SignatureStep,
	TransactionStep,
} from '../../../../_internal/utils';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import {
	useConfig,
	useCurrencies,
	useGenerateSellTransaction,
} from '../../../../hooks';
import { useFees } from '../../BuyModal/hooks/useFees';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
import { sellModalStore } from '../store';

// Import Currency type
import type { Currency } from '../../../../_internal/api/marketplace.gen';

export type ExecutionState = 'approval' | 'sell' | null;

export type SellOrder = {
	orderId: string;
	tokenId: string;
	quantity: string;
	pricePerToken: string;
	currencyAddress: string;
};

interface UseTransactionStepsArgs {
	collectibleId: string;
	chainId: number;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<SellOrder>;
	callbacks?: ModalCallbacks;
}

export const useTransactionSteps = ({
	collectibleId,
	chainId,
	collectionAddress,
	marketplace,
	ordersData,
	callbacks,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const analytics = useAnalytics();

	const { amount, receiver } = useFees({
		chainId,
		collectionAddress,
	});

	const { data: currencies } = useCurrencies({
		chainId,
	});

	const { generateSellTransactionAsync, isPending: generatingSteps } =
		useGenerateSellTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getSellSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			return await generateSellTransactionAsync({
				collectionAddress,
				walletType: wallet.walletKind,
				marketplace,
				ordersData,
				additionalFees: [
					{
						amount,
						receiver,
					},
				],
				seller: address,
			});
		} catch (error) {
			handleError(error);
		}
	};

	const handleError = (error: unknown) => {
		if (callbacks?.onError && typeof callbacks.onError === 'function') {
			callbacks.onError(error as Error);
		} else {
			console.debug('onError callback not provided:', error);
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			const steps = await getSellSteps();
			const approvalStep = steps?.find(
				(step: Step) => step.id === StepType.tokenApproval,
			) as TransactionStep | undefined;

			if (!approvalStep) return;

			const hash = await wallet.handleSendTransactionStep(
				chainId,
				approvalStep,
			);

			await wallet.handleConfirmTransactionStep(hash, chainId);
			return hash;
		} catch (error) {
			handleError(error);
		}
	};

	const executeTransaction = async (
		transactionStep: Step,
	): Promise<Hex | undefined> => {
		if (!wallet) return;

		return await wallet.handleSendTransactionStep(
			chainId,
			transactionStep as TransactionStep,
		);
	};

	const executeSignature = async (
		signatureStep: Step,
	): Promise<string | undefined> => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		if (!signatureStep.post) return;

		const result = await marketplaceClient.execute({
			signature: signature as string,
			method: signatureStep.post.method,
			endpoint: signatureStep.post.endpoint,
			body: signatureStep.post.body,
		});

		return result.orderId;
	};

	const trackSellSuccess = (hash?: Hex, orderId?: string) => {
		if (!hash && !orderId) return;

		const currency = currencies?.find(
			(currency: Currency) =>
				currency.contractAddress === ordersData[0]?.currencyAddress,
		);

		if (!currency || !ordersData[0]) return;

		const currencyDecimal = currency.decimals || 0;
		const currencySymbol = currency.symbol || '';
		const currencyValueRaw = Number(ordersData[0].pricePerToken);
		const currencyValueDecimal = Number(
			formatUnits(BigInt(currencyValueRaw), currencyDecimal),
		);

		analytics.trackSellItems({
			props: {
				marketplaceKind: marketplace,
				collectionAddress,
				currencyAddress: ordersData[0].currencyAddress,
				currencySymbol,
				chainId: chainId.toString(),
				txnHash: hash || '',
			},
			nums: {
				currencyValueDecimal,
				currencyValueRaw,
			},
		});
	};

	const sell = async (): Promise<void> => {
		if (!wallet) return;

		try {
			const steps = await getSellSteps();
			if (!steps) return;

			const transactionStep = steps.find(
				(step: Step) => step.id === StepType.sell,
			);
			const signatureStep = steps.find(
				(step: Step) => step.id === StepType.signEIP712,
			);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash: Hex | undefined;
			let orderId: string | undefined;

			if (transactionStep) {
				hash = await executeTransaction(transactionStep);
			}

			if (signatureStep) {
				orderId = await executeSignature(signatureStep);
			}

			sellModalStore.send({ type: 'close' });

			showTransactionStatusModal({
				type: TransactionType.SELL,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [balanceQueries.all, collectableKeys.userBalances],
			});

			if (hash) {
				await wallet.handleConfirmTransactionStep(hash, chainId);
			}

			trackSellSuccess(hash, orderId);
		} catch (error) {
			handleError(error);
		}
	};

	return {
		generatingSteps,
		executeApproval,
		sell,
	};
};
