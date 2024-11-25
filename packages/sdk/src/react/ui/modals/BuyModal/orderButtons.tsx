'use client';

import React from 'react';

import { ConnectButton } from '~/components/buttons/ConnectButton';
import { NetworkSwitchButton } from '~/components/buttons/NetworkSwitchButton';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { getChain } from '~/config/networks';
import type { OrderWithID } from '~/hooks/orderbook/useOrderbookOrders';
import { useCheckoutOptionsMarketplace } from '~/hooks/transactions/useCheckoutOptionsMarketplace';
import { useERC20Approval } from '~/hooks/transactions/useERC20Approval';
import { useERC721Approval } from '~/hooks/transactions/useERC721Approval';
import { useERC1155Approval } from '~/hooks/transactions/useERC1155Approval';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import { useNetworkSwitch } from '~/hooks/utils/useNetworkSwitch';
import {
	balanceQueries,
	collectableQueries,
	collectionQueries,
} from '~/lib/queries';
import {
	MarketplaceKind,
	TransactionSwapProvider,
} from '~/lib/queries/marketplace/marketplace.gen';
import { Orderbook } from '~/lib/sdk/orderbook/clients/Orderbook';
import {
	onTransactionFinish,
	setTransactionPendingState,
} from '~/lib/stores/Transaction';
import { cartState, toggleCart, resetCart } from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';
import {
	type GenericStep,
	generateStepsOrderbookAcceptRequest,
	type AcceptRequest,
} from '~/lib/utils/txBundler';

import { Button, toast } from '$ui';
import { transactionNotification } from '../../../Notifications/transactionNotification';
import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import { useQueryClient } from '@tanstack/react-query';
import { snapshot, useSnapshot } from 'valtio';
import type { Hex } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import type { GetWalletClientData } from 'wagmi/query';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

interface OrderbookOrderButtonsProps {
	orders: OrderWithID[];
	erc20Address: string;
	erc20Amount: bigint;
	erc20Symbol: string;
	erc20Decimals: number;
	platformFee: bigint;
	frontEndFeeRecipient?: string;
	isLoading: boolean;
	hasMultipleCurrencies: boolean;
	containsInvalidOrder: boolean;
	frontendFeePercentage: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const OrderbookOrderButtons = ({
	orders,
	erc20Amount,
	erc20Address,
	platformFee,
	frontEndFeeRecipient,
	isLoading,
	hasMultipleCurrencies,
	containsInvalidOrder,
}: OrderbookOrderButtonsProps) => {
	const queryClient = useQueryClient();
	const {
		baseOrderInfo: { chainId, orderType: cartType },
		orderData,
		cartItems,
	} = useSnapshot(cartState);
	const isDesktop = useIsMinWidth('@xl');

	const { address: userAddress, isConnected, connector } = useAccount();
	const { data: walletClient } = useWalletClient();
	const { openSelectPaymentModal } = useSelectPaymentModal();

	const { networkMismatch, targetChainId } = useNetworkSwitch({
		targetChainId: chainId,
	});

	const defaultOrder = orders[0]!;
	const collectionAddress = defaultOrder?.tokenContract;

	const erc20ApprovalEnabled = !!erc20Amount && cartType === OrderItemType.BUY;

	const {
		data: erc20Approval,
		isLoading: isErc20ApprovalLoading,
		refetch: refetchErc20Approval,
	} = useERC20Approval({
		spenderAddress: SEQUENCE_MARKET_V1_ADDRESS,
		erc20Address: erc20Address,
		userAddress: userAddress,
		targetAmount: erc20Amount,
		chainId: chainId,
		disabled: !erc20ApprovalEnabled,
	});

	const erc721ApprovalEnabled =
		cartType === OrderItemType.SELL && defaultOrder?.isERC1155 === false;

	const {
		data: erc721Approval,
		isLoading: isErc721ApprovalLoading,
		refetch: refetchERC721Approval,
	} = useERC721Approval({
		operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
		erc721Address: collectionAddress,
		ownerAddress: userAddress,
		chainId: chainId,
		disabled: !erc721ApprovalEnabled,
	});

	const erc1155ApprovalEnabled =
		cartType === OrderItemType.SELL && defaultOrder?.isERC1155 === true;

	const {
		data: erc1155Approval,
		isLoading: isErc1155ApprovalLoading,
		refetch: refetchERC1155Approval,
	} = useERC1155Approval({
		operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
		erc1155Address: collectionAddress,
		ownerAddress: userAddress,
		chainId: chainId,
		disabled: !erc1155ApprovalEnabled,
	});

	const disabledCheckoutOptionsQuery = cartType !== OrderItemType.BUY;

	const { data: checkoutOptions, isLoading: isLoadingCheckoutOptions } =
		useCheckoutOptionsMarketplace(
			{
				chainId: chainId || 137,
				wallet: userAddress || '',
				additionalFee: Number(platformFee) * cartItems.length,
				orders: cartItems.map((cartItem) => ({
					contractAddress: cartItem.collectibleMetadata.collectionAddress,
					marketplace: MarketplaceKind.sequence_marketplace_v1,
					orderId: cartItem.orderId || '',
				})),
			},
			{
				disabled: disabledCheckoutOptionsQuery,
			},
		);

	if (!cartItems.length || !chainId || orders.length === 0) {
		return null;
	}

	if (hasMultipleCurrencies) {
		return <Button className="w-full" label="Disabled" disabled />;
	}

	const postTransactionCacheClear = () => {
		void queryClient.invalidateQueries({ queryKey: collectableQueries.all() });
		void queryClient.invalidateQueries({ queryKey: collectionQueries.all() });
		void queryClient.invalidateQueries({ queryKey: balanceQueries.all() });
	};

	if (!isConnected) {
		return (
			<ConnectButton
				variant="default"
				className="w-full"
				onClick={() => {
					if (!isDesktop) {
						toggleCart();
					}
				}}
			/>
		);
	}

	if (containsInvalidOrder) {
		return <Button className="w-full" label="Invalid Order" disabled />;
	}

	if (
		(erc20ApprovalEnabled && isErc20ApprovalLoading) ||
		(erc721ApprovalEnabled && isErc721ApprovalLoading) ||
		(erc1155ApprovalEnabled && isErc1155ApprovalLoading) ||
		(!disabledCheckoutOptionsQuery && isLoadingCheckoutOptions) ||
		isLoading ||
		!orderData
	) {
		return <Button className="w-full" label="estimating" disabled />;
	}

	const requiresErc721Approval =
		erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false;

	const requiresErc1155Approval =
		erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false;

	const requiresApproval = requiresErc721Approval || requiresErc1155Approval;

	const { steps, isBundled } = generateStepsOrderbookAcceptRequest({
		connectorId: connector?.id,
		tokenContract: collectionAddress,
		currency: erc20Address as Hex,
		chainId,
		isERC1155: defaultOrder?.isERC1155 === true,
		isListing: cartType === OrderItemType.BUY,
		isApproved: !requiresApproval,
		walletClient: walletClient as GetWalletClientData<any, any> | undefined,
	});

	const renderERC1155ApprovalButton = () => {
		const onApprove = async () => {
			if (!walletClient || !collectionAddress) return;

			const approveStep = steps.find((s) => s.id === 'approveERC1155') as
				| GenericStep
				| undefined;
			if (!approveStep) return;

			setTransactionPendingState(true);
			try {
				const txnHash = await approveStep.action();

				await transactionNotification({
					network: getChain(chainId)!,
					txHash: txnHash,
				});

				await refetchERC1155Approval();
			} catch (error) {
				console.error(error);
				toast.error('Error approving token');
			} finally {
				setTransactionPendingState(false);
			}
		};

		if (erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false) {
			return (
				<Button
					className="w-full"
					label={`Approve Collection`}
					variant="secondary"
					onClick={onApprove}
				/>
			);
		}
	};

	const renderERC721ApprovalButton = () => {
		const onApprove = async () => {
			if (!walletClient || !collectionAddress) return;

			const approveStep = steps.find((s) => s.id === 'approveERC721') as
				| GenericStep
				| undefined;
			if (!approveStep) return;

			setTransactionPendingState(true);
			try {
				const txnHash = await approveStep.action();

				await transactionNotification({
					network: getChain(chainId)!,
					txHash: txnHash,
				});

				await refetchERC721Approval();
			} catch (error) {
				console.error(error);
				toast.error('Error approving token');
			} finally {
				setTransactionPendingState(false);
			}
		};

		if (erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false) {
			return (
				<Button
					className="w-full"
					label={`Approve Collection`}
					variant="secondary"
					onClick={onApprove}
				/>
			);
		}
	};

	const buyAction = () => {
		if (!userAddress) {
			return;
		}

		const orderbook = new Orderbook({
			chainId,
			contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
		});

		const transactionData = orderbook.acceptRequestBatch_data({
			orderIds: cartItems.map((cartItem) => BigInt(cartItem.orderId || 0)),
			quantities: cartItems.map((cartItem) => cartItem.quantity),
			receivers: cartItems.map(() => userAddress),
			additionalFees: cartItems.map(() => platformFee),
			additionalFeeReceivers: cartItems.map(() => frontEndFeeRecipient as Hex),
		});

		openSelectPaymentModal({
			chain: chainId,
			collectibles: cartItems.map((cartItem) => {
				const decimals = cartItem.collectibleMetadata.decimals || 0;
				return {
					tokenId: cartItem.collectibleMetadata.tokenId,
					quantity: cartItem.quantity.toString(),
					decimals: String(decimals),
				};
			}),
			currencyAddress: erc20Address,
			price: erc20Amount.toString(),
			targetContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
			txData: transactionData,
			collectionAddress,
			recipientAddress: userAddress,
			onSuccess: (txnHash: string) => {
				transactionNotification({
					network: getChain(chainId)!,
					txHash: txnHash,
				})
					.then(() => {
						postTransactionCacheClear();

						onTransactionFinish({
							transactionId: txnHash,
							cartItems: snapshot(cartState.cartItems),
							cartType: cartType,
						});

						resetCart();
					})
					.catch((e) => console.error(e));
			},
			onError: (error: Error) => {
				showErrorToast(error);
			},
			enableMainCurrencyPayment: true,
			enableSwapPayments:
				checkoutOptions?.options.swap?.includes(
					TransactionSwapProvider.zerox,
				) || false,
			creditCardProviders: checkoutOptions?.options.nftCheckout,
		});
	};

	const sellAction = async () => {
		if (!walletClient || !orderData) return;

		const acceptOrderStep = steps.find((s) => s.id === 'acceptRequestBatch');
		if (!acceptOrderStep) return;

		setTransactionPendingState(true);

		try {
			const txnHash = await acceptOrderStep.action({
				acceptRequests: cartItems.map((item) => ({
					orderId: item.orderId!,
					quantity: item.quantity,
					address: userAddress || '',
					tokenId: item.collectibleMetadata.tokenId,
					additionalFees: [BigInt(platformFee?.toString() || 0n)],
					additionalFeeRecipients: [frontEndFeeRecipient as Hex],
				})) as [AcceptRequest, ...AcceptRequest[]],
			});

			await transactionNotification({
				network: getChain(chainId)!,
				txHash: txnHash,
			});

			postTransactionCacheClear();

			onTransactionFinish({
				transactionId: txnHash,
				cartItems: snapshot(cartState.cartItems),
				cartType: cartType,
			});

			resetCart();
		} catch (error: any) {
			const errorMessage =
				error instanceof Error ? error.message : 'unknown error';
			showErrorToast(error);
		}

		setTransactionPendingState(false);
	};

	const renderOrderButton = () => {
		const onBuyClick = () => {
			void buyAction();
		};

		const onSellClick = () => {
			void sellAction();
		};

		switch (cartType) {
			case OrderItemType.BUY:
				return <Button className="w-full" label={`BUY`} onClick={onBuyClick} />;
			case OrderItemType.SELL:
				return (
					<Button
						className="w-full"
						label={`SELL`}
						onClick={onSellClick}
						disabled={!isBundled && requiresApproval}
					/>
				);
			default:
				break;
		}
	};

	if (networkMismatch) {
		return <NetworkSwitchButton targetChainId={targetChainId} />;
	}

	return (
		<>
			{/* {!isBundled && renderCurrencyApprovalButton()} */}
			{!isBundled && renderERC1155ApprovalButton()}
			{!isBundled && renderERC721ApprovalButton()}
			{renderOrderButton()}
		</>
	);
};

const showErrorToast = (error: any) => {
	// https://github.com/MetaMask/rpc-errors/blob/main/src/error-constants.ts
	console.log('TRANSACTION ERROR CODE:', error?.code, error);

	switch (error?.code) {
		case 'ACTION_REJECTED':
		case 4001: {
			toast.error('User has rejected the Transaction!');
			break;
		}
		case -32003: {
			toast.error('User has rejected the transaction!');
			break;
		}
		default: {
			toast.error(error?.message?.substring(0, 100));
		}
	}
};
