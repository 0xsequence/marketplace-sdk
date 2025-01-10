import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';
import type { Chain, Hash, Hex } from 'viem';
import { avalanche, optimism } from 'viem/chains';
import {
	type AdditionalFee,
	type SequenceMarketplace,
	TransactionSwapProvider,
	WebrpcError,
	getMarketplaceClient,
} from '..';
import {
	type ContractType,
	type CreateReq,
	ExecuteType,
	type MarketplaceConfig,
	type MarketplaceKind,
	OrderbookKind,
	type SdkConfig,
	type Step,
	StepType,
} from '../../../types';
import {
	ChainSwitchError,
	CheckoutOptionsError,
	InvalidSignatureStepError,
	MissingSignatureDataError,
	MissingStepDataError,
	NoExecutionStepError,
	NoStepsFoundError,
	OrderNotFoundError,
	OrdersFetchError,
	PaymentModalError,
	PaymentModalTransactionError,
	StepExecutionError,
	StepGenerationError,
	TransactionError,
	TransactionReceiptError,
	UnexpectedStepsError,
	UnknownTransactionTypeError,
} from '../../../utils/_internal/error/transaction';
import { type TransactionLogger, createLogger } from './logger';
import type {
	SignatureStep,
	TransactionStep as StepForTransaction,
} from './utils';
import type { WalletInstance } from './wallet';

export enum TransactionState {
	IDLE = 'IDLE',
	SWITCH_CHAIN = 'SWITCH_CHAIN',
	CHECKING_STEPS = 'CHECKING_STEPS',
	TOKEN_APPROVAL = 'TOKEN_APPROVAL',
	EXECUTING_TRANSACTION = 'EXECUTING_TRANSACTION',
	CONFIRMING = 'CONFIRMING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	OFFER = 'OFFER',
	TRANSFER = 'TRANSFER',
	CANCEL = 'CANCEL',
}

export interface TransactionConfig {
	type: TransactionType;
	chainId: string;
	chains: readonly Chain[];
	collectionAddress: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	orderbookKind?: OrderbookKind;
}

interface StateConfig {
	config: TransactionConfig;
	onTransactionSent?: (hash?: Hash, orderId?: string) => void;
	onSuccess?: (hash: Hash) => void;
	onApprovalSuccess?: (hash: Hash) => void;
}

export interface BuyInput {
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
}

export interface SellInput {
	orderId: string;
	marketplace: MarketplaceKind;
	quantity?: string;
}

export interface ListingInput {
	contractType: ContractType;
	listing: CreateReq;
}

export interface OfferInput {
	contractType: ContractType;
	offer: CreateReq;
}

export interface CancelInput {
	orderId: string;
	marketplace: MarketplaceKind;
}

export type Input =
	| BuyInput
	| SellInput
	| ListingInput
	| OfferInput
	| CancelInput;

type TransactionInput =
	| {
			type: TransactionType.BUY;
			props: BuyInput;
	  }
	| {
			type: TransactionType.SELL;
			props: SellInput;
	  }
	| {
			type: TransactionType.LISTING;
			props: ListingInput;
	  }
	| {
			type: TransactionType.OFFER;
			props: OfferInput;
	  }
	| {
			type: TransactionType.CANCEL;
			props: CancelInput;
	  };

export interface TransactionStep {
	isPending: boolean;
	isExecuting: boolean;
	isSuccess?: boolean;
}

export interface TransactionSteps {
	switchChain: TransactionStep & {
		execute: () => Promise<void>;
	};
	approval: TransactionStep & {
		execute: () =>
			| Promise<{ hash: Hash } | undefined>
			| Promise<void>
			| undefined;
	};
	transaction: TransactionStep & {
		execute: () => Promise<{ hash: Hash } | undefined> | Promise<void>;
	};
}

export class TransactionMachine {
	private currentState: TransactionState;
	private readonly logger: TransactionLogger;
	private marketplaceClient: SequenceMarketplace;
	private memoizedSteps: TransactionSteps | null = null;
	private lastProps: Input | null = null;

	constructor(
		private readonly config: StateConfig,
		private readonly wallet: WalletInstance,
		private readonly openSelectPaymentModal: (
			settings: SelectPaymentSettings,
		) => void,
		private readonly switchChainFn: (chainId: string) => Promise<void>,
		private readonly onPaymentModalLoaded?: () => void,
	) {
		this.currentState = TransactionState.IDLE;
		this.logger = createLogger('TransactionMachine');
		this.marketplaceClient = getMarketplaceClient(
			config.config.chainId,
			config.config.sdkConfig,
		);
		this.onPaymentModalLoaded = onPaymentModalLoaded;
	}

	private getMarketplaceFee(collectionAddress: string) {
		const defaultFee = 2.5;
		const defaultPlatformFeeRecipient =
			'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
		const avalancheAndOptimismPlatformFeeRecipient =
			'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';

		const chainId = Number(this.config.config.chainId);
		const collection = this.config.config.marketplaceConfig.collections.find(
			(collection) =>
				collection.collectionAddress.toLowerCase() ===
					collectionAddress.toLowerCase() &&
				chainId === Number(collection.chainId),
		);

		const avalancheOrOptimism =
			chainId === avalanche.id || chainId === optimism.id;
		const receiver = avalancheOrOptimism
			? avalancheAndOptimismPlatformFeeRecipient
			: defaultPlatformFeeRecipient;

		const percentageToBPS = (percentage: string | number) =>
			(Number(percentage) * 10000) / 100;

		return {
			amount: percentageToBPS(
				collection?.marketplaceFeePercentage || defaultFee,
			).toString(),
			receiver,
		} satisfies AdditionalFee;
	}

	private async generateSteps({
		type,
		props,
	}: TransactionInput): Promise<Step[]> {
		this.logger.debug('Generating steps', { type, props });
		const { collectionAddress } = this.config.config;
		const address = await this.wallet.address();

		try {
			switch (type) {
				case TransactionType.BUY:
					return await this.marketplaceClient
						.generateBuyTransaction({
							collectionAddress,
							buyer: address,
							walletType: this.wallet.walletKind,
							marketplace: props.marketplace,
							ordersData: [
								{
									orderId: props.orderId,
									quantity: props.quantity || '1',
								},
							],
							additionalFees: [this.getMarketplaceFee(collectionAddress)],
						})
						.then((resp) => resp.steps);

				case TransactionType.SELL:
					return await this.marketplaceClient
						.generateSellTransaction({
							collectionAddress,
							seller: address,
							walletType: this.wallet.walletKind,
							marketplace: props.marketplace,
							ordersData: [
								{
									orderId: props.orderId,
									quantity: props.quantity || '1',
								},
							],
							additionalFees: [this.getMarketplaceFee(collectionAddress)],
						})
						.then((resp) => resp.steps);

				case TransactionType.LISTING:
					if (!this.config.config.orderbookKind) {
						this.config.config.orderbookKind =
							OrderbookKind.sequence_marketplace_v2;
					}

					return await this.marketplaceClient
						.generateListingTransaction({
							collectionAddress,
							owner: address,
							walletType: this.wallet.walletKind,
							contractType: props.contractType,
							orderbook: this.config.config.orderbookKind,
							listing: props.listing,
						})
						.then((resp) => resp.steps);

				case TransactionType.OFFER:
					if (!this.config.config.orderbookKind) {
						this.config.config.orderbookKind =
							OrderbookKind.sequence_marketplace_v2;
					}

					return await this.marketplaceClient
						.generateOfferTransaction({
							collectionAddress,
							maker: address,
							walletType: this.wallet.walletKind,
							contractType: props.contractType,
							orderbook: this.config.config.orderbookKind,
							offer: props.offer,
						})
						.then((resp) => resp.steps);

				case TransactionType.CANCEL:
					return await this.marketplaceClient
						.generateCancelTransaction({
							collectionAddress,
							maker: address,
							marketplace: props.marketplace,
							orderId: props.orderId,
						})
						.then((resp) => resp.steps);
				default:
					throw new UnknownTransactionTypeError(type);
			}
		} catch (error) {
			if (error instanceof WebrpcError) {
				throw new StepGenerationError(type, error);
			}
			throw error;
		}
	}

	private clearMemoizedSteps() {
		this.logger.debug('Clearing memoized steps');
		this.memoizedSteps = null;
		this.lastProps = null;
	}

	private async transition(newState: TransactionState) {
		this.logger.state(this.currentState, newState);
		this.currentState = newState;
		this.clearMemoizedSteps();
	}

	private async switchChain() {
		this.logger.debug('Checking chain', {
			currentChain: await this.wallet.getChainId(),
			targetChain: Number(this.config.config.chainId),
		});

		const correctChain = await this.isOnCorrectChain();

		if (!correctChain) {
			const currentChain = await this.wallet.getChainId();
			const targetChain = Number(this.config.config.chainId);

			await this.transition(TransactionState.SWITCH_CHAIN);
			try {
				if (this.wallet.isWaaS) {
					await this.wallet.switchChain(targetChain);
				} else {
					await this.switchChainFn(this.config.config.chainId);
				}

				if (!this.isOnCorrectChain()) {
					throw new Error('Chain switch verification failed');
				}

				this.logger.debug('Switched chain successfully');
			} catch (error) {
				this.logger.debug('Chain switch failed', error);
				throw new ChainSwitchError(currentChain, targetChain);
			}
		}
	}

	private async isOnCorrectChain() {
		return (
			(await this.wallet.getChainId()) === Number(this.config.config.chainId)
		);
	}

	async start(props: Input) {
		this.logger.debug('Starting transaction', props);

		await this.transition(TransactionState.CHECKING_STEPS);
		const { type } = this.config.config;

		const steps = await this.generateSteps({
			type,
			props,
		} as TransactionInput);

		for (const step of steps) {
			await this.executeStep({ step, props });
		}

		await this.transition(TransactionState.SUCCESS);
	}

	private async handleTransactionSuccess(
		hash?: Hash,
		isApproval?: boolean,
		orderId?: string,
	) {
		if (!hash) {
			// TODO: This is to handle signature steps, but it's not ideal
			await this.transition(TransactionState.SUCCESS);
			this.config.onTransactionSent?.(undefined, orderId);
			return;
		}

		await this.transition(TransactionState.CONFIRMING);

		// Only notify of transaction sent, don't show success toast yet
		if (!isApproval) {
			this.config.onTransactionSent?.(hash);
		}

		try {
			const receipt = await this.wallet.handleConfirmTransactionStep(
				hash,
				await this.wallet.getChainId(),
			);
			this.logger.debug('Transaction confirmed', receipt);

			await this.transition(TransactionState.SUCCESS);

			// Only trigger success notification for the final confirmation
			if (isApproval) {
				this.config.onApprovalSuccess?.(hash);
			} else {
				console.log('onSuccess', hash);
				this.config.onSuccess?.(hash);
			}
		} catch (error) {
			throw new TransactionReceiptError(hash, error as Error);
		}
	}

	private async executeTransaction(step: Step): Promise<Hash> {
		try {
			await this.switchChain();

			if (step.id === StepType.tokenApproval) {
				await this.transition(TransactionState.TOKEN_APPROVAL);
			}

			this.logger.debug('Executing transaction', step);
			const hash = await this.wallet.handleSendTransactionStep(
				Number(this.config.config.chainId),
				step as StepForTransaction,
			);
			this.logger.debug('Transaction submitted', { hash });

			await this.handleTransactionSuccess(
				hash,
				step.id === StepType.tokenApproval,
			);
			return hash;
		} catch (error) {
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	private async executeSignature(step: Step) {
		await this.switchChain();

		if (!step.signature) {
			throw new MissingSignatureDataError();
		}

		try {
			const signature = await this.wallet.handleSignMessageStep(
				step as SignatureStep,
			);

			const result = await this.marketplaceClient.execute({
				signature: signature as string,
				executeType: ExecuteType.order,
				body: step.post?.body,
			});

			await this.handleTransactionSuccess(undefined, false, result.orderId);
		} catch (error) {
			this.logger.error('Signature execution failed', { error });
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	private openPaymentModalWithPromise(
		settings: Omit<SelectPaymentSettings, 'onSuccess' | 'onError'>,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			this.openSelectPaymentModal({
				...settings,
				onSuccess: async (hash: string) => {
					try {
						await this.handleTransactionSuccess(hash as Hash);
						resolve();
					} catch (error) {
						reject(error);
					}
				},
				onError: (error: Error) => {
					reject(new PaymentModalError(error));
				},
			});
		});
	}

	private async executeBuyStep({
		step,
		props,
	}: {
		step: Step;
		props: BuyInput;
	}) {
		try {
			await this.transition(TransactionState.EXECUTING_TRANSACTION);

			try {
				const [checkoutOptions, orders] = await Promise.all([
					this.marketplaceClient
						.checkoutOptionsMarketplace({
							wallet: await this.wallet.address(),
							orders: [
								{
									contractAddress: this.config.config.collectionAddress,
									orderId: props.orderId,
									marketplace: props.marketplace,
								},
							],
							additionalFee: Number(
								this.getMarketplaceFee(this.config.config.collectionAddress)
									.amount,
							),
						})
						.catch((error) => {
							throw new CheckoutOptionsError(error);
						}),
					this.marketplaceClient
						.getOrders({
							input: [
								{
									orderId: props.orderId,
									marketplace: props.marketplace,
									contractAddress: this.config.config.collectionAddress,
								},
							],
						})
						.catch((error) => {
							throw new OrdersFetchError(props.orderId, error);
						}),
				]);

				const order = orders.orders[0];
				if (!order) {
					throw new OrderNotFoundError(props.orderId);
				}

				const paymentModalProps = {
					chain: this.config.config.chainId,
					collectibles: [
						{
							tokenId: order.tokenId,
							quantity: props.quantity,
							decimals: props.collectableDecimals,
						},
					],
					currencyAddress: order.priceCurrencyAddress,
					price: step.value,
					targetContractAddress: step.to,
					txData: step.data as Hex,
					collectionAddress: this.config.config.collectionAddress,
					recipientAddress: await this.wallet.address(),
					enableMainCurrencyPayment: true,
					enableSwapPayments: !!checkoutOptions.options?.swap?.includes(
						TransactionSwapProvider.zerox,
					),
					creditCardProviders: checkoutOptions?.options.nftCheckout || [],
				};

				this.logger.debug('Opening payment modal', paymentModalProps);

				this.onPaymentModalLoaded?.();

				await this.openPaymentModalWithPromise(paymentModalProps);
			} catch (error) {
				if (error instanceof TransactionError) {
					throw error;
				}
				throw new PaymentModalTransactionError(step.id, error as Error);
			}
		} catch (error) {
			if (error instanceof TransactionError) {
				throw error;
			}
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	private async executeStep({
		step,
		props,
	}: {
		step: Step;
		props: TransactionInput['props'];
	}) {
		try {
			this.logger.debug('Executing step', { stepId: step.id });

			if (!step.to && !step.signature) {
				throw new MissingStepDataError();
			}

			if (step.id === StepType.buy) {
				await this.executeBuyStep({ step, props: props as BuyInput });
				return;
			}

			if (step.signature) {
				await this.executeSignature(step);
				return;
			}

			const hash = await this.executeTransaction(step);
			return { hash };
		} catch (error) {
			if (error instanceof TransactionError) {
				throw error;
			}
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	async getTransactionSteps(props: Input): Promise<TransactionSteps> {
		this.logger.debug('Getting transaction steps', props);
		// Return memoized value if props and state haven't changed
		if (
			this.memoizedSteps &&
			this.lastProps &&
			JSON.stringify(props) === JSON.stringify(this.lastProps)
		) {
			this.logger.debug('Returning memoized steps');
			return this.memoizedSteps;
		}

		const type = this.config.config.type;
		const steps = await this.generateSteps({
			type,
			props,
		} as TransactionInput);
		// Extract execution step, it should always be the last step
		const executionStep = steps.pop();
		if (!executionStep) {
			throw new NoStepsFoundError();
		}
		if (executionStep.id === StepType.tokenApproval) {
			throw new NoExecutionStepError();
		}
		const approvalStep = steps.pop();

		if (steps.length > 0) {
			throw new UnexpectedStepsError();
		}

		this.lastProps = props;
		this.memoizedSteps = {
			switchChain: {
				isPending: !this.isOnCorrectChain(),
				isExecuting: this.currentState === TransactionState.SWITCH_CHAIN,
				execute: () => this.switchChain(),
			},
			approval: {
				isPending: Boolean(approvalStep),
				isExecuting: this.currentState === TransactionState.TOKEN_APPROVAL,
				execute: () =>
					approvalStep && this.executeStep({ step: approvalStep, props }),
			},
			transaction: {
				isPending: Boolean(executionStep),
				isExecuting:
					this.currentState === TransactionState.EXECUTING_TRANSACTION,
				execute: () => this.executeStep({ step: executionStep, props }),
			},
		} as const;

		this.logger.debug('Generated new transaction steps', this.memoizedSteps);
		return this.memoizedSteps;
	}
}
