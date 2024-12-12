import type { SelectPaymentSettings } from '@0xsequence/kit-checkout';
import {
	TransactionExecutionError,
	type Chain,
	type Hash,
	type Hex,
	type PublicClient,
	type TypedDataDomain,
	type WalletClient,
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
	StepExecutionError,
	StepGenerationError,
	TransactionError,
	TransactionReceiptError,
	UnexpectedStepsError,
	UnknownTransactionTypeError,
} from '../../../utils/_internal/error/transaction';
import { ShowTransactionStatusModalArgs } from '../../ui/modals/_internal/components/transactionStatusModal';


export type TransactionState = {
	switchChain: {
		needed: boolean;
		processing: boolean;
		processed: boolean;
	};
	approval: {
		checked: boolean;
		needed: boolean;
		processing: boolean;
		processed: boolean;
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
	transactionInput: TransactionInput;
	walletKind: WalletKind;
	chainId: string;
	chains: readonly Chain[];
	collectionAddress: string;
	collectibleId?: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	fetchStepsOnInitialize?: boolean;
}

interface StateConfig {
	config: TransactionConfig;
	onTransactionSent?: (hash: Hash) => void;
	onSuccess?: (hash: Hash) => void;
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
	closeActionModal: (() => void) | undefined;
	showTransactionStatusModal: ({
		hash,
		blocked,
	}: Pick<ShowTransactionStatusModalArgs, 'hash' | 'blocked'>) => void;
	private marketplaceClient: SequenceMarketplace;

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
		closeActionModal: () => void,
		showTransactionStatusModal: ({
			hash,
			blocked,
		}: Pick<ShowTransactionStatusModalArgs, 'hash' | 'blocked'>) => void,
	) {
		this.marketplaceClient = getMarketplaceClient(
			config.config.chainId,
			config.config.sdkConfig,
		);
		this.transactionState = transactionState;
		this.setTransactionState = setTransactionState;
		this.closeActionModal = closeActionModal;
		this.showTransactionStatusModal = showTransactionStatusModal;

		this.initialize();
		this.watchSwitchChain();
	}

	private async initialize() {
		if (this.transactionState || !this.config.config.transactionInput) return;

		debug(
			'Initializing transaction state for',
			this.config.config.transactionInput.type,
		);

		const initialState = {
			switchChain: {
				needed: false,
				processing: false,
				processed: false,
			},
			approval: {
				checked: false,
				needed: false,
				processing: false,
				processed: false,
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
			},
		} as TransactionState;

		this.updateTransactionState(initialState);

		if (this.config.config.fetchStepsOnInitialize) {
			await this.fetchSteps(this.config.config.transactionInput);
		}

		debug('Watching chain switch');
		debug('Transaction state initialized', this.transactionState);
	}

	private updateTransactionState(newState: TransactionState) {
		this.setTransactionState(newState);
		this.transactionState = newState;
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
				this.accountChainId === Number(collection.chainId),
		);

		const avalancheOrOptimism =
			this.accountChainId === avalanche.id || this.accountChainId === optimism.id;
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

	async fetchSteps({ type, props }: TransactionInput): Promise<Step[]> {
		try {
			debug('Fetching steps', { type, props });

			const { collectionAddress } = this.config.config;
			const address = this.getAccountAddress();

			if (!this.transactionState) {
				throw new TransactionError('Transaction state not found');
			}

			this.setTransactionState((prev) => ({
				...prev!,
				steps: {
					...prev!.steps,
					checking: true,
					checked: false,
				},
			}));

			let steps;

			switch (type) {
				case TransactionType.BUY:
					steps = await this.marketplaceClient
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
						.then((result) => result.steps);
					break;

				case TransactionType.SELL:
					steps = await this.marketplaceClient
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
						.then((result) => result.steps);
					break;

				case TransactionType.LISTING:
					// for fetching steps for creating listing, placeholder pricePerToken is used to not block making request to check if moving and transferring access is approved. we don't need to check if spending erc20 token is approved
					const listing = !this.transactionState.approval.checked
						? ({
								...props.listing,
								pricePerToken: '1',
							} as CreateReq)
						: props.listing;

					steps = await this.marketplaceClient
						.generateListingTransaction({
							collectionAddress,
							owner: address,
							walletType: this.config.config.walletKind,
							contractType: props.contractType,
							orderbook: OrderbookKind.sequence_marketplace_v2,
							listing,
						})
						.then((result) => result.steps);
					break;

				case TransactionType.OFFER:
					steps = await this.marketplaceClient
						.generateOfferTransaction({
							collectionAddress,
							maker: address,
							walletType: this.config.config.walletKind,
							contractType: props.contractType,
							orderbook: OrderbookKind.sequence_marketplace_v2,
							offer: props.offer,
						})
						.then((resp) => resp.steps);
					break;

				case TransactionType.CANCEL:
					steps = await this.marketplaceClient
						.generateCancelTransaction({
							collectionAddress,
							maker: address,
							marketplace: props.marketplace,
							orderId: props.orderId,
						})
						.then((resp) => resp.steps);
					break;
				default:
					throw new UnknownTransactionTypeError(type);
			}
		} catch (error) {
			this.setTransactionState((prev) => ({
				...prev!,
				steps: {
					...prev!.steps,
					checking: false,
					checked: false,
					steps: undefined,
				},
			}));

			throw new StepGenerationError(type, error as Error);
		}
	}

	private setSteps(steps: Step[]) {
		debug('Setting steps', steps);

		const newState = {
			...this.transactionState!,
			approval: {
				...this.transactionState!.approval,
				checked: true,
				needed: steps.some((step) => step.id === StepType.tokenApproval),
				processing: false,
				processed: false,
			},
			transaction: {
				ready:
					!this.transactionState?.switchChain.needed &&
					!this.transactionState?.approval.needed,
			},
			steps: {
				...this.transactionState!.steps,
				checking: false,
				checked: true,
				steps: [...steps],
			},
		} as TransactionState;

		this.updateTransactionState(newState);
	}

	private getChainForTransaction() {
		const chainId = this.config.config.chainId;
		return this.config.config.chains.find(
			(chain) => chain.id === Number(chainId),
		);
	}

	private isOnCorrectChain() {
		return this.accountChainId === Number(this.config.config.chainId);
	}

	private async switchChain() {
		debug('Checking chain', {
			currentChain: this.accountChainId,
			targetChain: Number(this.config.config.chainId),
		});

		try {
			await this.switchChainFn(this.config.config.chainId);

			await this.walletClient.switchChain({
				id: Number(this.config.config.chainId),
			});

			debug('Switched chain to', this.config.config.chainId);

			this.setTransactionState({
				...this.transactionState!,
				switchChain: {
					processed: true,
					processing: false,
					needed: false,
				},
			});
		} catch (error) {
			this.setTransactionState({
				...this.transactionState!,
				switchChain: {
					processed: false,
					processing: false,
					needed: true,
				},
			});

			throw new ChainSwitchError(this.accountChainId, Number(this.config.config.chainId));
		}
	}

	private watchSwitchChain() {
		const currentState = this.transactionState;

		if (!currentState) return;

		if (!this.isOnCorrectChain()) {
			this.switchChain();
		}
	}

	approve = async ({ approvalStep }: { approvalStep: Step }): Promise<void> => {
		if (!this.transactionState) {
			throw new TransactionError('Transaction state not found');
		}

		if (!approvalStep) {
			throw new MissingStepDataError();
		}

		this.setTransactionState((prev) => ({
			...prev!,
			approval: {
				...prev!.approval,
				needed: true,
				processing: true,
				processed: false,
			},
		}));

		try {
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
				throw new MissingStepDataError();
			}

			if (approvalStep.id !== StepType.tokenApproval) {
				throw new InvalidStepError(approvalStep.id, 'Not a token approval step');
			}

			const hash = await this.executeTransaction({
				step: approvalStep,
				isTokenApproval: true,
			});

			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});

			debug('Approval confirmed', receipt);

			this.updateTransactionState({
				...this.transactionState!,
				approval: {
					...this.transactionState!.approval,
					needed: false,
					processing: false,
					processed: true,
				},
			});
		} catch (error) {
			this.setTransactionState({
				...this.transactionState!,
				approval: {
					checked: true,
					needed: true,
					processing: false,
					processed: false,
				},
			});
			throw error instanceof TransactionError ? error : new StepExecutionError(approvalStep.id, error as Error);
		}
	};

	async execute(transactionInput: TransactionInput): Promise<void> {
		if (!this.transactionState) {
			throw new TransactionError('Transaction state not found');
		}
		if (this.transactionState.approval.needed)
			throw new TransactionError('Approval needed before executing transaction');

		const steps = await this.fetchSteps(transactionInput);
		const transactionInputTypeToStepTypeMap = {
			[TransactionType.BUY]: StepType.buy,
			[TransactionType.SELL]: StepType.sell,
			[TransactionType.LISTING]: StepType.createListing,
			[TransactionType.OFFER]: StepType.createOffer,
			[TransactionType.CANCEL]: StepType.cancel,
		};
		const executionStep = steps.find(
			(step) =>
				step.id === transactionInputTypeToStepTypeMap[transactionInput.type],
		);
		const approvalStep = steps.find(
			(step) => step.id === StepType.tokenApproval,
		);

		if (approvalStep) {
			throw new TransactionError('Approval needed before executing transaction');
		}

		debug('Executing transaction', { props: transactionInput, executionStep });

		if (!executionStep) {
			throw new NoExecutionStepError();
		}

		if (!executionStep.to && !executionStep.signature) {
			throw new MissingStepDataError();
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

		try {
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

			this.kill();
		} catch (error) {
			this.setTransactionState({
				...this.transactionState!,
				transaction: {
					...this.transactionState!.transaction,
					ready: true,
					executing: false,
					executed: false,
				},
			});
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

		try {
			const hash = await this.walletClient.sendTransaction(transactionData);

			this.showTransactionStatusModal({ hash, blocked: isTokenApproval });

			if (!isTokenApproval) {
				this.closeActionModal && this.closeActionModal();
			}

			debug('Transaction submitted', { hash });

			if (!isTokenApproval) {
				await this.handleTransactionSuccess(hash);
			}

			return hash;
		} catch (error) {
			this.config.onError?.(error as Error);

			this.setTransactionState({
				...this.transactionState!,
				transaction: {
					...this.transactionState!.transaction,
					ready: true,
					executing: false,
					executed: false,
				},
			});

			throw new TransactionExecutionError(step.id, error as Error);
		}
	}

	private async executeSignature(step: Step) {
		debug('Executing signature', { stepId: step.id });
		let signature: Hex;
		if (!step.post) {
			throw new MissingPostStepError();
		}

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

		await this.marketplaceClient.execute({
			signature,
			executeType: ExecuteType.order,
			body: step.post,
		});

		this.setTransactionState({
			...this.transactionState!,
			transaction: {
				...this.transactionState!.transaction,
				ready: false,
				executing: false,
				executed: true,
			},
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
					this.setTransactionState({
						...this.transactionState!,
						transaction: {
							...this.transactionState!.transaction,
							executing: false,
							executed: true,
						},
					});

					await this.handleTransactionSuccess(hash as Hash);
					resolve();
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
							this.getMarketplaceFee(this.config.config.collectionAddress).amount,
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
		} catch (error) {
			if (error instanceof TransactionError) {
				throw error;
			}
			throw new StepExecutionError(step.id, error as Error);
		}
	}

	private async handleTransactionSuccess(hash?: Hash) {
		try {
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
		} catch (error) {
			throw new TransactionReceiptError(hash || '0x', error as Error);
		}
	}

	kill() {
		this.setTransactionState(null);
		this.transactionState = null;
	}
}
