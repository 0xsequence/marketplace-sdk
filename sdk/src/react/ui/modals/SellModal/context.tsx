import { useWaasFeeOptions } from '@0xsequence/connect';
import { useMutation } from '@tanstack/react-query';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { enhanceTransactionError } from '../../../../utils/enhanceTransactionError';
import type { Order, Step } from '../../../_internal';
import {
	balanceQueries,
	collectableKeys,
	type MarketplaceKind,
	StepType,
} from '../../../_internal';
import { useAnalytics } from '../../../_internal/databeat';
import { TransactionType } from '../../../_internal/types';
import {
	useAutoSelectFeeOption,
	useConfig,
	useConnectorMetadata,
	useGenerateSellTransaction,
	useModalData,
	useModalTransaction,
	useProcessStep,
} from '../../../hooks';
import { useCurrencyBalance } from '../../../hooks/data/tokens/useCurrencyBalance';
import { waitForTransactionReceipt } from '../../../utils/waitForTransactionReceipt';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import type { ModalCallbacks } from '../_internal/types';
import { useMarketPlatformFee } from '../BuyModal/hooks/useMarketPlatformFee';

export type FeeMode = 'auto' | 'manual';

export type WaasConfig = {
	feeMode?: FeeMode;
};

export type OpenSellModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: string;
	order: Order;
	waas?: WaasConfig;
	callbacks?: ModalCallbacks;
};

type SellModalState = OpenSellModalArgs & { isOpen: boolean };

const initialContext: SellModalState = {
	isOpen: false as boolean,
	collectionAddress: '' as Address,
	chainId: 0,
	tokenId: '',
	order: null as unknown as Order,
	waas: undefined,
	callbacks: undefined,
};

const sellModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (context, event: OpenSellModalArgs) => ({
			...context,
			isOpen: true,
			...event,
		}),
		close: () => ({ ...initialContext }),
	},
});

export const useSellModal = () => {
	const state = useSelector(sellModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenSellModalArgs) =>
			sellModalStore.send({ type: 'open', ...args }),
		close: () => sellModalStore.send({ type: 'close' }),
	};
};

const useSellModalState = () => {
	const {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		waas,
		callbacks,
	} = useSelector(sellModalStore, (state) => state.context);

	const closeModal = () => sellModalStore.send({ type: 'close' });
	const currencyAddress = order?.priceCurrencyAddress as Address | undefined;

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		waas,
		callbacks,
		closeModal,
		currencyAddress,
	};
};

const useSellTransactionLogic = (
	state: ReturnType<typeof useSellModalState>,
	modalData: ReturnType<typeof useModalData>,
) => {
	const { address } = useAccount();
	const { walletKind, isWaaS } = useConnectorMetadata();
	const analytics = useAnalytics();
	const sdkConfig = useConfig();
	const { processStep } = useProcessStep();

	const { amount: platformFeeAmount, receiver: platformFeeReceiver } =
		useMarketPlatformFee({
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
		});

	const transaction = useModalTransaction({
		chainId: state.chainId,
		transactionType: TransactionType.SELL,
		callbacks: state.callbacks,
		closeModal: state.closeModal,
		queriesToInvalidate: [balanceQueries.all, collectableKeys.userBalances],
		collectionAddress: state.collectionAddress,
		collectibleId: state.tokenId,
	});

	const {
		generateSellTransactionAsync,
		isPending: isGeneratingSteps,
		error: generateError,
	} = useGenerateSellTransaction({ chainId: state.chainId });

	// Step state management
	const [stepsData, setStepsData] = useState<{
		approvalStep?: Step;
		sellStep?: Step;
		allSteps?: Step[];
	} | null>(null);

	// Generate steps mutation - extracts approval and sell steps
	const generateStepsMutation = useMutation({
		mutationFn: async () => {
			if (!address) throw new Error('Wallet not connected');
			if (!state.order) throw new Error('No offer available');
			if (state.order.quantityRemaining === '0')
				throw new Error('Offer is no longer available');

			const ordersData = [
				{
					orderId: state.order.orderId,
					quantity: parseUnits(
						state.order.quantityRemaining || '1',
						modalData.data.collection?.decimals || 0,
					).toString(),
					pricePerToken: state.order.priceAmount,
					currencyAddress: state.order.priceCurrencyAddress,
				},
			];

			const steps = await generateSellTransactionAsync({
				collectionAddress: state.collectionAddress,
				walletType: walletKind,
				marketplace: state.order.marketplace as MarketplaceKind,
				ordersData,
				additionalFees: [
					{ amount: platformFeeAmount, receiver: platformFeeReceiver },
				],
				seller: address,
			});

			if (!steps || steps.length === 0)
				throw new Error('Unable to prepare transaction. Please try again.');

			// Extract steps from single response
			const approvalStep = steps.find(
				(step) => step.id === StepType.tokenApproval,
			);
			const sellStep = steps.find((step) => step.id === StepType.sell);

			if (!sellStep) throw new Error('Sell step not found');

			// Store steps for UI logic
			const extractedSteps = { approvalStep, sellStep, allSteps: steps };
			setStepsData(extractedSteps);
			return extractedSteps;
		},
		onError: (error) => {
			const enhancedError = enhanceTransactionError(error as Error);
			state.callbacks?.onError?.(enhancedError);
		},
	});

	// Separate approval mutation
	const approvalMutation = useMutation({
		mutationFn: async () => {
			if (!stepsData?.approvalStep) {
				throw new Error('No approval step available');
			}

			const result = await processStep(stepsData.approvalStep, state.chainId);

			if (result.type === 'transaction' && result.hash) {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId: state.chainId,
					sdkConfig,
				});
			}

			return result;
		},
		onError: (error) => {
			const enhancedError = enhanceTransactionError(error as Error);
			state.callbacks?.onError?.(enhancedError);
		},
	});

	// Sell execution mutation - only executes sell step
	const executeSellMutation = useMutation({
		mutationFn: async () => {
			if (!stepsData?.sellStep) {
				throw new Error('No sell step available');
			}

			// Execute only the sell step
			const result = await transaction.executeAsync([stepsData.sellStep]);

			if (modalData.data.currency && state.order.priceAmount) {
				analytics.trackSellItems({
					props: {
						marketplaceKind: state.order.marketplace,
						userId: address || '',
						collectionAddress: state.collectionAddress,
						currencyAddress: modalData.data.currency.contractAddress as Address,
						currencySymbol: modalData.data.currency.symbol || '',
						requestId: state.order.orderId,
						tokenId: state.tokenId,
						chainId: state.chainId.toString(),
						txnHash: result.hash || '',
					},
					nums: {
						currencyValueDecimal: Number(
							formatUnits(
								BigInt(state.order.priceAmount),
								modalData.data.currency.decimals || 0,
							),
						),
						currencyValueRaw: Number(state.order.priceAmount),
					},
				});
			}

			return result;
		},
		onError: (error) => {
			const enhancedError = enhanceTransactionError(error as Error);
			state.callbacks?.onError?.(enhancedError);
		},
	});

	// Derived state
	const approvalNeeded = stepsData?.approvalStep != null;
	const approvalCompleted = approvalMutation.isSuccess;
	const canSell = !approvalNeeded || approvalCompleted;

	// Action handlers
	const handleApproval = () => {
		if (isWaaS) selectWaasFeeOptionsStore.send({ type: 'show' });
		approvalMutation.mutate();
	};

	const handleSell = () => {
		if (!stepsData) {
			// First time - generate and extract steps
			generateStepsMutation.mutate();
		} else if (approvalNeeded && !approvalCompleted) {
			// Need approval first
			handleApproval();
		} else {
			// Ready to sell
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: 'show' });
			executeSellMutation.mutate();
		}
	};

	return {
		transaction,
		generateStepsMutation,
		approvalMutation,
		executeSellMutation,
		handleSell,
		handleApproval,
		isGeneratingSteps,
		generateError,
		isWaaS,
		stepsData,
		approvalNeeded,
		approvalCompleted,
		canSell,
	};
};

const useSellValidation = (
	state: ReturnType<typeof useSellModalState>,
	transactionLogic: ReturnType<typeof useSellTransactionLogic>,
	modalData: ReturnType<typeof useModalData>,
) => {
	const isProcessing =
		transactionLogic.transaction.isPending ||
		transactionLogic.generateStepsMutation.isPending ||
		transactionLogic.approvalMutation.isPending ||
		transactionLogic.executeSellMutation.isPending ||
		transactionLogic.isGeneratingSteps;

	const error =
		transactionLogic.transaction.error ||
		transactionLogic.generateStepsMutation.error ||
		transactionLogic.approvalMutation.error ||
		transactionLogic.executeSellMutation.error ||
		transactionLogic.generateError;

	const hasError = modalData.isError || !!error;

	const isOfferValid =
		state.order && state.order.quantityRemaining !== '0' && !modalData.isError;

	const showWaasFeeOptions = transactionLogic.isWaaS && isOfferValid;

	const handleErrorAction = () => {
		transactionLogic.transaction.reset();
		transactionLogic.generateStepsMutation.reset();
		transactionLogic.approvalMutation.reset();
		transactionLogic.executeSellMutation.reset();

		if (useSelectWaasFeeOptionsStore().isVisible) {
			selectWaasFeeOptionsStore.send({ type: 'hide' });
		}

		// Retry the appropriate action based on state
		if (
			transactionLogic.approvalNeeded &&
			!transactionLogic.approvalCompleted
		) {
			transactionLogic.handleApproval();
		} else {
			transactionLogic.handleSell();
		}
	};

	return {
		modalData,
		isProcessing,
		error,
		hasError,
		isOfferValid,
		showWaasFeeOptions,
		handleErrorAction,
	};
};

type FlowStep = {
	name: string;
	status: 'pending' | 'active' | 'completed';
	type: 'generate' | 'selectFee' | 'approve' | 'sell';
};

type NextAction = {
	type: 'generate' | 'selectFee' | 'approve' | 'sell';
	label: string;
	execute: () => void;
	isProcessing: boolean;
};

export type SellModalContext = {
	isOpen: boolean;
	close: () => void;
	item: {
		tokenId: string;
		collectionAddress: Address;
		chainId: number;
		collection?: ReturnType<typeof useModalData>['data']['collection'];
	};
	offer: {
		order: Order;
		currency?: ReturnType<typeof useModalData>['data']['currency'];
		priceAmount: string;
	};
	flow: {
		currentStep: number;
		totalSteps: number;
		nextAction: NextAction;
		steps: FlowStep[];
	};
	feeSelection?: {
		// Read-only state (for displaying fee info)
		isSponsored: boolean;
		isSelecting: boolean;
		isCompleted: boolean;
		selectedOption: FeeOption | undefined;
		options: FeeOption[];

		// Balance info (only present when option is selected)
		balance?: {
			value: bigint;
			formattedValue: string;
			insufficientBalance: boolean;
			isLoading: boolean;
		};

		// Actions (for custom/headless UI)
		select: (option: FeeOption | undefined) => void;
		confirm: () => void;
		cancel: () => void;
	};
	error: Error | null;
	isValid: boolean;
	_internal: {
		transactionLogic: ReturnType<typeof useSellTransactionLogic>;
		validation: ReturnType<typeof useSellValidation>;
	};
};

const deriveFlowState = (
	transactionLogic: ReturnType<typeof useSellTransactionLogic>,
): {
	currentStep: number;
	totalSteps: number;
	nextAction: NextAction;
	steps: FlowStep[];
} => {
	const steps: FlowStep[] = [];
	let currentStep = 0;
	let nextAction: NextAction;

	if (!transactionLogic.stepsData) {
		steps.push({
			name: 'Preparing transaction',
			status: 'active',
			type: 'generate',
		});

		nextAction = {
			type: 'generate',
			label: 'Accept Offer',
			execute: transactionLogic.handleSell,
			isProcessing: transactionLogic.isGeneratingSteps,
		};
	} else if (
		transactionLogic.approvalNeeded &&
		!transactionLogic.approvalCompleted
	) {
		steps.push({
			name: 'Approve NFT',
			status: 'active',
			type: 'approve',
		});
		steps.push({
			name: 'Accept Offer',
			status: 'pending',
			type: 'sell',
		});

		nextAction = {
			type: 'approve',
			label: 'Approve NFT',
			execute: transactionLogic.handleApproval,
			isProcessing: transactionLogic.approvalMutation.isPending,
		};
		currentStep = 0;
	} else {
		if (transactionLogic.approvalNeeded) {
			steps.push({
				name: 'Approve NFT',
				status: 'completed',
				type: 'approve',
			});
			currentStep = 1;
		}

		steps.push({
			name: 'Accept Offer',
			status: 'active',
			type: 'sell',
		});

		nextAction = {
			type: 'sell',
			label: 'Accept Offer',
			execute: transactionLogic.handleSell,
			isProcessing: transactionLogic.executeSellMutation.isPending,
		};
	}

	return {
		currentStep,
		totalSteps: steps.length,
		nextAction,
		steps,
	};
};

export const useSellModalContext = (): SellModalContext => {
	const state = useSellModalState();
	const { address: userAddress } = useAccount();

	const modalData = useModalData({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		currencyAddress: state.currencyAddress,
	});

	const transactionLogic = useSellTransactionLogic(state, modalData);
	const validation = useSellValidation(state, transactionLogic, modalData);

	// WaaS fee selection - simplified for both auto and manual usage
	const waasStore = useSelectWaasFeeOptionsStore();
	const [pendingFeeOptionConfirmation, confirmPendingFeeOption] =
		useWaasFeeOptions();

	// Detect sponsored transactions (no fee required)
	const isSponsored =
		(pendingFeeOptionConfirmation?.options?.length ?? -1) === 0;

	// Auto-select fee option if enabled and not sponsored
	const feeMode: FeeMode = state.waas?.feeMode || 'auto';
	const autoSelectEnabled = feeMode === 'auto' && !isSponsored;

	const autoSelectOptionPromise = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
			? {
					id: pendingFeeOptionConfirmation.id,
					options: pendingFeeOptionConfirmation.options?.map((opt) => ({
						...opt,
						token: {
							...opt.token,
							contractAddress: opt.token.contractAddress || null,
							decimals: opt.token.decimals || 0,
							tokenID: opt.token.tokenID || null,
						},
					})) as FeeOption[] | undefined,
					chainId: state.chainId,
				}
			: {
					id: '',
					options: undefined,
					chainId: state.chainId,
				},
		enabled:
			transactionLogic.isWaaS &&
			autoSelectEnabled &&
			!!pendingFeeOptionConfirmation,
	});

	// Handle auto-selection result
	useEffect(() => {
		if (!autoSelectEnabled || !pendingFeeOptionConfirmation) return;

		autoSelectOptionPromise.then((result) => {
			if (result.isLoading) return;

			if (result.error || !result.selectedOption) {
				// Auto-select failed, show manual selection UI
				waasStore.show();
				return;
			}

			// Auto-select succeeded, confirm and hide UI
			confirmPendingFeeOption(
				pendingFeeOptionConfirmation.id,
				result.selectedOption.token.contractAddress || zeroAddress,
			);
			waasStore.setSelectedFeeOption(result.selectedOption);
		});
	}, [
		autoSelectEnabled,
		autoSelectOptionPromise,
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		waasStore,
	]);

	// Get balance for selected fee option
	const { data: currencyBalance, isLoading: currencyBalanceLoading } =
		useCurrencyBalance({
			chainId: state.chainId,
			currencyAddress: (waasStore.selectedFeeOption?.token.contractAddress ||
				zeroAddress) as Address,
			userAddress: userAddress as Address,
			query: {
				enabled: !!waasStore.selectedFeeOption && !!userAddress,
			},
		});

	// Check if user has sufficient balance
	const insufficientBalance = (() => {
		if (!waasStore.selectedFeeOption?.value) return false;
		if (!currencyBalance?.value && currencyBalance?.value !== 0n) return true;

		try {
			const feeValue = BigInt(waasStore.selectedFeeOption.value);
			return currencyBalance.value < feeValue;
		} catch {
			return true;
		}
	})();

	// Action handlers for manual fee selection
	const handleConfirmFeeOption = () => {
		if (!waasStore.selectedFeeOption || !pendingFeeOptionConfirmation) return;

		confirmPendingFeeOption(
			pendingFeeOptionConfirmation.id,
			waasStore.selectedFeeOption.token.contractAddress || zeroAddress,
		);
		waasStore.hide();
	};

	const handleCancelFeeOption = () => {
		waasStore.hide();
		state.closeModal();
	};

	const flow = deriveFlowState(transactionLogic);

	// Simplified fee selection API - only essential properties
	const feeSelection = transactionLogic.isWaaS
		? {
				// Read-only state (for displaying fee info)
				isSponsored,
				isSelecting: waasStore.isVisible && !isSponsored,
				isCompleted: !!waasStore.selectedFeeOption || isSponsored,
				selectedOption: waasStore.selectedFeeOption,
				options: (pendingFeeOptionConfirmation?.options as FeeOption[]) || [],

				// Balance info (for validation in custom UI)
				balance: waasStore.selectedFeeOption
					? {
							value: currencyBalance?.value || 0n,
							formattedValue: currencyBalance?.value
								? formatUnits(
										currencyBalance.value,
										waasStore.selectedFeeOption.token.decimals || 18,
									)
								: '0',
							insufficientBalance,
							isLoading: currencyBalanceLoading,
						}
					: undefined,

				// Actions (for custom UI)
				select: waasStore.setSelectedFeeOption,
				confirm: handleConfirmFeeOption,
				cancel: handleCancelFeeOption,
			}
		: undefined;

	return {
		isOpen: state.isOpen,
		close: state.closeModal,

		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			collection: modalData.data.collection,
		},

		offer: {
			order: state.order,
			currency: modalData.data.currency,
			priceAmount: state.order?.priceAmount || '0',
		},

		flow,

		feeSelection,

		error: validation.error,
		isValid: validation.isOfferValid,

		_internal: {
			transactionLogic,
			validation,
		},
	};
};
