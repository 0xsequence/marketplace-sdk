import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { collectableKeys } from '../../../_internal';
import { type ContractType, StepType } from '../../../_internal';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
} from '../../../hooks';
import { useCreateListing, type Steps } from '../../../hooks/useCreateListing';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { createListingModal$ } from './store';
import { dateToUnixTime } from '../../../../utils/date';
import { useGetTokenApprovalData } from './hooks/useGetTokenApproval';

type TransactionStatusModalReturn = ReturnType<
	typeof useTransactionStatusModal
>;

export const CreateListingModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={createListingModal$.isOpen}>
			{() => <Modal showTransactionStatusModal={showTransactionStatusModal} />}
		</Show>
	);
};

const Modal = observer(
	({
		showTransactionStatusModal,
	}: {
		showTransactionStatusModal: TransactionStatusModalReturn['show'];
	}) => {
		const state = createListingModal$.get();
		const {
			collectionAddress,
			chainId,
			listingPrice,
			collectibleId,
			orderbookKind,
			callbacks,
		} = state;
		const currencyAddress = listingPrice.currency.contractAddress;

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
			data: collection,
			isLoading: collectionIsLoading,
			isError: collectionIsError,
		} = useCollection({
			chainId,
			collectionAddress,
		});
		const [approvalExecutedSuccess, setApprovalExecutedSuccess] =
			useState(false);

		const { address } = useAccount();

		const { data: balance } = useBalanceOfCollectible({
			chainId,
			collectionAddress,
			collectableId: collectibleId,
			userAddress: address ?? undefined,
		});

		const { data: tokenApproval, isLoading: tokenApprovalIsLoading } =
			useGetTokenApprovalData({
				chainId,
				tokenId: collectibleId,
				collectionAddress,
				currencyAddress,
				contractType: collection?.type as ContractType,
				orderbook: orderbookKind,
			});

		const { getListingSteps, isLoading: machineLoading } = useCreateListing({
			orderbookKind,
			chainId,
			collectionAddress,
			enabled: createListingModal$.isOpen.get(),
			onApprovalSuccess: () => setApprovalExecutedSuccess(true),
			onTransactionSent: (hash, orderId) => {
				if (!hash && !orderId) return;

				showTransactionStatusModal({
					hash,
					orderId,
					collectionAddress,
					chainId,
					price: createListingModal$.listingPrice.get(),
					collectibleId,
					type: TransactionType.LISTING,
					queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
					callbacks,
				});
				createListingModal$.close();
			},
		});

		const [steps, setSteps] = useState<Steps | null>(null);

		const handleStepExecution = async (step: StepType) => {
			if (!step) return;
			try {
				const { steps } = await getListingSteps({
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
				});
				setSteps(steps);

				if (step === StepType.tokenApproval) {
					await steps?.approval.execute();
				}

				if (step === StepType.createListing) {
					await steps?.transaction.execute();
				}
			} catch (error) {
				if (callbacks?.onError) {
					callbacks.onError(error as Error);
				} else {
					console.debug('onError callback not provided:', error);
				}
			}
		};

		if (collectableIsLoading || collectionIsLoading || machineLoading) {
			return (
				<LoadingModal
					isOpen={createListingModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={createListingModal$.close}
					title="List item for sale"
				/>
			);
		}

		if (collectableIsError || collectionIsError) {
			return (
				<ErrorModal
					isOpen={createListingModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={createListingModal$.close}
					title="List item for sale"
				/>
			);
		}

		const approvalNeeded = tokenApproval?.step !== null;

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(StepType.tokenApproval),
				hidden: !approvalNeeded || approvalExecutedSuccess,
				pending: steps?.approval.isExecuting || tokenApprovalIsLoading,
				variant: 'glass' as const,
				disabled:
					createListingModal$.invalidQuantity.get() ||
					listingPrice.amountRaw === '0' ||
					steps?.approval.isExecuting,
			},
			{
				label: 'List item for sale',
				onClick: () => handleStepExecution(StepType.createListing),
				pending: steps?.transaction.isExecuting,
				disabled:
					(!approvalExecutedSuccess && approvalNeeded) ||
					listingPrice.amountRaw === '0' ||
					createListingModal$.invalidQuantity.get(),
			},
		] satisfies ActionModalProps['ctas'];

		return (
			<ActionModal
				isOpen={createListingModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={() => createListingModal$.close()}
				title="List item for sale"
				ctas={ctas}
			>
				<TokenPreview
					collectionName={collection?.name}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					chainId={chainId}
				/>

				<Box display="flex" flexDirection="column" width="full" gap="1">
					<PriceInput
						chainId={chainId}
						collectionAddress={collectionAddress}
						$listingPrice={createListingModal$.listingPrice}
					/>

					{listingPrice.amountRaw !== '0' && (
						<FloorPriceText
							tokenId={collectibleId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							price={listingPrice}
						/>
					)}
				</Box>

				{collection?.type === 'ERC1155' && balance && (
					<QuantityInput
						$quantity={createListingModal$.quantity}
						$invalidQuantity={createListingModal$.invalidQuantity}
						decimals={collectible?.decimals || 0}
						maxQuantity={balance?.balance}
					/>
				)}

				<ExpirationDateSelect $date={createListingModal$.expiry} />

				<TransactionDetails
					collectibleId={collectibleId}
					collectionAddress={collectionAddress}
					chainId={chainId}
					price={createListingModal$.listingPrice.get()}
					currencyImageUrl={listingPrice.currency.imageUrl}
				/>
			</ActionModal>
		);
	},
);
