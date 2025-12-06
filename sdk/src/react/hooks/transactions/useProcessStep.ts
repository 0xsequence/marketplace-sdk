import { type Hex, isHex } from 'viem';
import { useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import {
	ExecuteType,
	isTransactionStep,
	type Step,
	StepType,
} from '../../_internal';
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
				to: step.to,
				data: step.data,
				value: step.value,
			});

			return { type: 'transaction', hash };
		}

		// EIP-191 Signature - plain text or hex message
		if (step.id === StepType.signEIP191) {
			const data = step.data;
			const message = isHex(data) ? ({ raw: data } as const) : data;
			const signature = await signMessageAsync({ message });

			// Call execute endpoint with signature
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

		// EIP-712 Typed Data Signature
		if (step.id === StepType.signEIP712) {
			// TypeScript can't narrow discriminated unions with complex types
			// so we manually assert that signature is defined for EIP-712
			if (!step.signature) {
				throw new Error('EIP-712 step missing signature data');
			}

			const signature = await signTypedDataAsync({
				domain: step.signature.domain,
				types: step.signature.types,
				primaryType: step.signature.primaryType,
				message: step.signature.value,
			});

			// Call execute endpoint with signature
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

		// This should never be reached
		throw new Error(`Unsupported step type: ${(step as Step).id}`);
	};

	return { processStep };
};
