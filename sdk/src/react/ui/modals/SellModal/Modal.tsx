'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { parseUnits } from 'viem';
import type { Price } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { useCollection, useCurrency } from '../../../hooks';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	hide as hideSelectWaasFeeOptions,
	selectWaasFeeOptions$,
	useIsVisible as useSelectWaasFeeOptionsIsVisible,
	useSelectedFeeOption,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useSell } from './hooks/useSell';
import {
	sellModal,
	sellModalStore,
	useIsOpen,
	useModalState,
	useOrder,
	useSellIsBeingProcessed,
	useSteps,
} from './store';

export const SellModal = () => {
	const isOpen = useIsOpen();
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const state = useModalState();
	const { tokenId, collectionAddress, chainId, callbacks } = state;
	const order = useOrder();
	const steps = useSteps();
	const sellIsBeingProcessed = useSellIsBeingProcessed();
	const { data: collectible } = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress ?? '',
	});
	const { wallet } = useWallet();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = sellIsBeingProcessed;
	const isWaaS = wallet?.isWaaS;
	const feeOptionsVisible = useSelectWaasFeeOptionsIsVisible();
	const selectedFeeOption = useSelectedFeeOption();
	const { shouldHideActionButton: shouldHideSellButton } =
		useSelectWaasFeeOptions({
			isProcessing,
			feeOptionsVisible,
			selectedFeeOption: selectedFeeOption as FeeOption,
		});

	const { isLoading, executeApproval, sell } = useSell({
		collectionAddress,
		chainId,
		collectibleId: tokenId,
		marketplace: order?.marketplace as MarketplaceKind,
		ordersData: [
			{
				orderId: order?.orderId ?? '',
				quantity: order?.quantityRemaining
					? parseUnits(
							order.quantityRemaining,
							collectible?.decimals || 0,
						).toString()
					: '1',
				pricePerToken: order?.priceAmount ?? '',
				currencyAddress: order?.priceCurrencyAddress ?? '',
			},
		],
		callbacks,
		closeMainModal: () => sellModal.close(),
		steps,
		onStepsUpdate: (updates) => {
			const current = sellModalStore.getSnapshot().context.steps;
			sellModalStore.send({
				type: 'setSteps',
				steps: { ...current, ...updates },
			});
		},
	});
	const modalLoading = collectionLoading || currencyLoading;

	if (
		(collectionError || order === undefined || currencyError) &&
		!modalLoading
	) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={sellModal.close}
				title="You have an offer"
			/>
		);
	}

	const handleSell = async () => {
		sellModalStore.send({
			type: 'setSellIsBeingProcessed',
			isProcessing: true,
		});

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: true });
			}

			await sell({
				isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModalStore.send({
				type: 'setSellIsBeingProcessed',
				isProcessing: false,
			});
			sellModalStore.send({
				type: 'setTransactionExecuting',
				isExecuting: false,
			});
		}
	};

	// if it's testnet, we don't need to show the fee options
	const sellCtaLabel = isProcessing
		? isWaaS && !isTestnet
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps.approval.exist,
			pending: steps.approval.isExecuting,
			variant: 'glass' as const,
			disabled: isLoading || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending: steps?.transaction.isExecuting || sellIsBeingProcessed,
			disabled:
				isLoading ||
				steps.approval.isExecuting ||
				steps.approval.exist ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions =
		wallet?.isWaaS && sellIsBeingProcessed && feeOptionsVisible;

	return (
		<ActionModal
			isOpen={true}
			chainId={Number(chainId)}
			onClose={() => {
				sellModal.close();
				hideSelectWaasFeeOptions();
				sellModalStore.send({
					type: 'setTransactionExecuting',
					isExecuting: false,
				});
			}}
			title="You have an offer"
			ctas={ctas}
			modalLoading={modalLoading}
			spinnerContainerClassname="h-[104px]"
			hideCtas={shouldHideSellButton}
		>
			<TransactionHeader
				title="Offer received"
				currencyImageUrl={currency?.imageUrl}
				date={order && new Date(order.createdAt)}
			/>
			<TokenPreview
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={tokenId}
				chainId={chainId}
			/>
			<TransactionDetails
				collectibleId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				includeMarketplaceFee={true}
				price={
					currency
						? ({
								amountRaw: order?.priceAmount,
								currency,
							} as Price)
						: undefined
				}
				currencyImageUrl={currency?.imageUrl}
			/>

			{showWaasFeeOptions && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						sellModalStore.send({
							type: 'setSellIsBeingProcessed',
							isProcessing: false,
						});
						sellModalStore.send({
							type: 'setTransactionExecuting',
							isExecuting: false,
						});
					}}
					titleOnConfirm="Accepting offer..."
				/>
			)}
		</ActionModal>
	);
};
