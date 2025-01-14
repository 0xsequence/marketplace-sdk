import { ExecuteType, getMarketplaceClient, MarketplaceKind, Step, StepType } from "../_internal";
import { useWallet } from "../_internal/transaction-machine/useWallet";
import { ModalCallbacks } from "../ui/modals/_internal/types";
import { useConfig } from "./useConfig";
import { useGenerateCancelTransaction } from "./useGenerateCancelTransaction";
import { TransactionStep } from "./useCancelOrder";
import { SignatureStep } from "../_internal/transaction-machine/utils";

interface UseCancelTransactionStepsArgs {
	collectionAddress: string;
	chainId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	callbacks?: ModalCallbacks;
	setSteps: React.Dispatch<React.SetStateAction<TransactionStep>>;
	onSuccess?: ({hash, orderId}: {hash?: string, orderId?: string}) => void;
	onError?: (error: Error) => void;
}

export const useCancelTransactionSteps = ({
	collectionAddress,
	chainId,
	marketplace,
	orderId,
	callbacks,
	setSteps,
	onSuccess,
	onError,
}: UseCancelTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { generateCancelTransactionAsync } =
		useGenerateCancelTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getCancelSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateCancelTransactionAsync({
				collectionAddress,
				maker: address,
				marketplace,
				orderId
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
			throw error;
		}
	};

	const cancelOrder = async () => {
		if (!wallet) return;

		try {
			setSteps((prev) => ({
				...prev,
				isExecuting: true,
			}));

			const cancelSteps = await getCancelSteps();
			const transactionStep = cancelSteps?.find((step) => step.id === StepType.cancel);
			const signatureStep = cancelSteps?.find((step) => step.id === StepType.signEIP712);

			console.debug('transactionStep', transactionStep);
			console.debug('signatureStep', signatureStep);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash, orderId: string | undefined;

			if (transactionStep) {
				hash = await executeTransaction({ transactionStep });

				// TODO: use getting receipt hook to check if the transaction is successful

				if (onSuccess && typeof onSuccess === 'function') {
					onSuccess({ hash });
				}

				setSteps((prev) => ({
					...prev,
					isExecuting: false,
				}));
			}

			if (signatureStep) {
				orderId = await executeSignature({ signatureStep });
				
				if (onSuccess && typeof onSuccess === 'function') {
					onSuccess({ orderId });
				}

				setSteps((prev) => ({
					...prev,
					isExecuting: false,
				}));
			}
		} catch (error) {
			setSteps((prev) => ({
				...prev,
				isExecuting: false,
			}));

			if (onError && typeof onError === 'function') {
				onError(error as Error);
			}

			throw error;
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: { transactionStep: Step }) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as any,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: { signatureStep: Step }) => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		const result = await marketplaceClient.execute({
			signature: signature as string,
			executeType: ExecuteType.order,
			body: signatureStep.post?.body,
		});

		return result.orderId;
	};

	return {
		cancelOrder
	};
};
