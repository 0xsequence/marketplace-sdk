import { useState } from "react";

import { Box, IconButton, Skeleton } from "@0xsequence/design-system";
import type { Hex } from "viem";
import { ActionButton } from "../_internals/action-button/ActionButton";
import SvgDiamondEyeIcon from "../../icons/DiamondEye";
import { Footer } from "./Footer";
import {
  collectibleCard,
  collectibleTileWrapper,
  collectibleImage,
  actionWrapper,
} from "./styles.css";
import ChessTileImage from "../../images/chess-tile.png";
import type { ChainId, ContractType, TokenMetadata } from "../../../_internal";
import { useAccount } from "wagmi";
import {
  useBalanceOfCollectible,
  useCollectible,
  useCurrencies,
  useHighestOffer,
  useLowestListing,
} from "../../../hooks";

function CollectibleSkeleton() {
  return (
    <Box
      className={collectibleCard}
      borderRadius="md"
      overflow="hidden"
      background="backgroundPrimary"
    >
      <Skeleton
        size="lg"
        style={{ width: "100%", height: 164, borderRadius: 0, paddingTop: 16 }}
      />

      <Box
        display="flex"
        flexDirection="column"
        gap="2"
        paddingX="4"
        paddingBottom="4"
        marginTop="2"
      >
        <Skeleton size="lg" />

        <Skeleton size="sm" />
      </Box>
    </Box>
  );
}

type CollectibleCardProps = {
  collectibleId: string;
  chainId: ChainId;
  collectionAddress: Hex;
  collectionType?: ContractType;
  onCollectibleClick?: () => void;
  onOfferClick?: () => void;
  isTransfer?: boolean;
};

export function CollectibleCard({
  collectibleId,
  chainId,
  collectionAddress,
  collectionType,
  onCollectibleClick,
  onOfferClick,
  isTransfer,
}: CollectibleCardProps) {
  const { address: accountAddress } = useAccount();
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const { data: collectible, isLoading: collectibleLoading } = useCollectible({
    chainId: String(chainId),
    collectionAddress,
    collectibleId,
  });
  const { data: highestOffer, isLoading: highestOfferLoading } =
    useHighestOffer({
      chainId: String(chainId),
      collectionAddress,
      tokenId: collectibleId,
    });
  const { data: lowestListing, isLoading: lowestListingLoading } =
    useLowestListing({
      chainId: String(chainId),
      collectionAddress,
      tokenId: collectibleId,
    });
  const { data: balanceOfCollectible, isLoading: balanceOfCollectibleLoading } =
    useBalanceOfCollectible({
      chainId: String(chainId),
      collectionAddress,
      collectableId: collectibleId,
      userAddress: accountAddress,
    });
  const { data: currencies } = useCurrencies({ chainId });
  const lowestListingCurrency = currencies?.find(
    (currency) =>
      currency.contractAddress === lowestListing?.order?.priceCurrencyAddress
  );

  if (
    collectibleLoading ||
    highestOfferLoading ||
    lowestListingLoading ||
    balanceOfCollectibleLoading
  ) {
    return <CollectibleSkeleton />;
  }

  const {
    name,
    image,
    external_url: externalUrl,
  } = collectible as TokenMetadata;

  return (
    <Box
      className={collectibleCard}
      borderRadius="md"
      overflow="hidden"
      background="backgroundPrimary"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        position="relative"
        width="full"
        height="full"
        zIndex="10"
        overflow="hidden"
        onClick={onCollectibleClick}
        as="button"
        border="none"
        cursor="pointer"
        padding="0"
        className={collectibleTileWrapper}
      >
        <article style={{ width: "100%" }}>
          {externalUrl && (
            <IconButton
              as="a"
              href={externalUrl}
              size="sm"
              backdropFilter="blur"
              variant="glass"
              onClick={(e) => {
                e.stopPropagation();
              }}
              position="absolute"
              top="2"
              left="2"
              icon={SvgDiamondEyeIcon}
            />
          )}

          <img
            src={imageLoadingError ? ChessTileImage : image || ChessTileImage}
            alt={name}
            className={collectibleImage}
            onError={() => setImageLoadingError(true)}
          />

          <Footer
            name={name}
            type={collectionType}
            onOfferClick={onOfferClick}
            highestOffer={highestOffer?.order}
            lowestListing={lowestListing?.order}
            currency={lowestListingCurrency}
            balanceOfCollectible={balanceOfCollectible}
          />

          {accountAddress && (highestOffer || lowestListing) && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="2"
              className={actionWrapper}
            >
              <ActionButton
                chainId={String(chainId)}
                collectionAddress={collectionAddress}
                tokenId={collectibleId}
                isTransfer={isTransfer}
                highestOffer={highestOffer?.order}
                balanceOfCollectible={balanceOfCollectible}
              />
            </Box>
          )}
        </article>
      </Box>
    </Box>
  );
}
