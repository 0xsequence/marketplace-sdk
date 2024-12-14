import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';
import type { Client, Hash, Hex, PublicClient } from 'viem';
import { avalanche, optimism } from 'viem/chains';
import {
	type AdditionalFee,
	type SequenceMarketplace,
	TransactionSwapProvider,
	getMarketplaceClient,
} from '..';
import {
	ExecuteType,
	type MarketplaceConfig,
	type SdkConfig,
	type Step,
	StepType,
} from '../../../types';
import {
	ChainIdUnavailableError,
	ChainSwitchError,
	CheckoutOptionsError,
	InvalidSignatureStepError,
	MissingPostStepError,
	MissingSignatureDataError,
	MissingStepDataError,
	NoExecutionStepError,
	NoStepsFoundError,
	OrderNotFoundError,
	OrdersFetchError,
	PaymentModalError,
	PaymentModalTransactionError,
	StepExecutionError,
	TransactionError,
	TransactionReceiptError,
	UnexpectedStepsError,
} from '../../../utils/_internal/error/transaction';
import {
	type BuyInput,
	type Input,
	type TransactionInput,
	generateSteps,
} from './get-transaction-steps';
import { type TransactionLogger, createLogger } from './logger';
import type { SignatureStep, TransactionStep } from './utils';
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

export interface TransactionSteps {
	switchChain: {
		isPending: boolean;
		isExecuting: boolean;
		execute: () => Promise<void>;
	};
	approval: {
		isPending: boolean;
		isExecuting: boolean;
		execute: () =>
			| Promise<{ hash: Hash } | undefined>
			| Promise<void>
			| undefined;
	};
	transaction: {
		isPending: boolean;
		isExecuting: boolean;
		execute: () => Promise<{ hash: Hash } | undefined> | Promise<void>;
	};
}

export interface TransactionMachineConfig {
	wallet: WalletInstance;
	client: Client;
	publicClient: PublicClient;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	openSelectPaymentModal: (settings: SelectPaymentSettings) => void;
	switchChainFn: (chainId: string) => Promise<void>;
}

export interface TransactionMachineProps {
	config: TransactionMachineConfig;
	chainId: string;
	collectionAddress: string;
	type: TransactionType;
	onSuccess?: (hash: Hash) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export class TransactionMachine {
	private currentState: TransactionState;
	private readonly logger: TransactionLogger;
	private marketplaceClient: SequenceMarketplace;
	private memoizedSteps: TransactionSteps | null = null;
	private lastProps: Input | null = null;
	private readonly config: TransactionMachineConfig;
	private readonly props: TransactionMachineProps;

	private readonly client: TransactionMachineConfig['client'];
	private readonly publicClient: TransactionMachineConfig['publicClient'];
	private readonly openSelectPaymentModal: TransactionMachineConfig['openSelectPaymentModal'];
	private readonly switchChainFn: TransactionMachineConfig['switchChainFn'];

	constructor(props: TransactionMachineProps) {
		this.currentState = TransactionState.IDLE;
		this.logger = createLogger('TransactionMachine');
		this.marketplaceClient = getMarketplaceClient(
			props.chainId,
			props.config.sdkConfig,
		);
		this.config = props.config;
		this.client = props.config.client;
		this.publicClient = props.config.publicClient;
		this.openSelectPaymentModal = props.config.openSelectPaymentModal;
		this.switchChainFn = props.config.switchChainFn;
		this.props = props;
	}

	private getConnectedChainId() {
		const chainId = this.client.chain?.id;
		if (!chainId) {
			throw new ChainIdUnavailableError();
		}
		return chainId;
	}

	private isOnCorrectChain() {
		return this.getConnectedChainId() === Number(this.getConnectedChainId());
	}

	private getMarketplaceFee(collectionAddress: string) {
		const chainId = this.getConnectedChainId();
		const defaultFee = 2.5;
		const defaultPlatformFeeRecipient =
			'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
		const avalancheAndOptimismPlatformFeeRecipient =
			'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';
		const collection = this.config.marketplaceConfig.collections.find(
			(collection) =>
				collection.collectionAddress.toLowerCase() ===
					collectionAddress.toLowerCase() && chainId === collection.chainId,
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

	private async generateSteps(input: TransactionInput): Promise<Step[]> {
		this.logger.debug('Generating steps', input);
		const { collectionAddress } = this.props;

		return generateSteps({
			input,
			marketplaceClient: this.marketplaceClient,
			collectionAddress: collectionAddress as Hex,
			walletKind: this.config.wallet.walletKind,
			address: await this.config.wallet.address(),
			marketplaceFee: this.getMarketplaceFee(collectionAddress),
		});
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

	private async switchChain(): Promise<void> {
		this.logger.debug('Checking chain', {
			currentChain: this.getConnectedChainId(),
			targetChain: Number(this.props.chainId),
		});

		if (!this.isOnCorrectChain()) {
			const currentChain = this.getConnectedChainId();
			const targetChain = Number(this.props.chainId);

			await this.transition(TransactionState.SWITCH_CHAIN);
			try {
				await this.switchChainFn(this.props.chainId);

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

	async start(props: Input) {
		this.logger.debug('Starting transaction', props);

		await this.transition(TransactionState.CHECKING_STEPS);
		const { type } = this.props;

		const steps = await this.generateSteps({
			type,
			props,
		} as TransactionInput);

		for (const step of steps) {
			await this.executeStep({ step, props });
		}

		await this.transition(TransactionState.SUCCESS);
	}

	private async handleTransactionSuccess(hash?: Hash) {
		if (!hash) {
			await this.transition(TransactionState.SUCCESS);
			return;
		}
		await this.transition(TransactionState.CONFIRMING);
		this.props.onTransactionSent?.(hash);

		try {
			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});
			this.logger.debug('Transaction confirmed', receipt);

			await this.transition(TransactionState.SUCCESS);
			this.props.onSuccess?.(hash);
		} catch (error) {
			throw new TransactionReceiptError(hash, error as Error);
		}
	}

	private async executeTransaction(step: Step): Promise<Hash> {
		try {
			await this.switchChain();

			this.logger.debug('Executing transaction', { step });
			const hash = await this.config.wallet.handleSendTransactionStep(
				Number(this.props.chainId),
				step as TransactionStep,
			);

			this.logger.debug('Transaction submitted', { hash });

			await this.handleTransactionSuccess(hash);
			return hash;
		} catch (error) {
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	private async executeSignature(step: Step) {
		this.logger.debug('Executing signature', { stepId: step.id });
		if (!step.post) {
			throw new MissingPostStepError();
		}

		await this.switchChain();

		if (!step.signature) {
			throw new MissingSignatureDataError();
		}

		try {
			const signature = await this.config.wallet.handleSignMessageStep(
				step as SignatureStep,
			);

			await this.marketplaceClient.execute({
				signature: signature as string,
				executeType: ExecuteType.order,
				body: step.post,
			});

			await this.handleTransactionSuccess();
		} catch (error) {
			throw new InvalidSignatureStepError(step.id);
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
							wallet: await this.config.wallet.address(),
							orders: [
								{
									contractAddress: this.props.collectionAddress,
									orderId: props.orderId,
									marketplace: props.marketplace,
								},
							],
							additionalFee: Number(
								this.getMarketplaceFee(this.props.collectionAddress).amount,
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
									contractAddress: this.props.collectionAddress,
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
					chain: this.props.chainId,
					collectibles: [
						{
							tokenId: order.tokenId,
							quantity: props.quantity,
							decimals: props.collectableDecimals,
						},
					],
					currencyAddress: order.priceCurrencyAddress,
					price: order.priceAmount,
					targetContractAddress: step.to,
					txData: step.data as Hex,
					collectionAddress: this.props.collectionAddress,
					recipientAddress: await this.config.wallet.address(),
					enableMainCurrencyPayment: true,
					enableSwapPayments: !!checkoutOptions.options?.swap?.includes(
						TransactionSwapProvider.zerox,
					),
					creditCardProviders: checkoutOptions?.options.nftCheckout || [],
				};

				this.logger.debug('Opening payment modal', paymentModalProps);
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

			if (step.id !== StepType.tokenApproval) {
				this.props.onSuccess?.(hash);
			}

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

		const type = this.props.type;
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
