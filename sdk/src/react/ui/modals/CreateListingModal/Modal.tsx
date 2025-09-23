'use client';

import { observer, Show, use$ } from '@legendapp/state/react';
import * as dnum from 'dnum';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import type { ContractType } from '../../../_internal';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useMarketCurrencies,
	useMarketplaceConfig,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useCreateListing } from './hooks/useCreateListing';
import { createListingModal$ } from './store';

export const CreateListingModal = () => {
	return <Show if={createListingModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const state = createListingModal$.get();
	const {
		collectionAddress,
		chainId,
		listingPrice,
		collectibleId,
		orderbookKind,
		callbacks,
		listingIsBeingProcessed,
	} = state;
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const collectionOrderbookKind = collectionConfig?.destinationMarketplace;
	const steps$ = createListingModal$.steps;
	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	const {
		shouldHideActionButton: shouldHideListButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing: listingIsBeingProcessed,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	const {
		data: collectible,
		isLoading: collectableIsLoading,
		isError: collectableIsError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const {
		data: currencies,
		isLoading: currenciesLoading,
		isError: currenciesIsError,
	} = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency: true,
	});
	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const modalLoading =
		collectableIsLoading || collectionIsLoading || currenciesLoading;

	const { address } = useAccount();

	const { data: balance } = useBalanceOfCollectible({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? undefined,
	});
	const balanceWithDecimals = balance?.balance
		? dnum.toNumber(
				dnum.from([BigInt(balance.balance), collectible?.decimals || 0]),
			)
		: 0;

	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading } =
		useCreateListing({
			listingInput: {
				contractType: collection?.type as ContractType,
				listing: {
					tokenId: collectibleId,
					quantity: parseUnits(
						createListingModal$.quantity.get(),
						collectible?.decimals || 0,
					).toString(),
					expiry: dateToUnixTime(createListingModal$.expiry.get()),
					currencyAddress: listingPrice.currency.contractAddress,
					pricePerToken: listingPrice.amountRaw,
				},
			},
			chainId,
			collectionAddress,
			orderbookKind: orderbookKind || collectionOrderbookKind,
			callbacks,
			closeMainModal: () => createListingModal$.close(),
			steps$: steps$,
		});

	if (collectableIsError || collectionIsError || currenciesIsError) {
		return (
			<ErrorModal
				isOpen={createListingModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	if (!modalLoading && (!currencies || currencies.length === 0)) {
		return (
			<ErrorModal
				isOpen={createListingModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={createListingModal$.close}
				title="List item for sale"
				message="No currencies are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	const handleCreateListing = async () => {
		createListingModal$.listingIsBeingProcessed.set(true);

		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await createListing({
				isTransactionExecuting: !!isWaaS,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const listCtaLabel = getActionLabel('List item for sale');

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps$.approval.exist.get(),
			pending: steps$?.approval.isExecuting.get(),
			variant: 'glass' as const,
			disabled:
				createListingModal$.invalidQuantity.get() ||
				listingPrice.amountRaw === '0' ||
				steps$?.approval.isExecuting.get() ||
				tokenApprovalIsLoading ||
				isLoading,
		},
		{
			label: listCtaLabel,
			onClick: handleCreateListing,
			pending:
				steps$?.transaction.isExecuting.get() ||
				createListingModal$.listingIsBeingProcessed.get(),
			testid: 'create-listing-submit-button',
			disabled:
				steps$.approval.exist.get() ||
				tokenApprovalIsLoading ||
				listingPrice.amountRaw === '0' ||
				createListingModal$.invalidQuantity.get() ||
				isLoading ||
				listingIsBeingProcessed,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			isOpen={createListingModal$.isOpen.get()}
			chainId={Number(chainId)}
			onClose={() => {
				createListingModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
			title="List item for sale"
			ctas={ctas}
			modalLoading={modalLoading}
			spinnerContainerClassname="h-[220px]"
			hideCtas={shouldHideListButton}
		>
			<TokenPreview
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>
			<div className="flex w-full flex-col gap-1">
				<PriceInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={listingPrice}
					onPriceChange={(newPrice) => {
						createListingModal$.listingPrice.set(newPrice);
					}}
					onCurrencyChange={(newCurrency) => {
						createListingModal$.listingPrice.currency.set(newCurrency);
					}}
					disabled={shouldHideListButton}
				/>

				{listingPrice.amountRaw !== '0' && (
					<FloorPriceText
						tokenId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={listingPrice}
					/>
				)}
			</div>
			{collection?.type === 'ERC1155' && balance && (
				<QuantityInput
					quantity={use$(createListingModal$.quantity)}
					invalidQuantity={use$(createListingModal$.invalidQuantity)}
					onQuantityChange={(quantity) =>
						createListingModal$.quantity.set(quantity)
					}
					onInvalidQuantityChange={(invalid) =>
						createListingModal$.invalidQuantity.set(invalid)
					}
					decimals={collectible?.decimals || 0}
					maxQuantity={balanceWithDecimals.toString()}
					disabled={shouldHideListButton}
				/>
			)}
			<ExpirationDateSelect
				date={createListingModal$.expiry.get()}
				onDateChange={(date) => createListingModal$.expiry.set(date)}
				disabled={shouldHideListButton}
			/>
			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={createListingModal$.listingPrice.get()}
				currencyImageUrl={listingPrice.currency.imageUrl}
				includeMarketplaceFee={false}
			/>

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						createListingModal$.listingIsBeingProcessed.set(false);
						steps$.transaction.isExecuting.set(false);
					}}
					titleOnConfirm="Processing listing..."
				/>
			)}
		</ActionModal>
	);
});
