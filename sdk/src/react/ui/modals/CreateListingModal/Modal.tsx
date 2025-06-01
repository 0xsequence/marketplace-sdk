'use client';

import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
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
	hide as hideSelectWaasFeeOptions,
	selectWaasFeeOptions$,
	useIsVisible as useSelectWaasFeeOptionsIsVisible,
	useSelectedFeeOption,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useCreateListing } from './hooks/useCreateListing';
import {
	createListingModal,
	createListingModalStore,
	useExpiry,
	useInvalidQuantity,
	useIsOpen,
	useListingIsBeingProcessed,
	useListingPrice,
	useModalState,
	useQuantity,
	useSteps,
} from './store';

export const CreateListingModal = () => {
	const isOpen = useIsOpen();
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const state = useModalState();
	const {
		collectionAddress,
		chainId,
		collectibleId,
		orderbookKind,
		callbacks,
	} = state;
	const listingPrice = useListingPrice();
	const listingIsBeingProcessed = useListingIsBeingProcessed();
	const steps = useSteps();
	const quantity = useQuantity();
	const invalidQuantity = useInvalidQuantity();
	const expiry = useExpiry();
	const { wallet } = useWallet();
	const feeOptionsVisible = useSelectWaasFeeOptionsIsVisible();
	const selectedFeeOption = useSelectedFeeOption();

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
			closeMainModal: () => createListingModal.close(),
			steps,
			onStepsUpdate: (updates) => {
				const current = createListingModalStore.getSnapshot().context.steps;
				createListingModalStore.send({
					type: 'setSteps',
					steps: { ...current, ...updates },
				});
			},
		});

	if (collectableIsError || collectionIsError || currenciesIsError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={createListingModal.close}
				title="List item for sale"
			/>
		);
	}

	if (!modalLoading && (!currencies || currencies.length === 0)) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={createListingModal.close}
				title="List item for sale"
				message="No currencies are configured for the marketplace, contact the marketplace owners"
			/>
		);
	}

	const handleCreateListing = async () => {
		createListingModalStore.send({
			type: 'setListingIsBeingProcessed',
			isProcessing: true,
		});

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: true });
			}

			await createListing({
				isTransactionExecuting: !!wallet?.isWaaS,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
		} finally {
			createListingModalStore.send({
				type: 'setListingIsBeingProcessed',
				isProcessing: false,
			});
			createListingModalStore.send({
				type: 'setTransactionExecuting',
				isExecuting: false,
			});
		}
	};

	const listCtaLabel = getActionLabel('List item for sale');

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
			isOpen={true}
			chainId={Number(chainId)}
			onClose={() => {
				createListingModal.close();
				hideSelectWaasFeeOptions();
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
					onPriceChange={(newPrice) =>
						createListingModalStore.send({
							type: 'setListingPrice',
							...newPrice,
						})
					}
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
					onQuantityChange={(newQuantity) =>
						createListingModalStore.send({
							type: 'setQuantity',
							quantity: newQuantity,
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
				onDateChange={(newDate) =>
					createListingModalStore.send({ type: 'setExpiry', expiry: newDate })
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
							type: 'setListingIsBeingProcessed',
							isProcessing: false,
						});
						createListingModalStore.send({
							type: 'setTransactionExecuting',
							isExecuting: false,
						});
					}}
					titleOnConfirm="Processing listing..."
				/>
			)}
		</ActionModal>
	);
};
