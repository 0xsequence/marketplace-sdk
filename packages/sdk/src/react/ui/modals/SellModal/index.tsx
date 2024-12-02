import { Box, Spinner } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { sellModal$ } from './_store';
import { useCollection, useCollectible, useCurrencies } from '../../../hooks';
import { Order } from '../../../_internal';
import { useCallback } from 'react';

export type ShowSellModalArgs = {
  chainId: string;
  collectionAddress: Hex;
  tokenId: string;
  order: Order;
};

export const useSellModal = () => ({
  show: (args: ShowSellModalArgs) => sellModal$.open(args),
  close: () => sellModal$.close(),
  setCallbacks: sellModal$.setCallbacks
});

export const SellModal = () => (
  <Show if={sellModal$.isOpen}>
    <ModalContent />
  </Show>
);

const ModalContent = observer(() => {
	  const { tokenId, collectionAddress, chainId, order } = sellModal$.get();

    const { sell, getSellSteps } = useSell({
    onSuccess: (hash) => {
      sellModal$.hash.set(hash);
      sellModal$.successCallbacks?.onSellSuccess?.(hash);
      sellModal$.close();
    },
    onError: (error) => {
      sellModal$.errorCallbacks?.onSellError?.(error);
    }
  });

  
  const { steps, isLoading, refreshSteps } = getSellSteps({
    tokenId,
    collectionAddress,
    chainId,
    order
  });

  const handleSell = useCallback(() => {
    if (!steps) return;
    sell({
      tokenId,
      collectionAddress,
      chainId,
      order
    });
  }, [sell, steps, tokenId, collectionAddress, chainId, order]);

  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({ 
    chainId, 
    collectionAddress 
  });
  
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies({ 
    chainId, 
    collectionAddress 
  });

  const { data: collectible, isLoading: collectibleLoading, isError: collectibleError } = useCollectible({
    chainId,
    collectionAddress,
    collectibleId: tokenId
  });

  if (collectionLoading || currenciesLoading || collectibleLoading) {
    return <LoadingState />;
  }

  if (collectionError || collectibleError) {
    return <ErrorState />;
  }

  const currency = currencies?.find(
    (c) => c.contractAddress === order?.priceCurrencyAddress
  );

  const ctas = [
    {
      label: 'Accept',
      onClick: handleSell,
      pending: false,
      disabled: stepsLoading || !steps
    }
  ];

  return (
    <ActionModal
      store={sellModal$}
      onClose={sellModal$.close}
      title="You have an offer"
      ctas={ctas}
    >
      <TransactionHeader
        title="Offer received"
        chainId={Number(chainId)}
        date={order && new Date(order.createdAt)}
      />
      <TokenPreview
        collectionName={collection?.name}
        collectionAddress={collectionAddress} 
        collectibleId={tokenId}
        chainId={chainId}
      />
      <TransactionDetails
        collectibleId={tokenId}
        collectionAddress={collectionAddress}
        chainId={chainId}
        price={currency ? {
          amountRaw: order?.priceAmount,
          currency
        } : undefined}
      />
    </ActionModal>
  );
});

const LoadingState = () => (
  <ActionModal
    store={sellModal$}
    onClose={sellModal$.close}
    title="You have an offer"
    ctas={[]}
  >
    <Box display="flex" justifyContent="center" alignItems="center" padding="4">
      <Spinner size="lg" />
    </Box>
  </ActionModal>
);

const ErrorState = () => (
  <ActionModal
    store={sellModal$}
    onClose={sellModal$.close}
    title="You have an offer" 
    ctas={[]}
  >
    <Box display="flex" justifyContent="center" alignItems="center" padding="4">
      Error loading offer details
    </Box>
  </ActionModal>
);
