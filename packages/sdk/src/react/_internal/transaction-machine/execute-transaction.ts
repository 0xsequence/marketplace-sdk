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
import AsyncResultHandler, { Result } from './asyncResultHandler';

export type TransactionState = {
	switchChain: {
		needed: boolean;
		processing: boolean;
		processed: boolean;
	};
	approval: {
		needed: boolean;
		processing: boolean;
		processed: boolean;
		approve: () => Promise<any>;
	};
	steps: {
		checking: boolean;
		checked: boolean;
		steps?: Step[];
	};
	transaction: {
		ready: boolean;
		executing: boolean;
		executed: boolean;
		execute: (props: TransactionInput) => any;
	};
} | null;

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

const debug = (message: string, data?: any) => {
	console.debug(`[TransactionMachine] ${message}`, data || '');
};

export class TransactionMachine {
	transactionState: TransactionState;
	setTransactionState: React.Dispatch<React.SetStateAction<TransactionState>>;
	private marketplaceClient: SequenceMarketplace;
	private resultHandler: AsyncResultHandler<TransactionState>;

	constructor(
		private readonly config: StateConfig,
		private readonly walletClient: WalletClient,
		private readonly publicClient: PublicClient,
		private readonly openSelectPaymentModal: (
			settings: SelectPaymentSettings,
		) => void,
		private readonly accountChainId: number,
		private readonly switchChainFn: (chainId: string) => Promise<void>,
		transactionState: TransactionState,
		setTransactionState: React.Dispatch<React.SetStateAction<TransactionState>>,
	) {
		this.marketplaceClient = getMarketplaceClient(
			config.config.chainId,
			config.config.sdkConfig,
		);
		this.resultHandler = new AsyncResultHandler<TransactionState>(
			config.onError,
		);
		this.transactionState = transactionState;
		this.setTransactionState = setTransactionState;

		this.initialize();
		this.watchSwitchChain();
	}

	initialize() {
		if (this.transactionState) return;
		console.log('Initializing transaction machine');

		this.setTransactionState({
			switchChain: {
				needed: false,
				processing: false,
				processed: false,
			},
			approval: {
				needed: false,
				processing: false,
				processed: false,
				approve: this.approve,
			},
			steps: {
				checking: false,
				checked: false,
				steps: undefined,
			},
			transaction: {
				ready: false,
				executing: false,
				executed: false,
				execute: this.execute,
			},
		});
	}

	private async executeOperation(
		operation: () => Promise<TransactionState>,
	): Promise<Result<TransactionState>> {
		return this.resultHandler.execute(operation);
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
				this.accountChainId === Number(collection.chainId),
		);

		const receiver =
			this.accountChainId === avalanche.id
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

	async fetchSteps({ type, props }: TransactionInput) {
		debug('Fetching steps', { type, props });

		const { collectionAddress } = this.config.config;
		const address = this.getAccountAddress();

		await this.switchChain();

		if (type === TransactionType.BUY) {
			const generateBuyTransactionSteps =
				await this.marketplaceClient.generateBuyTransaction({
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
				});

			return generateBuyTransactionSteps.steps;
		}

		if (type === TransactionType.SELL) {
			const generateSellTransactionSteps =
				await this.marketplaceClient.generateSellTransaction({
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
				});

			return generateSellTransactionSteps.steps;
		}

		if (type === TransactionType.LISTING) {
			const generateListingTransactionSteps =
				await this.marketplaceClient.generateListingTransaction({
					collectionAddress,
					owner: address,
					walletType: this.config.config.walletKind,
					contractType: props.contractType,
					orderbook: OrderbookKind.sequence_marketplace_v2,
					listing: props.listing,
				});

			return generateListingTransactionSteps.steps;
		}

		if (type === TransactionType.OFFER) {
			const generateOfferTransactionSteps =
				await this.marketplaceClient.generateOfferTransaction({
					collectionAddress,
					maker: address,
					contractType: props.contractType,
					orderbook: OrderbookKind.sequence_marketplace_v2,
					offer: props.offer,
				});

			return generateOfferTransactionSteps.steps;
		}

		if (type === TransactionType.CANCEL) {
			const generateCancelTransactionSteps =
				await this.marketplaceClient.generateCancelTransaction({
					collectionAddress,
					maker: address,
					marketplace: props.marketplace,
					orderId: props.orderId,
				});

			return generateCancelTransactionSteps.steps;
		}

		throw new Error('Invalid transaction type');
	}

	private getChainForTransaction() {
		const chainId = this.config.config.chainId;
		return this.config.config.chains.find(
			(chain) => chain.id === Number(chainId),
		);
	}

	private isOnCorrectChain() {
		console.log('account chain id ', this.getAccount().client?.chain);
		return this.accountChainId === Number(this.config.config.chainId);
	}

	private async switchChain() {
		debug('Checking chain', {
			currentChain: this.accountChainId,
			targetChain: Number(this.config.config.chainId),
		});
		if (this.isOnCorrectChain()) return;

		this.setTransactionState({
			...this.transactionState!,
			switchChain: {
				needed: true,
				processing: true,
				processed: false,
			},
		});

		try {
			await this.switchChainFn(this.config.config.chainId);

			await this.walletClient.switchChain({
				id: Number(this.config.config.chainId),
			});
			debug('Switched chain');

			this.setTransactionState({
				...this.transactionState!,
				switchChain: {
					needed: false,
					processing: false,
					processed: true,
				},
			});
		} catch (error) {
			this.setTransactionState({
				...this.transactionState!,
				switchChain: {
					needed: true,
					processing: false,
					processed: false,
				},
			});
			throw error;
		}
	}

	private watchSwitchChain() {
		debug('Watching chain switch');
		let currentState = this.transactionState;

		if (!currentState) return;		

		if(currentState.switchChain.needed && !currentState.switchChain.processing) {
			this.switchChain();
		}
	     }

	private async handleTransactionSuccess(hash?: Hash) {
		if (!hash) {
			// TODO: This is to handle signature steps, but it's not ideal
			this.setTransactionState({
				...this.transactionState!,
				transaction: {
					...this.transactionState!.transaction,
					ready: false,
					executing: false,
					executed: true,
				},
			});
			return;
		}

		this.config.onTransactionSent?.(hash);

		const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
		debug('Transaction confirmed', receipt);

		this.setTransactionState({
			...this.transactionState!,
			transaction: {
				...this.transactionState!.transaction,
				ready: false,
				executing: false,
				executed: true,
			},
		});

		this.config.onSuccess?.(hash);
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
			chainId: String(this.accountChainId),
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

		if (!this.transactionState!.approval.processing) {
			await this.handleTransactionSuccess(hash);
		}

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
		this.setTransactionState({
			...this.transactionState!,
			transaction: {
				...this.transactionState!.transaction,
				ready: false,
				executing: true,
				executed: false,
			},
		});

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
			chain: this.accountChainId,
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

	private async execute(
		transactionInput: TransactionInput,
	): Promise<Result<TransactionState>> {
		if (!this.transactionState) throw new Error('Transaction state not found');

		const steps = this.transactionState?.steps || {
			checking: false,
			checked: false,
			steps: undefined,
		};

		debug('Executing transaction', { props: transactionInput, steps });

		if (!steps.steps) {
			throw new Error('No steps found');
		}

		const executionStep = steps.steps[0];
		debug('Executing step', { stepId: executionStep.id });

		if (!executionStep.to && !executionStep.signature) {
			throw new Error('Invalid step data');
		}

		this.setTransactionState({
			...this.transactionState!,
			transaction: {
				...this.transactionState!.transaction,
				ready: true,
				executing: true,
				executed: false,
			},
		});

		return this.executeOperation(async () => {
			if (executionStep.id === StepType.buy) {
				await this.executeBuyStep({
					step: executionStep,
					props: transactionInput.props as BuyInput,
				});
			} else if (executionStep.signature) {
				await this.executeSignature(executionStep);
			} else {
				await this.executeTransaction({
					step: executionStep,
					isTokenApproval: false,
				});
			}

			return {
				...this.transactionState!,
				transaction: {
					...this.transactionState!.transaction,
					ready: false,
					executing: false,
					executed: true,
				},
			};
		});
	}

	private async approve(): Promise<Result<TransactionState>> {
		this.setTransactionState({
			...this.transactionState!,
			approval: { ...this.transactionState!.approval, processing: true },
		});

		const approvalStep = this.transactionState!.steps.steps?.find(
			(step) => step.id === StepType.tokenApproval,
		);

		if (!approvalStep) {
			throw new Error('Approval step not found');
		}

		return this.executeOperation(async () => {
			this.setTransactionState({
				...this.transactionState!,
				approval: {
					...this.transactionState!.approval,
					needed: true,
					processing: true,
					processed: false,
				},
			});

			debug('Executing step', { stepId: approvalStep.id });

			if (!approvalStep.to && !approvalStep.signature) {
				throw new Error('Invalid step data');
			}

			if (approvalStep.id !== StepType.tokenApproval) {
				throw new Error('Invalid approval step');
			}

			const hash = await this.executeTransaction({
				step: approvalStep,
				isTokenApproval: true,
			});

			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});

			debug('Approval confirmed', receipt);

			this.setTransactionState({
				...this.transactionState!,
				approval: {
					...this.transactionState!.approval,
					processing: false,
					processed: true,
				},
			});

			return {
				...this.transactionState!,
				approval: {
					...this.transactionState!.approval,
					needed: false,
					processing: false,
					processed: true,
				},
			};
		});
	}
}
