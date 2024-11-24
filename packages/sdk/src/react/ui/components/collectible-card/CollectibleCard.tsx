import { Box, IconButton, Skeleton } from "@0xsequence/design-system";
import type { Hex } from "viem";
import { useCollectible, useCollection } from "../../../hooks";
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
import type { ChainId, ContractType } from "../../../_internal";
import { useAccount } from "wagmi";

function CollectibleSkeleton() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="3"
      alignItems="center"
      overflow="hidden"
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
      >
        <Skeleton size="lg" />

        <Skeleton size="sm" />
      </Box>
    </Box>
  );
}

type CollectibleCardProps = {
  tokenId: string;
  chainId: ChainId;
  collectionAddress: Hex;
  onCollectibleClick?: () => void;
  onOfferClick?: () => void;
};

export function CollectibleCard({
  tokenId,
  chainId,
  collectionAddress,
  onCollectibleClick,
  onOfferClick,
}: CollectibleCardProps) {
  const { data: collectible, isLoading: collectibleLoading } = useCollectible({
    chainId: String(chainId),
    collectionAddress,
    collectibleId: tokenId,
  });
  const { data: collection } = useCollection({
    chainId: String(chainId),
    collectionAddress,
  });

  if (collectibleLoading || !collectible || !collection) {
    return <CollectibleSkeleton />;
  }

  return (
    <Box
      className={collectibleCard}
      borderRadius="md"
      overflow="hidden"
      background="backgroundPrimary"
    >
      <CardWrapper
        name={collectible.name}
        type={collection.type as ContractType}
        imageSrc={collectible.image}
        tokenId={tokenId}
        chainId={String(chainId)}
        collectionAddress={collectionAddress}
        marketplaceSource={collectible.external_url}
        onCollectibleClick={onCollectibleClick}
        onOfferClick={onOfferClick}
      />
    </Box>
  );
}

type CardWrapperProps = {
  name: string;
  type: ContractType;
  imageSrc?: string;
  tokenId: string;
  chainId: string;
  collectionAddress: Hex;
  balance?: string;
  marketplaceSource?: string;
  onCollectibleClick?: () => void;
  onOfferClick?: () => void;
};

const CardWrapper = ({
  name,
  type,
  imageSrc,
  tokenId,
  chainId,
  collectionAddress,
  marketplaceSource,
  onCollectibleClick,
  onOfferClick,
}: CardWrapperProps) => {
  const { address: accountAddress } = useAccount();

  return (
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
      padding="0"
      className={collectibleTileWrapper}
    >
      <article style={{ width: "100%" }}>
        {marketplaceSource && (
          <IconButton
            as="a"
            href={marketplaceSource}
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
          src={imageSrc || ChessTileImage}
          alt={name}
          className={collectibleImage}
        />

        <Footer
          name={name}
          type={type}
          tokenId={tokenId}
          chainId={chainId}
          collectionAddress={collectionAddress}
          onOfferClick={onOfferClick}
        />

        {accountAddress && (
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
              tokenId={tokenId}
            />
          </Box>
        )}
      </article>
    </Box>
  );
};
