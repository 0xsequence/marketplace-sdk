"use client";

import { Button } from "@0xsequence/design-system";
import { observer } from "@legendapp/state/react";
import type { Hex } from "viem";
import { useCreateListingModal } from "../../../modals/CreateListingModal";
import { useMakeOfferModal } from "../../../modals/MakeOfferModal";
import { useSellModal } from "../../../modals/SellModal";
import { useTransferModal } from "../../../modals/TransferModal";
import { Order } from "../../../../_internal";
import { TokenBalance } from "@0xsequence/indexer";

type ActionButtonProps = {
  chainId: string;
  collectionAddress: string;
  tokenId: string;
  isTransfer?: boolean;
  highestOffer?: Order;
  balanceOfCollectible?: TokenBalance;
};

export const ActionButton = observer(
  ({
    collectionAddress,
    chainId,
    tokenId,
    isTransfer,
    highestOffer,
    balanceOfCollectible: balance,
  }: ActionButtonProps) => {
    const collectibleOwned = balance?.balance ?? 0;

    const { show: showCreateListingModal } = useCreateListingModal();
    const { show: showMakeOfferModal } = useMakeOfferModal();
    const { show: showSellModal } = useSellModal();
    const { show: showTransferModal } = useTransferModal();

    if (isTransfer && collectibleOwned) {
      return (
        <ActionButtonBody
          label="Transfer"
          onClick={() =>
            showTransferModal({
              collectionAddress: collectionAddress as Hex,
              chainId: chainId,
              tokenId: tokenId,
            })
          }
        />
      );
    }

    if (!collectibleOwned) {
      return (
        <ActionButtonBody
          label="Make an offer"
          onClick={() =>
            showMakeOfferModal({
              collectionAddress: collectionAddress as Hex,
              chainId: chainId,
              collectibleId: tokenId,
            })
          }
        />
      );
    }

    if (collectibleOwned && highestOffer) {
      return (
        <ActionButtonBody
          label="Sell"
          onClick={() =>
            showSellModal({
              collectionAddress: collectionAddress as Hex,
              chainId: chainId,
              tokenId: tokenId,
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              order: highestOffer,
            })
          }
        />
      );
    }

    return (
      <ActionButtonBody
        label="Create listing"
        onClick={() =>
          showCreateListingModal({
            collectionAddress: collectionAddress as Hex,
            chainId: chainId,
            collectibleId: tokenId,
          })
        }
      />
    );
  }
);

type ActionButtonBodyProps = {
  label: string;
  onClick: () => void;
};

function ActionButtonBody({ label, onClick }: ActionButtonBodyProps) {
  return (
    <Button
      variant="primary"
      label={label}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      // leftIcon={leftIcon}
      size="xs"
      shape="square"
      width="full"
    />
  );
}
