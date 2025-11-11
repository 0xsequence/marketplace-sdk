import { type Hex, hexToBigInt, isHex, type TypedDataDomain } from 'viem';
import { useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import {
	ExecuteType,
	isSignatureStep,
	isTransactionStep,
	type Step,
	StepType,
} from '../../../types';
import { getMarketplaceClient } from '../../_internal/api';
import { useConfig } from '../config';

type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

export const useProcessStep = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(config);

	const processStep = async (
		step: Step,
		chainId: number,
	): Promise<ProcessStepResult> => {
		// Transaction steps - return transaction hash
		if (isTransactionStep(step)) {
			const hash = await sendTransactionAsync({
				chainId,
				to: step.to as Hex,
				data: step.data as Hex,
				value: step.value,
				...(step.maxFeePerGas && {
					maxFeePerGas: hexToBigInt(step.maxFeePerGas as Hex),
				}),
				...(step.maxPriorityFeePerGas && {
					maxPriorityFeePerGas: hexToBigInt(step.maxPriorityFeePerGas as Hex),
				}),
				...(step.gas && {
					gas: hexToBigInt(step.gas as Hex),
				}),
			});

			return { type: 'transaction', hash };
		}

		// Signature steps - sign and execute API call
		if (isSignatureStep(step)) {
			let signature: Hex | undefined;

			if (step.id === StepType.signEIP191) {
				const message = isHex(step.data)
					? { raw: step.data as Hex }
					: step.data;
				signature = await signMessageAsync({ message });
			} else if (step.id === StepType.signEIP712) {
				if (!step.signature) {
					throw new Error('EIP712 step missing signature data');
				}
				signature = await signTypedDataAsync({
					domain: step.signature.domain as TypedDataDomain,
					types: step.signature.types,
					primaryType: step.signature.primaryType,
					message: step.signature.value,
				});
			}

			if (!signature) {
				throw new Error('Failed to sign message');
			}

			// Call execute endpoint with signature (post is always required for signatures)
			const result = await marketplaceClient.execute({
				params: {
					chainId: chainId.toString(),
					signature,
					method: step.post.method,
					endpoint: step.post.endpoint,
					body: step.post.body,
					executeType: ExecuteType.order,
				},
			});

			return { type: 'signature', orderId: result.orderId };
		}

		// This should never be reached due to discriminated union types
		const _exhaustive: never = step;
		throw new Error(`Unsupported step type: ${(_exhaustive as any).id}`);
	};

	return { processStep };
};
