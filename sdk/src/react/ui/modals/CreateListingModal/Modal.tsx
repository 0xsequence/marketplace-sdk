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
	useMarketCurrencies,
	useMarketplaceConfig,
} from '../../../hooks';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { ErrorModal } from '../_internal/components/baseModal';
import {
	ActionModal,
	type CtaAction,
} from '../_internal/components/baseModal/ActionModal';
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

	const collectibleQuery = useCollectibleDetail({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const currenciesQuery = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency: true,
	});
	const collectionQuery = useCollectionDetail({
		chainId,
		collectionAddress,
	});

	const modalLoading =
		collectibleQuery.isLoading ||
		collectionQuery.isLoading ||
		currenciesQuery.isLoading;

	const { address } = useAccount();

	const { data: balance } = useCollectibleBalance({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? undefined,
	});
	const balanceWithDecimals = balance?.balance
		? dnum.toNumber(
				dnum.from([
					BigInt(balance.balance),
					collectibleQuery.data?.decimals || 0,
				]),
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
			contractType: collectionQuery.data?.type as ContractType,
			listing: {
				tokenId: collectibleId,
				quantity: parseUnits(
					createListingModal$.quantity.get(),
					collectibleQuery.data?.decimals || 0,
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
		!modalLoading &&
		(!currenciesQuery.data || currenciesQuery.data.length === 0)
	) {
		return (
			<ErrorModal
				onClose={createListingModal$.close}
				title="List item for sale"
				chainId={Number(chainId)}
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

	const queries = {
		collectible: collectibleQuery,
		collection: collectionQuery,
	};
	const activeError =
		error ||
		((collectibleQuery.error ||
			collectionQuery.error ||
			currenciesQuery.error ||
			tokenApprovalIsError) as Error | undefined);

	const primaryAction = {
		label: listCtaLabel,
		actionName: 'listing',
		onClick: handleCreateListing,
		loading:
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
	};

	const secondaryAction = {
		label: 'Approve TOKEN',
		actionName: 'collectible spending approval',
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		loading: steps$?.approval.isExecuting.get(),
		variant: 'secondary' as const,
		disabled:
			createListingModal$.invalidQuantity.get() ||
			listingPrice.amountRaw === '0' ||
			steps$?.approval.isExecuting.get() ||
			tokenApprovalIsLoading ||
			isLoading,
	};

	return (
		<ActionModal
			chainId={Number(chainId)}
			type="listing"
			onClose={() => {
				createListingModal$.close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
			title="List item for sale"
			primaryAction={shouldHideListButton ? undefined : primaryAction}
			secondaryAction={
				shouldHideListButton ? undefined : (secondaryAction as CtaAction)
			}
			queries={queries}
			externalError={activeError}
		>
			{({ collectible, collection }) => (
				<>
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
							onCancel={() => {
								createListingModal$.listingIsBeingProcessed.set(false);
								steps$.transaction.isExecuting.set(false);
							}}
							titleOnConfirm="Processing listing..."
						/>
					)}
				</>
			)}
		</ActionModal>
	);
});
