import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../utils/date';
import { type ContractType, collectableKeys } from '../../../_internal';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
} from '../../../hooks';
import { useMakeOffer } from '../../../hooks/useMakeOffer';
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
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { makeOfferModal$ } from './store';

export const MakeOfferModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={makeOfferModal$.isOpen}>
			{() => <Modal showTransactionStatusModal={showTransactionStatusModal} />}
		</Show>
	);
};

export const Modal = observer(
	({
		showTransactionStatusModal,
	}: {
		showTransactionStatusModal: ReturnType<
			typeof useTransactionStatusModal
		>['show'];
	}) => {
		const state = makeOfferModal$.get();
		const {
			collectionAddress,
			chainId,
			offerPrice,
			offerPriceChanged,
			invalidQuantity,
			collectibleId,
			orderbookKind,
			callbacks,
		} = state;
		const [insufficientBalance, setInsufficientBalance] = useState(false);
		const [approvalExecutedSuccess, setApprovalExecutedSuccess] =
			useState(false);
		const [validationError, setValidationError] = useState<string | null>(null);

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

		const { address } = useAccount();

		const { data: balance } = useBalanceOfCollectible({
			chainId,
			collectionAddress,
			collectableId: collectibleId,
			userAddress: address ?? undefined,
		});

		const { getMakeOfferSteps, isLoading: machineLoading } = useMakeOffer({
			chainId,
			collectionAddress,
			orderbookKind,
			enabled: makeOfferModal$.isOpen.get(),
			onApprovalSuccess: () => setApprovalExecutedSuccess(true),
			onTransactionSent: (hash, orderId) => {
				if (!hash && !orderId) return;

				showTransactionStatusModal({
					hash,
					orderId,
					price: makeOfferModal$.offerPrice.get(),
					collectionAddress,
					chainId,
					collectibleId,
					type: TransactionType.OFFER,
					queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
					callbacks,
				});
				makeOfferModal$.close();
			},
		});

		const currencyAddress = offerPrice.currency.contractAddress;

		const { isLoading, steps, refreshSteps } = getMakeOfferSteps({
			contractType: collection?.type as ContractType,
			offer: {
				tokenId: collectibleId,
				quantity: parseUnits(
					makeOfferModal$.quantity.get(),
					collectible?.decimals || 0,
				).toString(),
				expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
				currencyAddress,
				pricePerToken: offerPrice.amountRaw,
			},
		});

		const validateOffer = () => {
			if (offerPrice.amountRaw === '0') {
				setValidationError('Offer price cannot be zero');
				return false;
			}
			if (invalidQuantity) {
				setValidationError('Invalid quantity');
				return false;
			}
			if (insufficientBalance) {
				setValidationError('Insufficient balance');
				return false;
			}
			setValidationError(null);
			return true;
		};

		useEffect(() => {
			if (!currencyAddress) return;
			refreshSteps();
		}, [currencyAddress]);

		const handleStepExecution = async (execute?: any) => {
			if (!execute) return;
			try {
				await refreshSteps();
				await execute();
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
					isOpen={makeOfferModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={makeOfferModal$.close}
					title="Make an offer"
				/>
			);
		}

		if (collectableIsError || collectionIsError) {
			return (
				<ErrorModal
					isOpen={makeOfferModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={makeOfferModal$.close}
					title="Make an offer"
				/>
			);
		}

		const approvalNeeded = steps?.approval.isPending;

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => {
					if (validateOffer()) {
						handleStepExecution(() => steps?.approval.execute());
					}
				},
				hidden: !approvalNeeded || approvalExecutedSuccess,
				pending: steps?.approval.isExecuting || isLoading,
				variant: 'glass' as const,
				disabled:
					invalidQuantity ||
					isLoading ||
					steps?.transaction.isExecuting ||
					insufficientBalance ||
					offerPrice.amountRaw === '0' ||
					!offerPriceChanged,
			},
			{
				label: 'Make offer',
				onClick: () => {
					if (validateOffer()) {
						handleStepExecution(() => steps?.transaction.execute());
					}
				},
				pending: steps?.transaction.isExecuting || isLoading,
				disabled:
					(!approvalExecutedSuccess && approvalNeeded) ||
					offerPrice.amountRaw === '0' ||
					insufficientBalance ||
					isLoading ||
					invalidQuantity,
			},
		] satisfies ActionModalProps['ctas'];

		return (
			<ActionModal
				isOpen={makeOfferModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={() => makeOfferModal$.close()}
				title="Make an offer"
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
						$listingPrice={makeOfferModal$.offerPrice}
						onPriceChange={() => makeOfferModal$.offerPriceChanged.set(true)}
						checkBalance={{
							enabled: true,
							callback: (state) => setInsufficientBalance(state),
						}}
					/>

					{offerPrice.amountRaw !== '0' && offerPriceChanged && (
						<FloorPriceText
							tokenId={collectibleId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							price={offerPrice}
						/>
					)}
				</Box>

				{collection?.type === ContractType.ERC1155 && (
					<QuantityInput
						$quantity={makeOfferModal$.quantity}
						$invalidQuantity={makeOfferModal$.invalidQuantity}
						decimals={collectible?.decimals || 0}
						maxQuantity={String(Number.MAX_SAFE_INTEGER)}
					/>
				)}

				<ExpirationDateSelect $date={makeOfferModal$.expiry} />
			</ActionModal>
		);
	},
);
