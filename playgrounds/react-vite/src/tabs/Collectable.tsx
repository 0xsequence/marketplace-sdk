import { Box, Card, Button, Text } from "@0xsequence/design-system";
import {
  useMakeOfferModal,
  useCreateListingModal,
  useTransferModal,
  useSellModal,
  CollectibleCard,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { useAccount } from "wagmi";

export function Collectible() {
  const context = useMarketplace();

  const { address } = useAccount();
  return (
    <Box paddingTop="3" gap="3">
      <Card>
        {address ? (
          <Actions />
        ) : (
          <Text variant="large">Connect Wallet to see collectable actions</Text>
        )}
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

function Actions() {
  const context = useMarketplace();
  const { show: openMakeOfferModal } = useMakeOfferModal();
  const { show: openCreateListingModal } = useCreateListingModal();
  const { show: openTransferModal } = useTransferModal();
  const { show: openSellModal } = useSellModal();
  return (
    <Box gap="3">
      <Box gap="3" flexDirection="column">
        <Button
          variant="primary"
          onClick={() => openMakeOfferModal(context)}
          label="Make Offer"
        />
        <Button
          variant="primary"
          onClick={() => openCreateListingModal(context)}
          label="Buy Item"
        />
      </Box>
      <Box gap="3" flexDirection="column">
        <Button
          variant="primary"
          onClick={() => openCreateListingModal(context)}
          label="Create Listing"
        />
        {/* <Button
          variant="primary"
          onClick={() => openSellModal(context)}
          label="Sell Item"
        /> */}
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
      </Box>
    </Box>
  );
}
