import type { Hex } from "viem";
import { buyModal$ } from "./_store";
import {
  type MarketplaceKind,
  TransactionSwapProvider,
  type Order,
} from "../../../_internal";
import { observer, useSelector } from "@legendapp/state/react";
import {
  useCheckoutOptions,
  useCollection,
  useCurrencies,
  useGenerateBuyTransaction,
} from "../../../hooks";
import { useAccount } from "wagmi";
import { type Price, StepType } from "../../../../types";
import { useSelectPaymentModal } from "@0xsequence/kit-checkout";
import {
  ActionModal,
  type ActionModalProps,
} from "../_internal/components/actionModal";
import TransactionDetails from "../_internal/components/transactionDetails";
import { useEffect } from "react";
import QuantityInput from "../_internal/components/quantityInput";

export type ShowBuyModalArgs = {
  chainId: string;
  collectionAddress: Hex;
  tokenId: string;
  order: Order;
};

export const useBuyModal = () => {
  return {
    show: (args: ShowBuyModalArgs) => buyModal$.open(args),
    close: () => buyModal$.close(),
  };
};

export const BuyModal = () => {
  const isOpen = useSelector(buyModal$.isOpen);
  const { data: collection } = useCollection({
    chainId: buyModal$.state.chainId.get(),
    collectionAddress: buyModal$.state.collectionAddress.get(),
  });

  if (!isOpen || !collection) return null;

  return collection.type === "ERC721" ? <CheckoutModal /> : <Modal1155 />;
};

const Modal1155 = observer(() => {
  const { collectionAddress, chainId, tokenId, order } = buyModal$.state.get();

  const { data: currencies } = useCurrencies({ chainId, collectionAddress });
  const currency = currencies?.find(
    (currency) => currency.contractAddress === order?.priceCurrencyAddress
  );

  const ctas = [
    {
      label: "Accept",
      onClick: () => {},
    },
  ] satisfies ActionModalProps["ctas"];

  return (
    <ActionModal
      store={buyModal$}
      onClose={() => buyModal$.close()}
      title="Select Quantity"
      ctas={ctas}
    >
      <QuantityInput
        chainId={chainId}
        collectionAddress={collectionAddress}
        collectibleId={collectibleId}
        $quantity={createListingModal$.state.quantity}
      />
    </ActionModal>
  );
});

interface UseCheckoutArgs {
  chainId: string;
  collectionAddress: Hex;
  orderId: string;
  marketplace: MarketplaceKind;
  quantity: string;
}

const useCheckout = ({ chainId, ...order }: UseCheckoutArgs) => {
  const { address } = useAccount();

  const { data: checkoutOptions, ...checkoutQuery } = useCheckoutOptions({
    chainId,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    orders: [order!],
    query: { enabled: !!address && !!order },
  });

  const { data: collection, ...collectionQuery } = useCollection({
    chainId,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    collectionAddress: order.collectionAddress!,
    query: { enabled: !!chainId && !!order?.collectionAddress },
  });

  const { data: buyTransaction, ...transactionQuery } =
    useGenerateBuyTransaction({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      collectionAddress: order?.collectionAddress!,
      chainId,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ordersData: [order!],
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      marketplace: order.marketplace!,
      query: { enabled: !!address && !!order },
    });

  return {
    checkoutOptions,
    collection,
    buyTransaction,
    isLoading: checkoutQuery.isLoading || collectionQuery.isLoading,
    error:
      checkoutQuery.error || collectionQuery.error || transactionQuery.error,
  };
};

const CheckoutModal = () => {
  const state = useSelector(buyModal$.state.get());

  const { checkoutOptions, collection, buyTransaction, isLoading, error } =
    useCheckout({
      chainId: state.chainId,
      collectionAddress: state.collectionAddress,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      orderId: state.order?.orderId!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      marketplace: state.order?.marketplace!,
      quantity: String(state.quantity),
    });

  const { openSelectPaymentModal } = useSelectPaymentModal();
  const { address } = useAccount();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const buyStep = buyTransaction?.find((step) => step.id === StepType.buy);
    if (!buyStep || !collection) return;

    openSelectPaymentModal({
      chain: state.chainId,
      collectibles: [
        {
          tokenId: state.tokenId,
          quantity: String(state.quantity),
          decimals: collection.decimals,
        },
      ],
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      currencyAddress: state.order?.priceCurrencyAddress!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      price: state.order?.priceAmount!,
      targetContractAddress: buyStep.to,
      txData: buyStep.data as Hex,
      collectionAddress: state.collectionAddress,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      recipientAddress: address!,
      enableMainCurrencyPayment: true,
      enableSwapPayments: checkoutOptions?.options.swap?.includes(
        TransactionSwapProvider.zerox
      ),
      creditCardProviders: checkoutOptions?.options.nftCheckout,
    });
  }, [buyTransaction, collection, checkoutOptions]);

  if (isLoading) {
    //TODO: loading state
    return null;
  }

  if (error) {
    // TODO: error state
    return null;
  }

  return null;
};
