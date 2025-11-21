import { type Hex, hexToBigInt, isHex, type TypedDataDomain } from 'viem';
import { useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import type { WaasFeeConfirmationState } from '../../../types/waas-types';
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

type ProcessStepParams = {
	step: Step;
	chainId: number;
	waasFeeConfirmation?: WaasFeeConfirmationState;
};

export const useProcessStep = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(config);

	const processStep = async ({
		step,
		chainId,
		waasFeeConfirmation,
	}: ProcessStepParams): Promise<ProcessStepResult> => {
		// Transaction steps - return transaction hash
		if (isTransactionStep(step)) {
			// Wait for WaaS fee confirmation if needed
			if (
				waasFeeConfirmation?.feeOptionConfirmation &&
				!waasFeeConfirmation.optionConfirmed
			) {
				await new Promise<void>((resolve) => {
					const checkConfirmation = () => {
						if (
							waasFeeConfirmation?.selectedOption &&
							waasFeeConfirmation.optionConfirmed
						) {
							// Confirm the fee option
							const confirmationId =
								waasFeeConfirmation.feeOptionConfirmation?.id;
							const currencyAddress =
								waasFeeConfirmation.selectedOption.token.contractAddress ||
								null;

							if (!confirmationId) {
								throw new Error('Fee confirmation ID is missing');
							}

							waasFeeConfirmation.confirmFeeOption(
								confirmationId,
								currencyAddress,
							);
							resolve();
						} else {
							// Check again in next tick
							setTimeout(checkConfirmation, 1000);
						}
					};
					checkConfirmation();
				});
			}

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
					params: {
						chainId: String(chainId),
						signature,
						method: step.post.method,
						endpoint: step.post.endpoint,
						body: step.post.body,
						executeType: ExecuteType.order,
					},
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
