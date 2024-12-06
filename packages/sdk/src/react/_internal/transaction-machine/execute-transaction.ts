import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';
import type {
	Chain,
	Hash,
	Hex,
	PublicClient,
	TypedDataDomain,
	WalletClient,
} from 'viem';
import { avalanche } from 'viem/chains';
import {
	type AdditionalFee,
	type SequenceMarketplace,
	TransactionSwapProvider,
	type WalletKind,
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
import { useTransactionStatusModal } from '../../ui/modals/_internal/components/transactionStatusModal';

export enum TransactionState {
	IDLE = 'IDLE',
	SWITCH_CHAIN = 'SWITCH_CHAIN',
	CHECKING_STEPS = 'CHECKING_STEPS',
	TOKEN_APPROVAL = 'TOKEN_APPROVAL',
	TOKEN_APPROVED = 'APPROVED_TOKEN',
	EXECUTING_TRANSACTION = 'EXECUTING_TRANSACTION',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	TRANSFER = 'TRANSFER',
	OFFER = 'OFFER',
	CANCEL = 'CANCEL',
}

export interface TransactionConfig {
	type: TransactionType;
	walletKind: WalletKind;
	chainId: string;
	chains: readonly Chain[];
	collectionAddress: string;
	collectibleId?: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
}

interface StateConfig {
	config: TransactionConfig;
	onTransactionSent?: (hash: Hash) => void;
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
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

interface StateConfig {
	config: TransactionConfig;
	onTransactionSent?: (hash: Hash) => void;
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
}

interface TransactionStep {
	isReadyToExecute: boolean;
	isExecuting: boolean;
}

export interface TransactionSteps {
	switchChain: TransactionStep & {
		execute: () => Promise<void>;
	};
	approval: TransactionStep & {
		approve: () =>
			| Promise<{ hash: Hash } | undefined>
			| Promise<void>
			| undefined;
		approved?: boolean;
	};
	transaction: TransactionStep & {
		execute: () => Promise<{ hash: Hash } | undefined> | Promise<void>;
		done?: boolean;
	};
}

const debug = (message: string, data?: any) => {
	console.debug(`[TransactionMachine] ${message}`, data || '');
};

export class TransactionMachine {
	private currentState: TransactionState;
	private marketplaceClient: SequenceMarketplace;
	private memoizedSteps: TransactionSteps | null = null;
	private lastProps: TransactionInput['props'] | null = null;

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
		this.marketplaceClient = getMarketplaceClient(
			config.config.chainId,
			config.config.sdkConfig,
		);
	}

	private getAccount() {
		const account = this.walletClient.account;
		if (!account) {
			throw new Error('Account not connected');
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

		const receiver =
			this.getChainId() === avalanche.id
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
		debug('Generating steps', { type, props });
		const { collectionAddress } = this.config.config;
		const address = this.getAccountAddress();
		switch (type) {
			case TransactionType.BUY:
				return this.marketplaceClient
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
				return this.marketplaceClient
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
				return this.marketplaceClient
					.generateListingTransaction({
						collectionAddress,
						owner: address,
						walletType: this.config.config.walletKind,
						contractType: props.contractType,
						orderbook: OrderbookKind.sequence_marketplace_v2,
						listing: props.listing,
					})
					.then((resp) => resp.steps);

			case TransactionType.OFFER:
				return this.marketplaceClient
					.generateOfferTransaction({
						collectionAddress,
						maker: address,
						walletType: this.config.config.walletKind,
						contractType: props.contractType,
						orderbook: OrderbookKind.sequence_marketplace_v2,
						offer: props.offer,
					})
					.then((resp) => resp.steps);

			case TransactionType.CANCEL:
				return this.marketplaceClient
					.generateCancelTransaction({
						collectionAddress,
						maker: address,
						marketplace: props.marketplace,
						orderId: props.orderId,
					})
					.then((resp) => resp.steps);

			default:
				throw new Error(`Unknown transaction type: ${type}`);
		}
	}

	private clearMemoizedSteps() {
		debug('Clearing memoized steps');
		this.memoizedSteps = null;
		this.lastProps = null;
	}

	private async transition(newState: TransactionState) {
		debug(`State transition: ${this.currentState} -> ${newState}`);
		this.currentState = newState;
		this.clearMemoizedSteps();
	}

	private getChainId() {
		return this.walletClient.chain?.id;
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
		debug('Checking chain', {
			currentChain: this.getChainId(),
			targetChain: Number(this.config.config.chainId),
		});
		if (!this.isOnCorrectChain()) {
			await this.transition(TransactionState.SWITCH_CHAIN);
			await this.switchChainFn(this.config.config.chainId);
			await this.walletClient.switchChain({
				id: Number(this.config.config.chainId),
			});
			debug('Switched chain');
		}
	}

	async start({ props }: { props: TransactionInput['props'] }) {
		debug('Starting transaction', props);
		try {
			await this.transition(TransactionState.CHECKING_STEPS);
			const { type } = this.config.config;

			const steps = await this.generateSteps({
				type,
				props,
			} as TransactionInput);

			for (const step of steps) {
				try {
					await this.executeStep({ step, props });
				} catch (error) {
					await this.transition(TransactionState.ERROR);
					throw error;
				}
			}

			await this.transition(TransactionState.SUCCESS);
		} catch (error) {
			debug('Transaction failed', error);
			await this.transition(TransactionState.ERROR);
			throw error;
		}
	}

	private async handleTransactionSuccess(hash?: Hash) {
		if (!hash) {
			// TODO: This is to handle signature steps, but it's not ideal
			await this.transition(TransactionState.SUCCESS);
			return;
		}

		this.config.onTransactionSent?.(hash);

		const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
		debug('Transaction confirmed', receipt);

		await this.transition(TransactionState.SUCCESS);

		this.config.onSuccess?.(hash);
	}

	private async listenApprovalReceipt(hash: Hash) {
		try {
			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});
			debug('Approval confirmed', receipt);
			await this.transition(TransactionState.TOKEN_APPROVED);
		} catch (error) {
			await this.transition(TransactionState.ERROR);
			throw error;
		}
	}

	private async executeTransaction({
		step,
		isTokenApproval,
	}: {
		step: Step;
		isTokenApproval: boolean;
	}): Promise<Hash> {
		const transactionData = {
			account: this.getAccount(),
			chain: this.getChainForTransaction(),
			to: step.to as Hex,
			data: step.data as Hex,
			value: BigInt(step.value || '0'),
		};
		debug('Executing transaction', transactionData);
		const hash = await this.walletClient.sendTransaction(transactionData);

		useTransactionStatusModal().show({
			chainId: this.getChainId()! as unknown as string,
			collectionAddress: this.config.config.collectionAddress as Hex,
			collectibleId: this.config.config.collectibleId as string,
			hash: hash as Hash,
			type: this.config.config.type,
			callbacks: {
				onError: this.config.onError,
				onSuccess: this.config.onSuccess,
			},
			blocked: isTokenApproval,
		});

		debug('Transaction submitted', { hash });

		if (isTokenApproval) {
			await this.listenApprovalReceipt(hash);
			return hash;
		}

		await this.handleTransactionSuccess(hash);
		return hash;
	}

	private async executeSignature(step: Step) {
		debug('Executing signature', { stepId: step.id });
		let signature: Hex;
		if (!step.post) {
			throw new Error('Missing post step');
		}
		switch (step.id) {
			case StepType.signEIP712:
				if (!step.signature) {
					throw new Error('Missing signature data');
				}
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
				throw new Error(`Invalid signature step: ${step.id}`);
		}

		await this.marketplaceClient.execute({
			signature,
			executeType: ExecuteType.order,
			body: step.post,
		});
		await this.handleTransactionSuccess();
	}

	private openPaymentModalWithPromise(
		settings: Omit<SelectPaymentSettings, 'onSuccess' | 'onError'>,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			this.openSelectPaymentModal({
				...settings,
				onSuccess: async (hash: string) => {
					await this.handleTransactionSuccess(hash as Hash);
					resolve();
				},
				onError: (error: Error) => {
					this.config.onError?.(error);
					reject(error);
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
		this.transition(TransactionState.EXECUTING_TRANSACTION);
		const [checkoutOptions, orders] = await Promise.all([
			this.marketplaceClient.checkoutOptionsMarketplace({
				wallet: this.getAccountAddress(),
				orders: [
					{
						contractAddress: this.config.config.collectionAddress,
						orderId: props.orderId,
						marketplace: props.marketplace,
					},
				],
				additionalFee: Number(
					this.getMarketplaceFee(this.config.config.collectionAddress).amount,
				),
			}),
			this.marketplaceClient.getOrders({
				input: [
					{
						orderId: props.orderId,
						marketplace: props.marketplace,
						contractAddress: this.config.config.collectionAddress,
					},
				],
			}),
		]);

		const order = orders.orders[0];

		if (!order) {
			throw new Error('Order not found');
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
		} satisfies SelectPaymentSettings;

		debug('Open Kit PaymentModal', { order, checkoutOptions });

		await this.openPaymentModalWithPromise(paymentModalProps);
	}

	private async executeStep({
		step,
		props,
	}: {
		step: Step;
		props: TransactionInput['props'];
	}) {
		console.log('step:', step);
		debug('Executing step', { stepId: step.id });
		if (!step.to && !step.signature) {
			throw new Error('Invalid step data');
		}

		try {
			await this.switchChain();
			if (step.id === StepType.buy) {
				await this.executeBuyStep({ step, props: props as BuyInput });
			} else if (step.signature) {
				await this.executeSignature(step);
			} else if (step.id === StepType.tokenApproval) {
				//TODO: Add some sort ofs callback heres
				const hash = await this.executeTransaction({
					step,
					isTokenApproval: true,
				});
				return { hash };
			} else {
				const hash = await this.executeTransaction({
					step,
					isTokenApproval: false,
				});
				this.config.onSuccess?.(hash);
				return { hash };
			}
		} catch (error) {
			this.config.onError?.(error as Error);
			throw error;
		}
	}

	private async approve({ step }: { step: Step }) {
		debug('Executing step', { stepId: step.id });
		if (!step.to && !step.signature) {
			throw new Error('Invalid step data');
		}

		if (step.id !== StepType.tokenApproval) {
			throw new Error('Invalid approval step');
		}

		try {
			await this.switchChain();

			const hash = await this.executeTransaction({
				step,
				isTokenApproval: true,
			});
			return { hash };
		} catch (error) {
			this.config.onError?.(error as Error);
			throw error;
		}
	}

	async getTransactionSteps(
		props: TransactionInput['props'],
	): Promise<TransactionSteps> {
		debug('Getting transaction steps', props);
		// Return memoized value if props and state haven't changed
		if (
			this.memoizedSteps &&
			this.lastProps &&
			JSON.stringify(props) === JSON.stringify(this.lastProps)
		) {
			debug('Returning memoized steps');
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
			throw new Error('No steps found');
		}
		if (executionStep.id === StepType.tokenApproval) {
			throw new Error('No execution step found, only approval step');
		}
		const approvalStep = steps.pop();

		if (steps.length > 0) {
			throw new Error('Unexpected steps found');
		}

		this.lastProps = props;
		this.memoizedSteps = {
			switchChain: {
				isReadyToExecute: !this.isOnCorrectChain(),
				isExecuting: this.currentState === TransactionState.SWITCH_CHAIN,
				execute: () => this.switchChain(),
			},
			approval: {
				isReadyToExecute: Boolean(approvalStep),
				isExecuting: this.currentState === TransactionState.TOKEN_APPROVAL,
				approved: this.currentState === TransactionState.TOKEN_APPROVED,
				approve: () => approvalStep && this.approve({ step: approvalStep }),
			},
			transaction: {
				isReadyToExecute: Boolean(executionStep),
				done: this.currentState === TransactionState.SUCCESS,
				isExecuting:
					this.currentState === TransactionState.EXECUTING_TRANSACTION,
				execute: () => this.executeStep({ step: executionStep, props }),
			},
		} as const;

		debug('Generated new transaction steps', this.memoizedSteps);
		return this.memoizedSteps;
	}
}
