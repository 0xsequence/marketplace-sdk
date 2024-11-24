import { Box, Card, Button } from "@0xsequence/design-system";
import {
  useMakeOfferModal,
  useCreateListingModal,
  useTransferModal,
  useSellModal,
  CollectibleCard,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";

export function Collectible() {
  const context = useMarketplace();
  const { show: openMakeOfferModal } = useMakeOfferModal();
  const { show: openCreateListingModal } = useCreateListingModal();
  const { show: openTransferModal } = useTransferModal();
  const { show: openSellModal } = useSellModal();
  return (
    <Box paddingTop="3" gap="3">
      <Card gap="3">
        <Button
          variant="primary"
          onClick={() => openMakeOfferModal(context)}
          label="Make Offer"
        />
        <Button
          variant="primary"
          onClick={() => openCreateListingModal(context)}
          label="Create Listing"
        />
        <Button
          variant="primary"
          onClick={() =>
            openTransferModal({
              collectionAddress: context.collectionAddress,
              chainId: context.chainId,
              tokenId: context.collectibleId,
            })
          }
          label="Transfer"
        />
      </Card>
      <CollectibleCard
        chainId={Number(context.chainId)}
        collectionAddress={context.collectionAddress}
        tokenId={context.collectibleId}
        onCollectibleClick={() => console.log("Collectible clicked")}
        onOfferClick={() => console.log("Offer clicked")}
      />
    </Box>
  );
}
