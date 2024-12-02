import { Show, observer } from '@legendapp/state/react';
import { useState } from 'react';
import type { Hex } from 'viem';
import { ContractType, StepType } from '../../../_internal';
import { useCollectible, useCollection } from '../../../hooks';
import { useMakeOffer } from '../../../hooks/useMakeOffer';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { makeOfferModal$ } from './_store';
import { getMakeOfferTransactionMessage, getMakeOfferTransactionTitle } from './_utils/getMakeOfferTransactionTitleMessage';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '../_internal/types';

export type ShowMakeOfferModalArgs = {
  collectionAddress: Hex;
  chainId: string;
  collectibleId: string;
};

export const useMakeOfferModal = (defaultCallbacks?: ModalCallbacks) => ({
  show: (args: ShowMakeOfferModalArgs) => makeOfferModal$.open({ ...args, callbacks: defaultCallbacks }),
  close: makeOfferModal$.close
});

export const MakeOfferModal = () => (
  <Show if={makeOfferModal$.isOpen}>
    <ModalContent />
  </Show>
);

const ModalContent = observer(() => {
  const state = makeOfferModal$.get();
  const { collectionAddress, chainId, offerPrice, collectibleId } = state;
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const { show: showTransactionStatusModal } = useTransactionStatusModal();

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

  const { getMakeOfferSteps } = useMakeOffer({
    chainId,
    collectionAddress,
    onSuccess: (hash) => {
      makeOfferModal$.callbacks?.onSuccess?.(hash);
      makeOfferModal$.close();
      if (hash) return;
      showTransactionStatusModal({
        hash,
        price: makeOfferModal$.offerPrice.get(),
        collectionAddress,
        chainId,
        tokenId: collectibleId,
        getTitle: getMakeOfferTransactionTitle,
        getMessage: (params) => 
          getMakeOfferTransactionMessage(params, collectible?.name || ''),
        type: StepType.createOffer,
      });

    },
    onError: (error) => {
      makeOfferModal$.callbacks?.onError?.(error);
    },
  });

  if (collectableIsLoading || collectionIsLoading) {
    return <LoadingModal store={makeOfferModal$} onClose={makeOfferModal$.close} title="Make an offer" />;
  }

  if (collectableIsError || collectionIsError) {
    return <ErrorModal store={makeOfferModal$} onClose={makeOfferModal$.close} title="Make an offer" />;
  }

  const dateToUnixTime = (date: Date) =>
    Math.floor(date.getTime() / 1000).toString();

  const { isLoading, steps, refreshSteps } = getMakeOfferSteps({
    contractType: collection!.type as ContractType,
    offer: {
      tokenId: collectibleId,
      quantity: makeOfferModal$.quantity.get(),
      expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
      currencyAddress: offerPrice.currency.contractAddress,
      pricePerToken: offerPrice.amountRaw,
    },
  });

  const handleStepExecution = async (execute?: any) => {
    if (!execute) return;
    try {
      await refreshSteps();
      await execute();
    } catch (error) {
      makeOfferModal$.callbacks?.onError?.(error as Error);
    }
  };

  const ctas = [
    {
      label: 'Approve TOKEN',
      onClick: () => handleStepExecution(() => steps?.approval.execute()),
      hidden: !steps?.approval.isPending,
      pending: steps?.approval.isExecuting,
      variant: 'glass' as const,
    },
    {
      label: 'Make offer',
      onClick: () => handleStepExecution(() => steps?.transaction.execute()),
      pending: steps?.transaction.isExecuting || isLoading,
      disabled: 
        steps?.approval.isPending ||
        offerPrice.amountRaw === '0' ||
        insufficientBalance ||
        isLoading,
    },
  ];

  return (
    <ActionModal
      store={makeOfferModal$}
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
        checkBalance={{
          enabled: true,
          callback: (state) => setInsufficientBalance(state),
        }}
      />

      {collection?.type === ContractType.ERC1155 && (
        <QuantityInput
          chainId={chainId}
          $quantity={makeOfferModal$.quantity}
          collectionAddress={collectionAddress}
          collectibleId={collectibleId}
        />
      )}

      {!!offerPrice && (
        <FloorPriceText
          tokenId={collectibleId}
          chainId={chainId}
          collectionAddress={collectionAddress}
          price={offerPrice}
        />
      )}

      <ExpirationDateSelect $date={makeOfferModal$.expiry} />
    </ActionModal>
  );
});
