import { SEQUENCE_MARKET_V1_ADDRESS, SEQUENCE_MARKET_V2_ADDRESS } from "./src-Dz2CfBL0.js";
import { ChainSwitchError, ChainSwitchUserRejectedError, NoWalletConnectedError, TransactionConfirmationError, TransactionExecutionError, TransactionSignatureError, UserRejectedRequestError, WalletInstanceNotFoundError } from "./transaction-CnctdNzS.js";
import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { collectableKeys, getIndexerClient, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { ExecuteType, StepType, WalletKind } from "./marketplace.gen-HpnpL5xU.js";
import { ERC1155_ABI } from "./token-CHSBPYVG.js";
import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { useAutoSelectFeeOption, useSwitchChainModal } from "./utils-CXVC-6SQ.js";
import { useWaasFeeOptions } from "@0xsequence/connect";
import { useAccount, useChainId, usePublicClient, useSendTransaction, useSignMessage, useSignTypedData, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { BaseError, TransactionReceiptNotFoundError, UserRejectedRequestError as UserRejectedRequestError$1, WaitForTransactionReceiptTimeoutError, custom, erc20Abi, erc721Abi, hexToBigInt, isHex } from "viem";

//#region src/react/_internal/logger.ts
var TransactionLogger = class {
	constructor(context, enabled = true) {
		this.context = context;
		this.enabled = enabled;
	}
	formatData(data) {
		if (data instanceof Error) return {
			name: data.name,
			message: data.message,
			cause: data.cause instanceof Error ? this.formatData(data.cause) : data.cause,
			stack: data.stack?.split("\n").slice(0, 3)
		};
		if (Array.isArray(data)) return data.map((item) => this.formatData(item));
		if (typeof data === "object" && data !== null) return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, this.formatData(value)]));
		return data;
	}
	log(level, message, data) {
		if (!this.enabled) return;
		console[level](`[${this.context}] ${message}`, data ? this.formatData(data) : "");
	}
	debug(message, data) {
		this.log("debug", message, data);
	}
	error(message, error) {
		this.log("error", message, error);
	}
	info(message, data) {
		this.log("info", message, data);
	}
	state(from, to) {
		this.info(`State transition: ${from} -> ${to}`);
	}
};
const createLogger = (context, enabled = true) => new TransactionLogger(context, enabled);

//#endregion
//#region src/react/_internal/wallet/wallet.ts
const isSequenceWallet = (connector) => connector.id === "sequence" || connector.id === "sequence-waas";
const wallet = ({ wallet: wallet$1, chains, connector, sdkConfig, publicClient }) => {
	const logger = createLogger("Wallet");
	const walletInstance = {
		transport: custom(wallet$1.transport),
		isWaaS: connector.id.endsWith("waas"),
		walletKind: isSequenceWallet(connector) ? WalletKind.sequence : WalletKind.unknown,
		getChainId: wallet$1.getChainId,
		address: async () => {
			let address = wallet$1.account?.address;
			if (!address) [address] = await wallet$1.getAddresses();
			return address;
		},
		switchChain: async (chainId) => {
			logger.debug("Switching chain", { targetChainId: chainId });
			try {
				await wallet$1.switchChain({ id: chainId });
				logger.info("Chain switch successful", { chainId });
				return;
			} catch (e) {
				const error = e;
				logger.error("Chain switch failed", error);
				switch (error.name) {
					case "SwitchChainNotSupportedError": throw new ChainSwitchError(await wallet$1.getChainId(), chainId);
					case "UserRejectedRequestError": throw new UserRejectedRequestError();
					case "ChainNotConfiguredError": return;
					default: throw new ChainSwitchError(await wallet$1.getChainId(), chainId);
				}
			}
		},
		handleSignMessageStep: async (stepItem) => {
			try {
				if (stepItem.id === StepType.signEIP191) {
					logger.debug("Signing with EIP-191", { data: stepItem.data });
					const message = isHex(stepItem.data) ? { raw: stepItem.data } : stepItem.data;
					return await wallet$1.signMessage({
						account: wallet$1.account,
						message
					});
				}
				if (stepItem.id === StepType.signEIP712) {
					logger.debug("Signing with EIP-712", {
						domain: stepItem.domain,
						types: stepItem.signature?.types
					});
					return await wallet$1.signTypedData({
						account: wallet$1.account,
						domain: stepItem.signature.domain,
						types: stepItem.signature.types,
						primaryType: stepItem.signature.primaryType,
						message: stepItem.signature.value
					});
				}
			} catch (e) {
				const error = e;
				logger.error("Signature failed", error);
				if (error.cause instanceof BaseError) {
					const viemError = error.cause;
					if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
				}
				throw new TransactionSignatureError(stepItem.id, error);
			}
		},
		handleSendTransactionStep: async (chainId, stepItem) => {
			logger.debug("Sending transaction", {
				chainId,
				to: stepItem.to,
				value: stepItem.value
			});
			const chain = chains.find((chain$1) => chain$1.id === chainId);
			try {
				return await wallet$1.sendTransaction({
					chain,
					data: stepItem.data,
					account: wallet$1.account,
					to: stepItem.to,
					value: hexToBigInt(stepItem.value || "0x0"),
					...stepItem.maxFeePerGas && { maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas) },
					...stepItem.maxPriorityFeePerGas && { maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas) },
					...stepItem.gas && { gas: hexToBigInt(stepItem.gas) }
				});
			} catch (e) {
				const error = e;
				logger.error("Transaction failed", error);
				if (error.cause instanceof BaseError) {
					const viemError = error.cause;
					if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
				}
				throw new TransactionExecutionError(stepItem.id, error);
			}
		},
		handleConfirmTransactionStep: async (txHash, chainId) => {
			logger.debug("Confirming transaction", {
				txHash,
				chainId
			});
			try {
				const receipt = await awaitTransactionReceipt({
					txHash,
					chainId,
					sdkConfig
				});
				logger.info("Transaction confirmed", {
					txHash,
					receipt
				});
				return receipt;
			} catch (error) {
				logger.error("Transaction confirmation failed", error);
				throw new TransactionConfirmationError(txHash, error);
			}
		},
		hasTokenApproval: async ({ tokenType, contractAddress, spender }) => {
			const walletAddress = await walletInstance.address();
			const spenderAddress = spender === "sequenceMarketV1" ? SEQUENCE_MARKET_V1_ADDRESS : spender === "sequenceMarketV2" ? SEQUENCE_MARKET_V2_ADDRESS : spender;
			switch (tokenType) {
				case "ERC20": return await publicClient.readContract({
					address: contractAddress,
					abi: erc20Abi,
					functionName: "allowance",
					args: [walletAddress, spenderAddress]
				});
				case "ERC721": return await publicClient.readContract({
					address: contractAddress,
					abi: erc721Abi,
					functionName: "isApprovedForAll",
					args: [walletAddress, spenderAddress]
				});
				case "ERC1155": return await publicClient.readContract({
					address: contractAddress,
					abi: ERC1155_ABI,
					functionName: "isApprovedForAll",
					args: [walletAddress, spenderAddress]
				});
				default: throw new Error("Unsupported contract type for approval checking");
			}
		},
		publicClient
	};
	return walletInstance;
};
const ONE_MIN = 60 * 1e3;
const THREE_MIN = 3 * ONE_MIN;
const awaitTransactionReceipt = async ({ txHash, chainId, sdkConfig, timeout = THREE_MIN }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	return Promise.race([new Promise((resolve, reject) => {
		indexer.subscribeReceipts({ filter: { txnHash: txHash } }, {
			onMessage: ({ receipt }) => {
				resolve(receipt);
			},
			onError: () => {
				reject(TransactionReceiptNotFoundError);
			}
		});
	}), new Promise((_, reject) => {
		setTimeout(() => {
			reject(WaitForTransactionReceiptTimeoutError);
		}, timeout);
	})]);
};

//#endregion
//#region src/react/_internal/wallet/useWallet.ts
const useWallet = () => {
	const { chains } = useSwitchChain();
	const { data: walletClient, isLoading: wagmiWalletIsLoading, isError: wagmiWalletIsError } = useWalletClient();
	const { connector, isConnected, isConnecting } = useAccount();
	const sdkConfig = useConfig();
	const chainId = useChainId();
	const publicClient = usePublicClient();
	const canCreateWallet = walletClient && connector && isConnected && publicClient;
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"wallet",
			chainId,
			connector?.uid
		],
		queryFn: canCreateWallet ? () => {
			return wallet({
				wallet: walletClient,
				chains,
				connector,
				sdkConfig,
				publicClient
			});
		} : skipToken,
		staleTime: Number.POSITIVE_INFINITY
	});
	return {
		wallet: data,
		isLoading: isLoading || isConnecting || wagmiWalletIsLoading,
		isError: isError || wagmiWalletIsError
	};
};

//#endregion
//#region src/react/hooks/util/optimisticCancelUpdates.ts
const SECOND = 1e3;
const updateQueriesOnCancel = ({ orderId, queryClient }) => {
	queryClient.setQueriesData({
		queryKey: collectableKeys.offersCount,
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: collectableKeys.offers,
		exact: false
	}, (oldData) => {
		if (!oldData || !oldData.offers) return oldData;
		return {
			...oldData,
			offers: oldData.offers.filter((offer) => offer.orderId !== orderId)
		};
	});
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: collectableKeys.highestOffers,
			exact: false
		});
	}, 2 * SECOND);
	queryClient.setQueriesData({
		queryKey: collectableKeys.listingsCount,
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: collectableKeys.listings,
		exact: false
	}, (oldData) => {
		if (!oldData || !oldData.listings) return oldData;
		return {
			...oldData,
			listings: oldData.listings.filter((listing) => listing.orderId !== orderId)
		};
	});
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: collectableKeys.lowestListings,
			exact: false
		});
	}, 2 * SECOND);
};
const invalidateQueriesOnCancel = ({ queryClient }) => {
	queryClient.invalidateQueries({
		queryKey: collectableKeys.offers,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.offersCount,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.listings,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.listingsCount,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.highestOffers,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.lowestListings,
		exact: false
	});
};

//#endregion
//#region src/react/hooks/transactions/useGenerateCancelTransaction.tsx
const generateCancelTransaction = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.generateCancelTransaction({
		...args,
		chainId: String(args.chainId)
	}).then((data) => data.steps);
};
const useGenerateCancelTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateCancelTransaction(args, config)
	});
	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useCancelTransactionSteps.tsx
const useCancelTransactionSteps = ({ collectionAddress, chainId, callbacks, setSteps, onSuccess, onError }) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { wallet: wallet$1, isLoading, isError } = useWallet();
	const walletIsInitialized = wallet$1 && !isLoading && !isError;
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(sdkConfig);
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({ chainId });
	const getWalletChainId = async () => {
		return await wallet$1?.getChainId();
	};
	const switchChain = async () => {
		await wallet$1?.switchChain(Number(chainId));
	};
	const checkAndSwitchChain = async () => {
		const walletChainId = await getWalletChainId();
		const isWaaS = wallet$1?.isWaaS;
		const chainIdMismatch = walletChainId !== Number(chainId);
		return new Promise((resolve, reject) => {
			if (chainIdMismatch) if (isWaaS) switchChain().then(resolve).catch(reject);
			else showSwitchChainModal({
				chainIdToSwitchTo: chainId,
				onSuccess: () => resolve({ chainId }),
				onError: (error) => reject(error),
				onClose: () => reject(new ChainSwitchUserRejectedError())
			});
			else resolve({ chainId });
		});
	};
	const getCancelSteps = async ({ orderId, marketplace }) => {
		try {
			const address = await wallet$1?.address();
			if (!address) throw new Error("Wallet address not found");
			const steps = await generateCancelTransactionAsync({
				chainId,
				collectionAddress,
				maker: address,
				marketplace,
				orderId
			});
			return steps;
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const cancelOrder = async ({ orderId, marketplace }) => {
		const queryClient = getQueryClient();
		if (!walletIsInitialized) throw new WalletInstanceNotFoundError();
		try {
			await checkAndSwitchChain();
			setSteps((prev) => ({
				...prev,
				isExecuting: true
			}));
			const cancelSteps = await getCancelSteps({
				orderId,
				marketplace
			});
			const transactionStep = cancelSteps?.find((step) => step.id === StepType.cancel);
			const signatureStep = cancelSteps?.find((step) => step.id === StepType.signEIP712);
			console.debug("transactionStep", transactionStep);
			console.debug("signatureStep", signatureStep);
			if (!transactionStep && !signatureStep) throw new Error("No transaction or signature step found");
			let hash;
			let reservoirOrderId;
			if (transactionStep && wallet$1) {
				hash = await executeTransaction({ transactionStep });
				if (hash) {
					await wallet$1.handleConfirmTransactionStep(hash, Number(chainId));
					if (onSuccess && typeof onSuccess === "function") {
						onSuccess({ hash });
						updateQueriesOnCancel({
							orderId,
							queryClient
						});
					}
					setSteps((prev) => ({
						...prev,
						isExecuting: false
					}));
				}
			}
			if (signatureStep) {
				reservoirOrderId = await executeSignature({ signatureStep });
				if (onSuccess && typeof onSuccess === "function") {
					onSuccess({ orderId: reservoirOrderId });
					updateQueriesOnCancel({
						orderId: reservoirOrderId,
						queryClient
					});
				}
				setSteps((prev) => ({
					...prev,
					isExecuting: false
				}));
			}
		} catch (error) {
			invalidateQueriesOnCancel({ queryClient });
			setSteps((prev) => ({
				...prev,
				isExecuting: false
			}));
			if (onError && typeof onError === "function") onError(error);
		}
	};
	const executeTransaction = async ({ transactionStep }) => {
		const hash = await wallet$1?.handleSendTransactionStep(Number(chainId), transactionStep);
		return hash;
	};
	const executeSignature = async ({ signatureStep }) => {
		const signature = await wallet$1?.handleSignMessageStep(signatureStep);
		const result = await marketplaceClient.execute({
			chainId: String(chainId),
			signature,
			method: signatureStep.post?.method,
			endpoint: signatureStep.post?.endpoint,
			body: signatureStep.post?.body,
			executeType: ExecuteType.order
		});
		return result.orderId;
	};
	return { cancelOrder };
};

//#endregion
//#region src/react/hooks/transactions/useCancelOrder.tsx
const useCancelOrder = ({ collectionAddress, chainId, onSuccess, onError }) => {
	const [steps, setSteps] = useState({
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve()
	});
	const [cancellingOrderId, setCancellingOrderId] = useState(null);
	const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
	const autoSelectOptionPromise = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: pendingFeeOptionConfirmation ? {
			id: pendingFeeOptionConfirmation.id,
			options: pendingFeeOptionConfirmation.options?.map((opt) => ({
				...opt,
				token: {
					...opt.token,
					contractAddress: opt.token.contractAddress || null,
					decimals: opt.token.decimals || 0,
					tokenID: opt.token.tokenID || null
				}
			})),
			chainId
		} : {
			id: "",
			options: void 0,
			chainId
		},
		enabled: !!pendingFeeOptionConfirmation
	});
	useEffect(() => {
		autoSelectOptionPromise.then((res) => {
			if (pendingFeeOptionConfirmation?.id && res.selectedOption) confirmPendingFeeOption(pendingFeeOptionConfirmation.id, res.selectedOption.token.contractAddress);
		});
	}, [
		autoSelectOptionPromise,
		confirmPendingFeeOption,
		pendingFeeOptionConfirmation
	]);
	const { cancelOrder: cancelOrderBase } = useCancelTransactionSteps({
		collectionAddress,
		chainId,
		onSuccess: (result) => {
			setCancellingOrderId(null);
			onSuccess?.(result);
		},
		onError: (error) => {
			setCancellingOrderId(null);
			onError?.(error);
		},
		setSteps
	});
	const cancelOrder = async (params) => {
		setCancellingOrderId(params.orderId);
		return cancelOrderBase(params);
	};
	return {
		cancelOrder,
		isExecuting: steps.isExecuting,
		cancellingOrderId
	};
};

//#endregion
//#region src/utils/date.ts
const dateToUnixTime = (date) => Math.floor(date.getTime() / 1e3).toString();

//#endregion
//#region src/react/hooks/transactions/useGenerateListingTransaction.tsx
const generateListingTransaction = async (params, config) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry)
		}
	};
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};
const useGenerateListingTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateListingTransaction({
			...args,
			chainId: params.chainId
		}, config)
	});
	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useGenerateOfferTransaction.tsx
const generateOfferTransaction = async (params, config, walletKind) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		offer: {
			...params.offer,
			expiry: dateToUnixTime(params.offer.expiry)
		},
		walletType: walletKind
	};
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};
const useGenerateOfferTransaction = (params) => {
	const config = useConfig();
	const { wallet: wallet$1 } = useWallet();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateOfferTransaction({
			...args,
			chainId: params.chainId
		}, config, wallet$1?.walletKind)
	});
	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useGenerateSellTransaction.tsx
const generateSellTransaction = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId)
	};
	return marketplaceClient.generateSellTransaction(argsWithStringChainId).then((data) => data.steps);
};
const useGenerateSellTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateSellTransaction({
			...args,
			chainId: params.chainId
		}, config)
	});
	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useOrderSteps.tsx
const useTransactionOperations = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const { switchChainAsync } = useSwitchChain();
	const logger = createLogger("TransactionOperations");
	const switchChain = async (chainId) => {
		logger.debug("Switching chain", { targetChainId: chainId });
		try {
			await switchChainAsync({ chainId });
			logger.info("Chain switch successful", { chainId });
		} catch (e) {
			const error = e;
			logger.error("Chain switch failed", error);
			if (error.name === "UserRejectedRequestError") throw new UserRejectedRequestError();
			throw new ChainSwitchError(0, chainId);
		}
	};
	const signMessage = async (stepItem) => {
		try {
			if (stepItem.id === StepType.signEIP191) {
				logger.debug("Signing with EIP-191", { data: stepItem.data });
				const message = isHex(stepItem.data) ? { raw: stepItem.data } : stepItem.data;
				return await signMessageAsync({ message });
			}
			if (stepItem.id === StepType.signEIP712) {
				logger.debug("Signing with EIP-712", {
					domain: stepItem.domain,
					types: stepItem.signature?.types
				});
				return await signTypedDataAsync({
					domain: stepItem.signature.domain,
					types: stepItem.signature.types,
					primaryType: stepItem.signature.primaryType,
					message: stepItem.signature.value
				});
			}
		} catch (e) {
			const error = e;
			logger.error("Signature failed", error);
			if (error.cause instanceof BaseError) {
				const viemError = error.cause;
				if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
			}
			throw new TransactionSignatureError(stepItem.id, error);
		}
	};
	const sendTransaction = async (chainId, stepItem) => {
		logger.debug("Sending transaction", {
			chainId,
			to: stepItem.to,
			value: stepItem.value
		});
		try {
			return await sendTransactionAsync({
				chainId,
				to: stepItem.to,
				data: stepItem.data,
				value: hexToBigInt(stepItem.value || "0x0"),
				...stepItem.maxFeePerGas && { maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas) },
				...stepItem.maxPriorityFeePerGas && { maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas) },
				...stepItem.gas && { gas: hexToBigInt(stepItem.gas) }
			});
		} catch (e) {
			const error = e;
			logger.error("Transaction failed", error);
			if (error.cause instanceof BaseError) {
				const viemError = error.cause;
				if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
			}
			throw new TransactionExecutionError(stepItem.id || "unknown", error);
		}
	};
	return {
		switchChain,
		signMessage,
		sendTransaction
	};
};
const useOrderSteps = () => {
	const { switchChain, signMessage, sendTransaction } = useTransactionOperations();
	const currentChainId = useChainId();
	const executeStep = async ({ step, chainId }) => {
		if (chainId !== currentChainId) await switchChain(chainId);
		let result;
		switch (step.id) {
			case StepType.signEIP191:
				result = await signMessage(step);
				break;
			case StepType.signEIP712:
				result = await signMessage(step);
				break;
			case StepType.buy:
			case StepType.sell:
			case StepType.tokenApproval:
			case StepType.createListing:
			case StepType.createOffer:
			case StepType.cancel:
				result = await sendTransaction(chainId, step);
				break;
			case StepType.unknown: throw new Error("Unknown step type");
			default: {
				const _exhaustiveCheck = step.id;
				console.error(_exhaustiveCheck);
			}
		}
		return result;
	};
	return { executeStep };
};

//#endregion
//#region src/react/hooks/transactions/useTransferTokens.tsx
const prepareTransferConfig = (params, accountAddress) => {
	if (params.contractType === "ERC721") return {
		abi: erc721Abi,
		address: params.collectionAddress,
		functionName: "safeTransferFrom",
		args: [
			accountAddress,
			params.receiverAddress,
			BigInt(params.tokenId)
		]
	};
	return {
		abi: ERC1155_ABI,
		address: params.collectionAddress,
		functionName: "safeTransferFrom",
		args: [
			accountAddress,
			params.receiverAddress,
			BigInt(params.tokenId),
			params.quantity,
			"0x"
		]
	};
};
const useTransferTokens = () => {
	const { address: accountAddress } = useAccount();
	const { writeContractAsync, data: hash, isPending, isError, isSuccess } = useWriteContract();
	const transferTokensAsync = async (params) => {
		if (!accountAddress) throw new NoWalletConnectedError();
		const config = prepareTransferConfig(params, accountAddress);
		return await writeContractAsync(config);
	};
	return {
		transferTokensAsync,
		hash,
		transferring: isPending,
		transferFailed: isError,
		transferSuccess: isSuccess
	};
};

//#endregion
export { dateToUnixTime, generateCancelTransaction, generateListingTransaction, generateOfferTransaction, generateSellTransaction, useCancelOrder, useCancelTransactionSteps, useGenerateCancelTransaction, useGenerateListingTransaction, useGenerateOfferTransaction, useGenerateSellTransaction, useOrderSteps, useTransferTokens, useWallet };
//# sourceMappingURL=hooks-BbOoucIY.js.map