import type { Hex } from "viem";
import { buyModal$ } from "./_store";
import type { Order } from "../../../_internal";
import { observer, useSelector } from "@legendapp/state/react";
import { useCollectible, useCollection } from "../../../hooks";
import { ActionModal } from "../_internal/components/actionModal";
import { useEffect } from "react";
import QuantityInput from "../_internal/components/quantityInput";
import { useBuyCollectable } from "../../../hooks/useBuyCollectable";

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

const CheckoutModal = observer(() => {
  const { collectionAddress, chainId, order } = buyModal$.state.get();
  const { buy } = useBuyCollectable({
    chainId,
    collectionAddress: collectionAddress as Hex,
  });

  const { data: collectable } = useCollectible({
    chainId,
    collectionAddress: collectionAddress as Hex,
    collectibleId: buyModal$.state.tokenId.get(),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!order || !collectable) return;
    buy({
      orderId: order.orderId,
      collectableDecimals: collectable.decimals || 0,
      quantity: "1",
      marketplace: order.marketplace,
    });
  }, [order, collectable]);

  return <></>;
});

const Modal1155 = observer(() => {
  const { collectionAddress, chainId, order } = buyModal$.state.get();
  const { buy } = useBuyCollectable({
    chainId,
    collectionAddress: collectionAddress as Hex,
  });

  const { data: collectable } = useCollectible({
    chainId,
    collectionAddress: collectionAddress as Hex,
    collectibleId: buyModal$.state.tokenId.get(),
  });

  if (!order || !collectable) return null;

  return (
    <ActionModal
      store={buyModal$}
      onClose={() => buyModal$.close()}
      title="Select Quantity"
      ctas={[
        {
          label: "Select Quantity",
          onClick: () =>
            buy({
              quantity: buyModal$.state.quantity.get(),
              orderId: order.orderId,
              collectableDecimals: collectable.decimals || 0,
              marketplace: order.marketplace,
            }),
        },
      ]}
    >
      <QuantityInput
        chainId={chainId}
        collectionAddress={collectionAddress}
        collectibleId={buyModal$.state.tokenId.get()}
        $quantity={buyModal$.state.quantity}
      />
    </ActionModal>
  );
});
