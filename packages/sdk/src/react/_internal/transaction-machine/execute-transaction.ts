import type {
	WalletClient,
	Hash,
	Hex,
	TypedDataDomain,
	PublicClient,
} from 'viem';
import {
	OrderbookKind,
	StepType,
	type Step,
	type CreateReq,
	type ContractType,
	type MarketplaceKind,
	ExecuteType,
	type SdkConfig,
	type MarketplaceConfig,
} from '../../../types';
import {
	getMarketplaceClient,
	type SequenceMarketplace,
	type AdditionalFee,
	TransactionSwapProvider,
	type WalletKind,
} from '..';
import { avalanche } from 'viem/chains';
import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';

export enum TransactionState {
	IDLE = 'IDLE',
	SWITCH_CHAIN = 'SWITCH_CHAIN',
	CHECKING_STEPS = 'CHECKING_STEPS',
	TOKEN_APPROVAL = 'TOKEN_APPROVAL',
	EXECUTING_TRANSACTION = 'EXECUTING_TRANSACTION',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	OFFER = 'OFFER',
	CANCEL = 'CANCEL',
}

export interface TransactionConfig {
	type: TransactionType;
	walletKind: WalletKind;
	chainId: string;
	collectionAddress: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
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
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
}

interface TransactionStep {
	isPending: boolean;
	isExecuting: boolean;
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
		this.memoizedSteps = null;
		this.lastProps = null;
	}

	private async transition(newState: TransactionState) {
		console.log(`Transitioning from ${this.currentState} to ${newState}`);
		this.currentState = newState;
		// Clear memoized steps when state changes
		this.clearMemoizedSteps();
	}

	private getChainId() {
		return this.walletClient.chain?.id;
	}

	private isOnCorrectChain() {
		return this.getChainId() === Number(this.config.config.chainId);
	}

	private async switchChain(): Promise<void> {
		if (!this.isOnCorrectChain()) {
			await this.transition(TransactionState.SWITCH_CHAIN);
			await this.switchChainFn(this.config.config.chainId);
		}
	}

	async start({ props }: { props: TransactionInput['props'] }) {
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
			await this.transition(TransactionState.ERROR);
			throw error;
		}
	}

	private async executeTransaction(step: Step): Promise<Hash> {
		const hash = await this.walletClient.sendTransaction({
			account: this.getAccount(),
			chain: this.walletClient.chain,
			to: step.to as Hex,
			data: step.data as Hex,
			value: BigInt(step.value || '0'),
		});

		await this.publicClient.waitForTransactionReceipt({ hash });
		return hash;
	}

	private async executeSignature(step: Step) {
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

		return await this.marketplaceClient.execute({
			signature,
			executeType: ExecuteType.order,
			body: step.post,
		});
	}

	private openPaymentModalWithPromise(
		settings: Omit<SelectPaymentSettings, 'onSuccess' | 'onError'>,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			this.openSelectPaymentModal({
				...settings,
				onSuccess: (hash: string) => {
					this.config.onSuccess?.(hash as Hash);
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

		await this.openPaymentModalWithPromise({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
		});
	}

	private async executeStep({
		step,
		props,
	}: {
		step: Step;
		props: TransactionInput['props'];
	}) {
		if (!step.to && !step.signature) {
			throw new Error('Invalid step data');
		}

		try {
			await this.switchChain();
			if (step.id === StepType.buy) {
				await this.executeBuyStep({ step, props: props as BuyInput });
			} else if (step.signature) {
				await this.executeSignature(step);
			} else {
				const hash = await this.executeTransaction(step);
				this.config.onSuccess?.(hash);
				return { hash };
			}
		} catch (error) {
			this.config.onError?.(error as Error);
			throw error;
		}
	}

	async getTransactionSteps(
		props: TransactionInput['props'],
	): Promise<TransactionSteps> {
		// Return memoized value if props and state haven't changed
		if (
			this.memoizedSteps &&
			this.lastProps &&
			JSON.stringify(props) === JSON.stringify(this.lastProps)
		) {
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

		return this.memoizedSteps;
	}
}
