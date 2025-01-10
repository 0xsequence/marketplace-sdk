import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { dateToUnixTime } from '../../../../utils/date';
import { ContractType, collectableKeys } from '../../../_internal';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import {
	useCollectible,
	useCollection,
	useCurrencies,
	useCurrencyOptions,
} from '../../../hooks';
import { useMakeOffer } from '../../../hooks/useMakeOffer';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
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

type TransactionStatusModalReturn = ReturnType<
	typeof useTransactionStatusModal
>;

const Modal = observer(
	({
		showTransactionStatusModal,
	}: {
		showTransactionStatusModal: TransactionStatusModalReturn['show'];
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
		const currencyOptions = useCurrencyOptions({ collectionAddress });
		const { isLoading: currenciesIsLoading } = useCurrencies({
			chainId,
			currencyOptions,
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
		const approvalNeeded = steps?.approval.isPending;

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (!currencyAddress) return;

			refreshSteps();
		}, [currencyAddress, machineLoading]);

		if (
			collectableIsLoading ||
			collectionIsLoading ||
			currenciesIsLoading ||
			machineLoading
		) {
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

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
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
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled:
					(!approvalExecutedSuccess && approvalNeeded) ||
					offerPrice.amountRaw === '0' ||
					insufficientBalance ||
					isLoading ||
					invalidQuantity ||
					offerPrice.amountRaw === '0',
			},
		];

		return (
			<>
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

					{collection?.type === ContractType.ERC1155 && (
						<QuantityInput
							$quantity={makeOfferModal$.quantity}
							$invalidQuantity={makeOfferModal$.invalidQuantity}
							decimals={collectible?.decimals || 0}
							maxQuantity={String(Number.MAX_SAFE_INTEGER)}
						/>
					)}

					{offerPrice.amountRaw !== '0' &&
						offerPriceChanged &&
						!insufficientBalance && (
							<FloorPriceText
								tokenId={collectibleId}
								chainId={chainId}
								collectionAddress={collectionAddress}
								price={offerPrice}
							/>
						)}

					<ExpirationDateSelect $date={makeOfferModal$.expiry} />
				</ActionModal>
			</>
		);
	},
);
