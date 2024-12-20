import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';
import type {
	Chain,
	Hash,
	Hex,
	PublicClient,
	TypedDataDomain,
	WalletClient,
} from 'viem';
import { avalanche, optimism } from 'viem/chains';
import {
	type AdditionalFee,
	type SequenceMarketplace,
	TransactionSwapProvider,
	type WalletKind,
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
	ChainIdUnavailableError,
	ChainSwitchError,
	CheckoutOptionsError,
	InvalidSignatureStepError,
	MissingPostStepError,
	MissingSignatureDataError,
	MissingStepDataError,
	NoExecutionStepError,
	NoStepsFoundError,
	NoWalletConnectedError,
	OrderNotFoundError,
	OrdersFetchError,
	PaymentModalError,
	PaymentModalTransactionError,
	SignatureExecutionError,
	StepExecutionError,
	StepGenerationError,
	TransactionError,
	TransactionReceiptError,
	UnexpectedStepsError,
	UnknownTransactionTypeError,
} from '../../../utils/_internal/error/transaction';
import { type TransactionLogger, createLogger } from './logger';

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
	walletKind: WalletKind;
	chainId: string;
	chains: readonly Chain[];
	collectionAddress: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	isWaaS: boolean;
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

interface TransactionStep {
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
		private readonly walletClient: WalletClient,
		private readonly publicClient: PublicClient,
		private readonly openSelectPaymentModal: (
			settings: SelectPaymentSettings,
		) => void,
		private readonly switchChainFn: (chainId: string) => Promise<void>,
	) {
		this.currentState = TransactionState.IDLE;
		this.logger = createLogger('TransactionMachine');
		this.marketplaceClient = getMarketplaceClient(
			config.config.chainId,
			config.config.sdkConfig,
		);
	}

	private getAccount() {
		const account = this.walletClient.account;
		if (!account) {
			throw new NoWalletConnectedError();
		}
		return account;
	}

	private getMarketplaceFee(collectionAddress: string) {
		const defaultFee = 2.5;
		const defaultPlatformFeeRecipient =
			'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
		const avalancheAndOptimismPlatformFeeRecipient =
			'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';
		const collection = this.config.config.marketplaceConfig.collections.find(
			(collection) =>
				collection.collectionAddress.toLowerCase() ===
					collectionAddress.toLowerCase() &&
				this.getChainId() === Number(collection.chainId),
		);

		const avalancheOrOptimism =
			this.getChainId() === avalanche.id || this.getChainId() === optimism.id;
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

	private getAccountAddress() {
		return this.getAccount().address;
	}

	private async generateSteps({
		type,
		props,
	}: TransactionInput): Promise<Step[]> {
		this.logger.debug('Generating steps', { type, props });
		const { collectionAddress } = this.config.config;
		const address = this.getAccountAddress();

		try {
			switch (type) {
				case TransactionType.BUY:
					return await this.marketplaceClient
						.generateBuyTransaction({
							collectionAddress,
							buyer: address,
							walletType: this.config.config.walletKind,
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
							walletType: this.config.config.walletKind,
							marketplace: props.marketplace,
							ordersData: [
								{
									orderId: props.orderId,
									quantity: props.quantity || '1',
								},
							],
							additionalFees: [],
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
							walletType: this.config.config.walletKind,
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
							walletType: this.config.config.walletKind,
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

	private getChainId(): number {
		const chainId = this.walletClient.chain?.id;
		if (!chainId) {
			throw new ChainIdUnavailableError();
		}
		return chainId;
	}

	private getChainForTransaction() {
		const chainId = this.config.config.chainId;
		return this.config.config.chains.find(
			(chain) => chain.id === Number(chainId),
		);
	}

	private isOnCorrectChain() {
		return this.getChainId() === Number(this.config.config.chainId);
	}

	private async switchChain(): Promise<void> {
		this.logger.debug('Checking chain', {
			currentChain: this.getChainId(),
			targetChain: Number(this.config.config.chainId),
		});

		if (!this.isOnCorrectChain()) {
			const currentChain = this.getChainId();
			const targetChain = Number(this.config.config.chainId);

			await this.transition(TransactionState.SWITCH_CHAIN);
			try {
				if (!this.config.config.isWaaS) {
					await this.switchChainFn(this.config.config.chainId);
				}

				await this.walletClient.switchChain({
					id: Number(this.config.config.chainId),
				});
				this.logger.debug('Switched chain');
			} catch (error) {
				throw new ChainSwitchError(currentChain, targetChain);
			}
		}
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

	private async handleTransactionSuccess(hash?: Hash, isApproval?: boolean) {
		if (!hash) {
			// TODO: This is to handle signature steps, but it's not ideal
			await this.transition(TransactionState.SUCCESS);
			return;
		}
		await this.transition(TransactionState.CONFIRMING);

		if (!isApproval) {
			// Most likely used for showing transaction status modal
			this.config.onTransactionSent?.(hash);
		}

		try {
			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});
			this.logger.debug('Transaction confirmed', receipt);

			await this.transition(TransactionState.SUCCESS);

			this.config.onSuccess?.(hash);

			if (isApproval) {
				this.config.onApprovalSuccess?.(hash);
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

			const transactionData = {
				account: this.getAccount(),
				chain: this.getChainForTransaction(),
				to: step.to as Hex,
				data: step.data as Hex,
				value: BigInt(step.value || '0'),
			};

			this.logger.debug('Executing transaction', transactionData);
			const hash = await this.walletClient.sendTransaction(transactionData);
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
		this.logger.debug('Executing signature', { stepId: step.id });
		if (!step.post) {
			throw new MissingPostStepError();
		}

		await this.switchChain();

		let signature: Hex;
		if (!step.signature) {
			throw new MissingSignatureDataError();
		}

		switch (step.id) {
			case StepType.signEIP712:
				signature = await this.walletClient.signTypedData({
					domain: step.signature.domain as TypedDataDomain,
					types: step.signature.types,
					primaryType: step.signature.primaryType,
					account: this.getAccountAddress(),
					message: step.signature.value,
				});
				break;
			case StepType.signEIP191:
				signature = await this.walletClient.signMessage({
					message: step.data,
					account: step.to as Hex,
				});
				break;
			default:
				throw new InvalidSignatureStepError(step.id);
		}

		try {
			const { orderId } = await this.marketplaceClient.execute({
				signature,
				executeType: ExecuteType.order,
				body: step.post.body,
			});

			this.config.onTransactionSent?.(undefined, orderId);
		} catch (error) {
			throw new SignatureExecutionError(step.id, error as Error);
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
							wallet: this.getAccountAddress(),
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
					chain: this.getChainId()!,
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
					collectionAddress: this.config.config.collectionAddress,
					recipientAddress: this.getAccountAddress(),
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
				this.config.onSuccess?.(hash);
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
