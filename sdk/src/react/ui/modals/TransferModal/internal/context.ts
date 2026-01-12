import type { Address } from '@0xsequence/api-client';
import { ContractType } from '@0xsequence/api-client';
import { useCallback, useMemo } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { compareAddress } from '../../../../../utils';
import { TransactionType } from '../../../../_internal';
import {
	useCollectibleBalance,
	useCollectionMetadata,
	useConfig,
	useConnectorMetadata,
	useTransferTokens,
} from '../../../../hooks';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { computeFlowState } from '../../_internal/helpers/flow-state';
import {
	createFeeGuard,
	createFinalTransactionGuard,
} from '../../_internal/helpers/step-guards';
import type {
	ModalContext,
	ModalSteps,
	TransactionStep,
} from '../../_internal/types/steps';
import { useTransferModalState } from './store';

type TransferModalSteps = ModalSteps<'transfer'>;

export type TransferModalContext = ModalContext<
	'transfer',
	TransferModalSteps
> & {
	item: {
		chainId: number;
		collectionAddress: Address;
		tokenId: bigint;
	};
	form: {
		receiver: {
			input: string;
			update: (value: string) => void;
			touch: () => void;
			isTouched: boolean;
			validation: { isValid: boolean; error: string | null };
		};
		quantity: {
			input: bigint;
			update: (value: bigint) => void;
			touch: () => void;
			isTouched: boolean;
			validation: { isValid: boolean; error: string | null };
		};
		isValid: boolean;
		errors: {
			receiver?: string;
			quantity?: string;
			contractType?: string | null;
		};
	};
	queries: {
		collection: ReturnType<typeof useCollectionMetadata>;
		collectibleBalance: ReturnType<typeof useCollectibleBalance>;
	};
	transactions: {
		transfer: string | undefined;
	};
	loading: {
		collection: boolean;
		collectibleBalance: boolean;
	};
	formError: string | undefined;
	actions: {
		transfer: {
			label: string;
			onClick: () => Promise<void>;
			loading: boolean;
			disabled: boolean;
			testid: string;
		};
	};
};

export function useTransferModalContext(): TransferModalContext {
	const state = useTransferModalState();
	const { closeModal } = state;
	const { address } = useAccount();
	const config = useConfig();
	const { isWaaS } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
	});

	const contractType = state.collectionType ?? collectionQuery.data?.type;
	const isErc1155 = contractType === ContractType.ERC1155;
	const isErc721 = contractType === ContractType.ERC721;

	const collectibleBalanceQuery = useCollectibleBalance({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
		userAddress: address ?? undefined,
		query: {
			enabled: !!address && isErc1155,
		},
	});

	const balance =
		collectibleBalanceQuery.data?.balance !== undefined
			? BigInt(collectibleBalanceQuery.data.balance)
			: undefined;

	const receiverValidation = useMemo(() => {
		if (!state.receiverInput || state.receiverInput.trim() === '') {
			return { isValid: false, error: 'Wallet address is required' };
		}
		if (!isAddress(state.receiverInput)) {
			return { isValid: false, error: 'Enter a valid wallet address' };
		}
		if (address && compareAddress(state.receiverInput, address)) {
			return {
				isValid: false,
				error: 'You cannot transfer to your own address',
			};
		}
		return { isValid: true, error: null };
	}, [address, state.receiverInput]);

	const quantityValidation = useMemo(() => {
		if (!isErc1155) {
			return { isValid: true, error: null };
		}
		if (!state.quantityInput || state.quantityInput <= 0n) {
			return { isValid: false, error: 'Quantity is required' };
		}
		if (state.quantityInput <= 0n) {
			return { isValid: false, error: 'Quantity must be greater than 0' };
		}
		if (balance !== undefined && state.quantityInput > balance) {
			return { isValid: false, error: 'Quantity exceeds your balance' };
		}
		return { isValid: true, error: null };
	}, [balance, isErc1155, state.quantityInput, state.quantityInput]);

	const contractTypeError =
		contractType && (isErc1155 || isErc721)
			? null
			: contractType
				? 'Unsupported collection type'
				: null;

	const formIsValid =
		receiverValidation.isValid &&
		quantityValidation.isValid &&
		!contractTypeError;

	const {
		transferTokensAsync,
		hash,
		transferring,
		transferFailed,
		transferSuccess,
		error: transferError,
	} = useTransferTokens();

	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible =
		waas.isVisible ||
		(isWaaS && !isSponsored && !!pendingFeeOptionConfirmation?.options);

	const baseClose = useCallback(() => {
		if (pendingFeeOptionConfirmation?.id) {
			rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		}
		waas.hide();
		closeModal();
	}, [
		closeModal,
		pendingFeeOptionConfirmation?.id,
		rejectPendingFeeOption,
		waas,
	]);

	const steps: TransferModalSteps = {} as TransferModalSteps;

	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;
		steps.fee = {
			label: 'Select Fee',
			status: feeSelected
				? 'success'
				: isFeeSelectionVisible
					? 'selecting'
					: 'idle',
			isSponsored: isSponsored ?? false,
			isSelecting: isFeeSelectionVisible,
			selectedOption: waas.selectedFeeOption,
			show: () => selectWaasFeeOptionsStore.send({ type: 'show' }),
			cancel: () => selectWaasFeeOptionsStore.send({ type: 'hide' }),
		};
	}

	const feeGuard = steps.fee
		? createFeeGuard({ feeSelectionVisible: steps.fee.isSelecting })
		: () => ({ canProceed: true });

	const transferGuard = (): { canProceed: boolean; error?: Error } => {
		if (!address) {
			return {
				canProceed: false,
				error: new Error('Please connect your wallet'),
			};
		}
		if (contractTypeError) {
			return {
				canProceed: false,
				error: new Error(contractTypeError),
			};
		}
		if (!formIsValid) {
			const errorMessage =
				receiverValidation.error ||
				quantityValidation.error ||
				contractTypeError ||
				'Please fix form validation errors';
			return {
				canProceed: false,
				error: new Error(errorMessage),
			};
		}
		const feeCheck = feeGuard();
		if (!feeCheck.canProceed) {
			return feeCheck;
		}
		const txReady =
			!!contractType && (isErc721 || (isErc1155 && state.quantityInput > 0n));
		const finalGuard = createFinalTransactionGuard({
			isFormValid: formIsValid,
			txReady,
			walletConnected: !!address,
			requiresApproval: false,
			approvalComplete: true,
		})();
		if (!finalGuard.canProceed) return finalGuard;
		return { canProceed: true };
	};

	const executeTransfer = useCallback(async () => {
		const guardResult = transferGuard();
		if (!guardResult.canProceed) {
			throw guardResult.error || new Error('Transfer not ready');
		}

		const receiver = state.receiverInput as Address;

		const params = isErc1155
			? {
					receiverAddress: receiver,
					collectionAddress: state.collectionAddress,
					tokenId: state.tokenId,
					chainId: state.chainId,
					contractType: ContractType.ERC1155 as const,
					quantity: state.quantityInput,
				}
			: {
					receiverAddress: receiver,
					collectionAddress: state.collectionAddress,
					tokenId: state.tokenId,
					chainId: state.chainId,
					contractType: ContractType.ERC721 as const,
				};

		const txHash = await transferTokensAsync(params);

		showTransactionStatusModal({
			hash: txHash,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			tokenId: state.tokenId,
			type: TransactionType.TRANSFER,
			queriesToInvalidate: [
				['token', 'balances'],
				['collection', 'balance-details'],
			],
		});

		baseClose();
	}, [
		baseClose,
		isErc1155,
		state.quantityInput,
		showTransactionStatusModal,
		state.chainId,
		state.collectionAddress,
		state.receiverInput,
		state.tokenId,
		transferGuard,
		transferTokensAsync,
	]);

	const transferGuardResult = transferGuard();

	steps.transfer = {
		label: 'Transfer',
		status: transferSuccess
			? 'success'
			: transferring
				? 'pending'
				: transferFailed
					? 'error'
					: 'idle',
		isPending: transferring,
		isSuccess: transferSuccess,
		isDisabled: !transferGuardResult.canProceed,
		disabledReason: transferGuardResult.error?.message ?? null,
		error: transferError ?? null,
		canExecute: transferGuardResult.canProceed,
		result: hash ? { type: 'transaction', hash } : null,
		execute: executeTransfer,
	} as TransactionStep;

	const flow = computeFlowState<'transfer'>(steps);

	const error = collectionQuery.error || collectibleBalanceQuery.error || null;

	return {
		isOpen: state.isOpen,
		close: baseClose,
		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId,
		},
		form: {
			receiver: {
				input: state.receiverInput,
				update: state.updateReceiverInput,
				touch: state.touchReceiverInput,
				isTouched: state.isReceiverTouched,
				validation: receiverValidation,
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				touch: state.touchQuantityInput,
				isTouched: state.isQuantityTouched,
				validation: quantityValidation,
			},
			isValid: formIsValid,
			errors: {
				receiver: state.isReceiverTouched
					? receiverValidation.error || undefined
					: undefined,
				quantity: state.isQuantityTouched
					? quantityValidation.error || undefined
					: undefined,
				contractType: contractTypeError,
			},
		},
		steps,
		flow,
		queries: {
			collection: collectionQuery,
			collectibleBalance: collectibleBalanceQuery,
		},
		loading: {
			collection: collectionQuery.isLoading,
			collectibleBalance: collectibleBalanceQuery.isLoading,
		},
		transactions: {
			transfer: hash,
		},
		error,
		get formError() {
			return (
				this.form.errors.receiver ||
				this.form.errors.quantity ||
				this.form.errors.contractType ||
				this.steps.transfer.disabledReason ||
				undefined
			);
		},
		actions: {
			transfer: {
				label: steps.transfer.label,
				onClick: steps.transfer.execute,
				loading: steps.transfer.isPending,
				disabled: steps.transfer.isDisabled,
				testid: 'transfer-submit-button',
			},
		},
	};
}
