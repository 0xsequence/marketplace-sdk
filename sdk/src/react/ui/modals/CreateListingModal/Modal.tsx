'use client';

import { observer, Show, use$ } from '@legendapp/state/react';
import * as dnum from 'dnum';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
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
import {
	ActionModal,
	type CtaAction,
} from '../_internal/components/baseModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useCreateListing } from './hooks/useCreateListing';
import { createListingModal$ } from './store';

export const CreateListingModal = () => {
	return <Show if={createListingModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const state = createListingModal$.get();
	const { address } = useAccount();
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

	const collectionConfig = marketplaceConfig?.market.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const orderbookKind =
		orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = createListingModal$.steps;
	const { isWaaS } = useConnectorMetadata();

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
	const collectibleBalanceQuery = useCollectibleBalance({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? undefined,
	});

	const modalLoading =
		collectibleQuery.isLoading ||
		collectionQuery.isLoading ||
		currenciesQuery.isLoading;

	const balanceWithDecimals = collectibleBalanceQuery.data?.balance
		? dnum.toNumber(
				dnum.from([
					BigInt(collectibleBalanceQuery.data?.balance ?? 0),
					collectibleQuery.data?.decimals || 0,
				]),
			)
		: 0;

	const {
		isLoading,
		executeApproval,
		createListing,
		tokenApprovalIsLoading,
		error: createListingError,
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

	const erc20NotConfiguredError =
		!modalLoading &&
		(!currenciesQuery.data || currenciesQuery.data.length === 0)
			? new Error(
					'No ERC-20s are configured for the marketplace, contact the marketplace owners',
				)
			: undefined;

	const handleCreateListing = async () => {
		createListingModal$.listingIsBeingProcessed.set(true);

		try {
			await createListing({
				isTransactionExecuting: !!isWaaS,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
			throw error as Error;
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error('Approve TOKEN failed:', error);
			throw error as Error;
		});
	};

	const primaryAction = {
		label: 'List item for sale',
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

	const queries = {
		collectible: collectibleQuery,
		collection: collectionQuery,
		collectibleBalance: collectibleBalanceQuery,
	};

	return (
		<ActionModal
			chainId={Number(chainId)}
			type="listing"
			onClose={() => {
				createListingModal$.close();
			}}
			title="List item for sale"
			primaryAction={primaryAction}
			secondaryAction={secondaryAction as CtaAction}
			onErrorDismiss={() => {
				createListingModal$.close();
			}}
			queries={queries}
			externalError={createListingError || erc20NotConfiguredError}
			transactionIsBeingProcessed={listingIsBeingProcessed}
			setTransactionIsBeingProcessed={(isBeingProcessed) => {
				createListingModal$.listingIsBeingProcessed.set(isBeingProcessed);
			}}
			onWaasFeeSelectionCancel={() => {
				createListingModal$.listingIsBeingProcessed.set(false);
				steps$.transaction.isExecuting.set(false);
			}}
		>
			{({ collectible, collection, collectibleBalance }) => (
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
					{collection?.type === 'ERC1155' && collectibleBalance.balance && (
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
						/>
					)}
					<ExpirationDateSelect
						date={createListingModal$.expiry.get()}
						onDateChange={(date) => createListingModal$.expiry.set(date)}
					/>
					<TransactionDetails
						collectibleId={collectibleId}
						collectionAddress={collectionAddress}
						chainId={chainId}
						price={createListingModal$.listingPrice.get()}
						currencyImageUrl={listingPrice.currency.imageUrl}
						includeMarketplaceFee={false}
					/>
				</>
			)}
		</ActionModal>
	);
});
