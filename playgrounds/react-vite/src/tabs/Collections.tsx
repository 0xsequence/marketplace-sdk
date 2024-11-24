import { Box, Card, Text } from "@0xsequence/design-system";
import type { ContractInfo } from "@0xsequence/indexer";
import type { Hex } from "viem";
import { useListCollections } from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";

export function Collections() {
  const { data: collections } = useListCollections();
  const { setChainId, setCollectionAddress, setActiveTab } = useMarketplace();

  const handleCollectionClick = (collection: ContractInfo) => {
    setChainId(String(collection.chainId));
    setCollectionAddress(collection.address as Hex);
    setActiveTab("collectibles");
  };

  return (
    <Box
      gap="3"
      paddingTop="3"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      {collections?.map((collection) => (
        <Card
          key={collection.address}
          gap="2"
          onClick={() => handleCollectionClick(collection)}
          style={{ cursor: "pointer" }}
        >
          <Box
            style={{
              backgroundImage: `url(${collection.extensions?.ogImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "200px",
              minWidth: "90px",
            }}
            alignItems="center"
          >
            <Card blur={true} flexDirection="column" gap="1">
              <Text variant="large">{collection.name}</Text>
              <Text variant="small">{collection.address}</Text>
            </Card>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
