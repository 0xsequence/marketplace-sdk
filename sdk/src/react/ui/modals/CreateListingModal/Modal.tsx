'use client';

import { observer, Show, use$ } from '@legendapp/state/react';
import * as dnum from 'dnum';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import type { ContractType } from '../../../_internal';
import {
	useCollectibleBalance,
	useCollectibleDetail,
	useCollectionDetail,
	useCurrencyList,
	useMarketplaceConfig,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { ErrorLogBox } from '../../components/_internals/ErrorLogBox';
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
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useWaasFeeSelection } from '../_internal/hooks/useWaasFeeSelection';
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
		orderbookKind: orderbookKindProp,
		callbacks,
		listingIsBeingProcessed,
	} = state;
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const [error, setError] = useState<Error | undefined>(undefined);

	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const orderbookKind =
		orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = createListingModal$.steps;
	const { isWaaS } = useConnectorMetadata();

	const waasFees = useWaasFeeSelection({
		onCancel: () => {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		},
	});

	const {
		shouldHideActionButton: shouldHideListButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing: listingIsBeingProcessed,
		feeOptionsVisible: waasFees.isVisible,
		selectedFeeOption: waasFees.selectedFeeOption as FeeOption,
	});

	const {
		data: collectible,
		isLoading: collectableIsLoading,
		isError: collectableIsError,
	} = useCollectibleDetail({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const {
		data: currencies,
		isLoading: currenciesLoading,
		isError: currenciesIsError,
	} = useCurrencyList({
		chainId,
		collectionAddress,
		includeNativeCurrency: true,
	});
	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollectionDetail({
		chainId,
		collectionAddress,
	});
	const modalLoading =
		collectableIsLoading || collectionIsLoading || currenciesLoading;

	const { address } = useAccount();

	const { data: balance } = useCollectibleBalance({
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

	const {
		isLoading,
		executeApproval,
		createListing,
		tokenApprovalIsLoading,
		isError: tokenApprovalIsError,
	} = useCreateListing({
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
		orderbookKind,
		callbacks,
		closeMainModal: () => createListingModal$.close(),
		steps$: steps$,
	});

	if (
		collectableIsError ||
		collectionIsError ||
		currenciesIsError ||
		tokenApprovalIsError
	) {
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
			await createListing({
				isTransactionExecuting: !!isWaaS,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
			setError(error as Error);
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error('Approve TOKEN failed:', error);
			setError(error as Error);
		});
	};

	const listCtaLabel = getActionLabel('List item for sale');

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: handleApproveToken,
			hidden: !steps$.approval.exist.get(),
			pending: steps$?.approval.isExecuting.get(),
			variant: 'secondary',
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
				waasFees.reset();
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
					orderbookKind={orderbookKind}
					modalType="listing"
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
					waasFees={waasFees}
					titleOnConfirm="Processing listing..."
				/>
			)}

			{error && (
				<ErrorLogBox
					title="An error occurred while listing"
					message="Please try again"
					error={error}
				/>
			)}
		</ActionModal>
	);
});
