import { Show, observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { sellModal$ } from './_store';
import { useCollection,  useCurrencies } from '../../../hooks';
import { Order } from '../../../_internal';
import { useSell } from '../../../hooks/useSell';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';

export type ShowSellModalArgs = {
  chainId: string;
  collectionAddress: Hex;
  tokenId: string;
  order: Order;
};

export type SellModalCallbacks = {
  onSuccess?: (hash: Hex) => void;
  onError?: (error: Error) => void;
};

export const useSellModal = (callbacks?: SellModalCallbacks) => ({
  show: (args: ShowSellModalArgs) => sellModal$.open({ ...args, callbacks }),
  close: sellModal$.close
});

export const SellModal = () => (
  <Show if={sellModal$.isOpen}>
    <ModalContent />
  </Show>
);

const ModalContent = observer(() => {
  const { tokenId, collectionAddress, chainId, order } = sellModal$.get();

  const { sell } = useSell({
    collectionAddress,
    chainId,
    onSuccess: (hash) => {
      sellModal$.hash.set(hash);
      sellModal$.successCallback?.(hash);
      sellModal$.close();
    },
    onError: (error) => {
      sellModal$.errorCallback?.(error);
    }
  });

  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({ 
    chainId, 
    collectionAddress 
  });
  
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies({ 
    chainId, 
    collectionAddress 
  });

  if (collectionLoading || currenciesLoading) {
    return <LoadingModal store={sellModal$} onClose={sellModal$.close} title="You have an offer" />;
  }

  if (collectionError || order === undefined) {
    return <ErrorModal store={sellModal$} onClose={sellModal$.close} title="You have an offer" />;
  }

  const currency = currencies?.find(
    (c) => c.contractAddress === order?.priceCurrencyAddress
  );

  return (
    <ActionModal
      store={sellModal$}
      onClose={sellModal$.close}
      title="You have an offer"
      ctas={[{
        label: 'Accept',
        onClick: () => sell({
          orderId: order?.orderId,
          marketplace: order?.marketplace,
        }),
      }]}
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
