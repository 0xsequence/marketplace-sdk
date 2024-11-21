import { Box, IconButton, Image, Text } from "@0xsequence/design-system";
import {
  useBalanceOfCollectible,
  useCurrencies,
  useHighestOffer,
  useLowestListing,
} from "../../../hooks";
import { useAccount } from "wagmi";
import { formatUnits, Hex } from "viem";
import { ContractType } from "../../../_internal";
import Pill from "../_internals/pill/Pill";
import SvgBellIcon from "../../icons/Bell";
import { footer, offerBellButton } from "./styles.css";

type FooterProps = {
  name: string;
  type: ContractType;
  chainId: string;
  tokenId: string;
  collectionAddress: Hex;
  onOfferClick?: () => void;
};

export const Footer = ({
  name,
  type,
  chainId,
  tokenId,
  collectionAddress,
  onOfferClick,
}: FooterProps) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalanceOfCollectible({
    chainId: String(chainId),
    collectionAddress: collectionAddress,
    collectableId: tokenId,
    userAddress: accountAddress!,
  });
  const { data: lowestListing } = useLowestListing({
    chainId: String(chainId),
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });
  const { data: highestOffer } = useHighestOffer({
    chainId: String(chainId),
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });
  const { data: currencies } = useCurrencies({
    chainId: String(chainId),
    collectionAddress,
    query: {
      enabled: !!lowestListing?.order,
    },
  });
  const currency = currencies?.find(
    (currency) =>
      currency.contractAddress === lowestListing?.order?.priceCurrencyAddress
  );

  if (name.length > 15 && highestOffer?.order) {
    name = name.substring(0, 13) + "...";
  }
  if (name.length > 17 && !highestOffer?.order) {
    name = name.substring(0, 17) + "...";
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      padding="4"
      whiteSpace="nowrap"
      position="relative"
      className={accountAddress ? footer.animated : footer.static}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
      >
        <Text fontSize="normal" fontWeight="bold" title={name} textAlign="left">
          {name || "<unknown>"}
        </Text>

        {highestOffer?.order && onOfferClick && (
          <IconButton
            variant="primary"
            className={offerBellButton}
            onClick={(e) => {
              e.stopPropagation();
              onOfferClick?.();
            }}
            icon={SvgBellIcon}
          />
        )}
      </Box>

      {lowestListing?.order && currency && (
        <Box display="flex" alignItems="center" gap="1">
          <Image src={currency?.imageUrl} width="3" height="3" />

          <Text fontSize="small" fontWeight="bold" textAlign="left">
            {formatUnits(
              BigInt(lowestListing.order.priceAmount),
              currency.decimals
            )}{" "}
          </Text>
        </Box>
      )}

      {balance && type !== ContractType.ERC721 && (
        <Pill text={`Owned: ${balance}`} />
      )}

      {type === ContractType.ERC721 && <Pill text="ERC-721" />}
    </Box>
  );
};
