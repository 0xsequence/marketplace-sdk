import { Box, Spinner } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { sellModal$ } from './_store';
import { useCollection,  useCurrencies } from '../../../hooks';
import { Order } from '../../../_internal';import { useSell } from '../../../hooks/useSell';

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

	const { sell } = useSell({
		collectionAddress,
		chainId,
    onSuccess: (hash) => {
      sellModal$.hash.set(hash);
      sellModal$.successCallbacks?.onSellSuccess?.(hash);
      sellModal$.close();
    },
    onError: (error) => {
      sellModal$.errorCallbacks?.onSellError?.(error);
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
    return <LoadingState />;
  }

  if (collectionError || order === undefined) {
    return <ErrorState />;
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
