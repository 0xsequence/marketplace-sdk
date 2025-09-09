import { type Hex, hexToBigInt, isHex, type TypedDataDomain } from 'viem';
import { useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import {
	ExecuteType,
	getMarketplaceClient,
	type Step,
	StepType,
} from '../../_internal/api';
import { isSignatureStep, isTransactionStep } from '../../_internal/utils';
import { useConfig } from '../config';

type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

/**
 * Processes individual marketplace steps with automatic type detection
 *
 * This hook provides a unified interface for processing both transaction and signature
 * steps. It automatically detects the step type, executes the appropriate action,
 * and handles API calls for signature-based operations.
 *
 * @returns Step processing interface
 * @returns returns.processStep - Function to process a single step
 *
 * @example
 * Processing transaction steps:
 * ```typescript
 * const { processStep } = useProcessStep();
 *
 * // Process an approval step
 * const result = await processStep(approvalStep, 137);
 * if (result.type === 'transaction') {
 *   console.log('Approval tx hash:', result.hash);
 *   await waitForTransaction(result.hash);
 * }
 * ```
 *
 * @example
 * Processing signature steps:
 * ```typescript
 * const { processStep } = useProcessStep();
 *
 * // Process a signature step (e.g., for gasless listing)
 * const result = await processStep(signatureStep, 1);
 * if (result.type === 'signature') {
 *   console.log('Order created with ID:', result.orderId);
 * }
 * ```
 *
 * @example
 * Processing steps from transaction generation:
 * ```typescript
 * const { processStep } = useProcessStep();
 * const { generateListingTransactionAsync } = useGenerateListingTransaction();
 *
 * // Generate and process listing steps
 * const steps = await generateListingTransactionAsync({ ... });
 *
 * for (const step of steps) {
 *   const result = await processStep(step, chainId);
 *
 *   switch (result.type) {
 *     case 'transaction':
 *       console.log(`${step.id} tx:`, result.hash);
 *       break;
 *     case 'signature':
 *       console.log('Listing created:', result.orderId);
 *       break;
 *   }
 * }
 * ```
 *
 * @remarks
 * - Automatically detects step type (transaction vs signature)
 * - For transaction steps: sends transaction and returns hash
 * - For signature steps: signs message and calls execute API if needed
 * - Supports EIP-191 and EIP-712 signature standards
 * - Handles gas parameters (maxFeePerGas, maxPriorityFeePerGas, gas limit)
 * - The execute API call is made automatically for signature steps with post data
 *
 * @throws {Error} When EIP712 step is missing signature data
 * @throws {Error} When signature fails
 * @throws {Error} When step type is not supported
 *
 * @see {@link isTransactionStep} - Utility to check if step is transaction type
 * @see {@link isSignatureStep} - Utility to check if step is signature type
 * @see {@link ProcessStepResult} - Discriminated union return type
 */
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
				value: hexToBigInt((step.value as Hex) || '0x0'),
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

			// Call execute endpoint with signature
			if (step.post) {
				const result = await marketplaceClient.execute({
					chainId: String(chainId),
					signature,
					method: step.post.method,
					endpoint: step.post.endpoint,
					body: step.post.body,
					executeType: ExecuteType.order,
				});

				return { type: 'signature', orderId: result.orderId };
			}

			// Some signature steps might not have post (edge case)
			return { type: 'signature', signature };
		}

		throw new Error(`Unsupported step type: ${step.id}`);
	};

	return { processStep };
};
