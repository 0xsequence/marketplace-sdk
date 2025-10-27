'use client';

import { NetworkType } from '@0xsequence/network';
import { observer, Show } from '@legendapp/state/react';
import { useState } from 'react';
import { type Address, parseUnits } from 'viem';
import type { Price } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import { getNetwork } from '../../../../utils/network';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import { useCollection } from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { useCurrency } from '../../../hooks/data/market/useCurrency';
import { ErrorModal } from '../_internal/components/baseModal';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useSell } from './hooks/useSell';
import { sellModal$ } from './store';

export const SellModal = () => {
	return <Show if={sellModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const { tokenId, collectionAddress, chainId, order, callbacks } =
		sellModal$.get();
	const steps$ = sellModal$.steps;
	const { data: collectible } = useCollection({
		chainId,
		collectionAddress,
	});
	const [error, setError] = useState<Error | undefined>(undefined);

	const collectionQuery = useCollection({
		chainId,
		collectionAddress,
	});
	const currencyQuery = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress as Address | undefined,
	});
	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = sellModal$.sellIsBeingProcessed.get();
	const { shouldHideActionButton: shouldHideSellButton } =
		useSelectWaasFeeOptions({
			isProcessing,
			feeOptionsVisible,
			selectedFeeOption: selectedFeeOption as FeeOption,
		});

	const { isLoading, executeApproval, sell, isError } = useSell({
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
		closeMainModal: () => sellModal$.close(),
		steps$: steps$,
	});
	const modalLoading = collectionQuery.isLoading || currencyQuery.isLoading;

	if (
		(collectionQuery.isError ||
			order === undefined ||
			currencyQuery.isError ||
			isError) &&
		!modalLoading
	) {
		return (
			<ErrorModal
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
				error={error}
				message={error?.message}
				onRetry={() => {
					sellModal$.close();
				}}
				onErrorAction={(error, action) => {
					console.error(error, action);
				}}
			/>
		);
	}

	const handleSell = async () => {
		sellModal$.sellIsBeingProcessed.set(true);

		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await sell({
				isTransactionExecuting: isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModal$.sellIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error('Approve TOKEN failed:', error);
			setError(error as Error);
		});
	};

	// if it's testnet, we don't need to show the fee options
	const sellCtaLabel = isProcessing
		? isWaaS && !isTestnet
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	const primaryAction = {
		label: sellCtaLabel,
		onClick: () => handleSell(),
		loading:
			steps$?.transaction.isExecuting.get() ||
			sellModal$.sellIsBeingProcessed.get(),
		disabled:
			isLoading ||
			steps$.approval.isExecuting.get() ||
			steps$.approval.exist.get() ||
			order?.quantityRemaining === '0' ||
			sellModal$.sellIsBeingProcessed.get(),
	};

	const secondaryAction = steps$.approval.exist.get()
		? {
				label: 'Approve TOKEN',
				onClick: handleApproveToken,
				loading: steps$.approval.isExecuting.get(),
				disabled:
					isLoading ||
					order?.quantityRemaining === '0' ||
					sellModal$.sellIsBeingProcessed.get(),
			}
		: undefined;

	const showWaasFeeOptions =
		isWaaS && sellModal$.sellIsBeingProcessed.get() && feeOptionsVisible;

	return (
		<ActionModal
			chainId={Number(chainId)}
			onClose={() => {
				sellModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
				steps$.transaction.isExecuting.set(false);
			}}
			title="You have an offer"
			primaryAction={shouldHideSellButton ? undefined : primaryAction}
			secondaryAction={shouldHideSellButton ? undefined : secondaryAction}
			queries={{
				collection: collectionQuery,
				currency: currencyQuery,
			}}
		>
			{({ collection, currency }) => (
				<div className="flex w-full flex-col gap-4">
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
								sellModal$.sellIsBeingProcessed.set(false);
								steps$.transaction.isExecuting.set(false);
							}}
							titleOnConfirm="Accepting offer..."
						/>
					)}
				</div>
			)}
		</ActionModal>
	);
});
