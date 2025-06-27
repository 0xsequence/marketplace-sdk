'use client';

import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Currency } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import { dateToUnixTime } from '../../../../utils/date';
import type { ContractType } from '../../../_internal';
import { useWallet } from '../../../_internal/wallet/useWallet';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useMarketCurrencies,
} from '../../../hooks';
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
import {
	createListingModalStore,
	useCreateListingState,
	useExpiry,
	useInvalidQuantity,
	useIsOpen,
	useQuantity,
	useSteps,
} from './store';

export const CreateListingModal = () => {
	const isOpen = useIsOpen();
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const state = useCreateListingState();
	const {
		collectionAddress,
		chainId,
		listingPrice,
		collectibleId,
		orderbookKind,
		callbacks,
		listingIsBeingProcessed,
	} = state;
	const steps = useSteps();
	const { wallet } = useWallet();
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

	const quantity = useQuantity();
	const expiry = useExpiry();

	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading } =
		useCreateListing({
			listingInput: {
				contractType: collection?.type as ContractType,
				listing: {
					tokenId: collectibleId,
					quantity: parseUnits(quantity, collectible?.decimals || 0).toString(),
					expiry: dateToUnixTime(expiry),
					currencyAddress: listingPrice.currency.contractAddress,
					pricePerToken: listingPrice.amountRaw,
				},
			},
			chainId,
			collectionAddress,
			orderbookKind,
			callbacks,
			closeMainModal: () => createListingModalStore.send({ type: 'close' }),
			steps: steps,
		});

	const isOpen = useIsOpen();

	if (collectableIsError || collectionIsError || currenciesIsError) {
		return (
			<ErrorModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={() => createListingModalStore.send({ type: 'close' })}
				title="List item for sale"
			/>
		);
	}

	if (!modalLoading && (!currencies || currencies.length === 0)) {
		return (
			<ErrorModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={() => createListingModalStore.send({ type: 'close' })}
				title="List item for sale"
				message="No currencies are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	const handleCreateListing = async () => {
		createListingModalStore.send({
			type: 'setListingProcessing',
			processing: true,
		});

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await createListing({
				isTransactionExecuting: !!wallet?.isWaaS,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
		} finally {
			createListingModalStore.send({
				type: 'setListingProcessing',
				processing: false,
			});
			createListingModalStore.send({
				type: 'setTransactionExecuting',
				executing: false,
			});
		}
	};

	const listCtaLabel = getActionLabel('List item for sale');

	const invalidQuantity = useInvalidQuantity();

	// Stable callback handlers to prevent infinite loops
	const handlePriceChange = useCallback(
		(newPrice: { amountRaw: string; currency: Currency }) => {
			createListingModalStore.send({
				type: 'updateListingPrice',
				price: newPrice,
			});
		},
		[],
	);

	const handleCurrencyChange = useCallback((newCurrency: Currency) => {
		createListingModalStore.send({
			type: 'updateCurrency',
			currency: newCurrency,
		});
	}, []);

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps.approval.exist,
			pending: steps?.approval.isExecuting,
			variant: 'glass' as const,
			disabled:
				invalidQuantity ||
				listingPrice.amountRaw === '0' ||
				steps?.approval.isExecuting ||
				tokenApprovalIsLoading ||
				isLoading,
		},
		{
			label: listCtaLabel,
			onClick: handleCreateListing,
			pending: steps?.transaction.isExecuting || listingIsBeingProcessed,
			testid: 'create-listing-submit-button',
			disabled:
				steps.approval.exist ||
				tokenApprovalIsLoading ||
				listingPrice.amountRaw === '0' ||
				invalidQuantity ||
				isLoading ||
				listingIsBeingProcessed,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			isOpen={isOpen}
			chainId={Number(chainId)}
			onClose={() => {
				createListingModalStore.send({ type: 'close' });
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
					onPriceChange={handlePriceChange}
					onCurrencyChange={handleCurrencyChange}
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
					quantity={quantity}
					invalidQuantity={invalidQuantity}
					onQuantityChange={(quantity) =>
						createListingModalStore.send({
							type: 'updateQuantity',
							quantity,
						})
					}
					onInvalidQuantityChange={(invalid) =>
						createListingModalStore.send({
							type: 'setInvalidQuantity',
							invalid,
						})
					}
					decimals={collectible?.decimals || 0}
					maxQuantity={balance?.balance}
					disabled={shouldHideListButton}
				/>
			)}
			<ExpirationDateSelect
				date={expiry}
				onDateChange={(date) =>
					createListingModalStore.send({
						type: 'updateExpiry',
						expiry: date,
					})
				}
				disabled={shouldHideListButton}
			/>
			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={listingPrice}
				currencyImageUrl={listingPrice.currency.imageUrl}
				includeMarketplaceFee={false}
			/>

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						createListingModalStore.send({
							type: 'setListingProcessing',
							processing: false,
						});
						createListingModalStore.send({
							type: 'setTransactionExecuting',
							executing: false,
						});
					}}
					titleOnConfirm="Processing listing..."
				/>
			)}
		</ActionModal>
	);
};
