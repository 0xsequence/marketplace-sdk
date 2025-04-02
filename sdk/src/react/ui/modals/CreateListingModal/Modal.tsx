'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { Show, observer } from '@legendapp/state/react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../utils/date';
import type { ContractType } from '../../../_internal';
import { useWallet } from '../../../_internal/wallet/useWallet';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useCurrencies,
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
import { waasFeeOptionsModal$ } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
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
	const steps$ = createListingModal$.steps;
	const { wallet } = useWallet();
	const feeOptionsVisible = waasFeeOptionsModal$.isVisible.get();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = createListingModal$.listingIsBeingProcessed.get();
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const selectedFeeOption = waasFeeOptionsModal$.selectedFeeOption.get();
	const shouldHideListButton =
		!isTestnet &&
		isProcessingWithWaaS &&
		feeOptionsVisible === true &&
		!!selectedFeeOption;

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
	} = useCurrencies({
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
		chainId: Number(chainId),
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
			if (wallet?.isWaaS) {
				waasFeeOptionsModal$.isVisible.set(true);
			}

			await createListing({
				isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Create listing failed:', error);
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};

	const listCtaLabel = isProcessing
		? isWaaS && !isTestnet
			? 'Loading fee options'
			: 'List item for sale'
		: 'List item for sale';
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

	const showWaasFeeOptions =
		wallet?.isWaaS && listingIsBeingProcessed && feeOptionsVisible;

	return (
		<ActionModal
			isOpen={createListingModal$.isOpen.get()}
			chainId={Number(chainId)}
			onClose={() => {
				createListingModal$.close();
				waasFeeOptionsModal$.hide();
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
					$price={createListingModal$.listingPrice}
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
					$quantity={createListingModal$.quantity}
					$invalidQuantity={createListingModal$.invalidQuantity}
					decimals={collectible?.decimals || 0}
					maxQuantity={balance?.balance}
					disabled={shouldHideListButton}
				/>
			)}
			<ExpirationDateSelect
				$date={createListingModal$.expiry}
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

			{showWaasFeeOptions && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						createListingModal$.listingIsBeingProcessed.set(false);
						steps$.transaction.isExecuting.set(false);
						waasFeeOptionsModal$.hide();
					}}
					titleOnConfirm="Processing listing..."
				/>
			)}
		</ActionModal>
	);
});
