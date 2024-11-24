import { Box, Card, Button, Text } from "@0xsequence/design-system";
import {
  useMakeOfferModal,
  useCreateListingModal,
  useTransferModal,
  useSellModal,
  CollectibleCard,
  useListListingsForCollectible,
  useListOffersForCollectible,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { useAccount } from "wagmi";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./../lib/Table/table";

export function Collectible() {
  const context = useMarketplace();

  const { address } = useAccount();
  return (
    <Box paddingTop="3" gap="3" flexDirection="column">
      <Box gap="3">
        <Card>
          {address ? (
            <Actions />
          ) : (
            <Text variant="large">
              Connect Wallet to see collectable actions
            </Text>
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
      <ListingsTable />
      <OffersTable />
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

function ListingsTable() {
  const context = useMarketplace();
  const { data: listings, isLoading } = useListListingsForCollectible(context);

  if (isLoading) {
    return <Box>Loading listings...</Box>;
  }

  if (!listings?.listings?.length) {
    return <Box>No listings available</Box>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Price</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings?.listings?.map((listing) => (
          <TableRow key={listing.orderId}>
            <TableCell>{listing.priceAmountFormatted}</TableCell>
            <TableCell>{listing.priceCurrencyAddress}</TableCell>
            <TableCell>{listing.createdBy}</TableCell>
            <TableCell>
              {new Date(listing.validUntil).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                onClick={() => console.log("Buy", listing.orderId)}
                label="Buy"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OffersTable() {
  const context = useMarketplace();
  const { data: offers, isLoading } = useListOffersForCollectible(context);

  if (isLoading) {
    return <Box>Loading offers...</Box>;
  }

  if (!offers?.offers?.length) {
    return <Box>No offers available</Box>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Price</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers?.offers?.map((offer) => (
          <TableRow key={offer.orderId}>
            <TableCell>{offer.priceAmountFormatted}</TableCell>
            <TableCell>{offer.priceCurrencyAddress}</TableCell>
            <TableCell>{offer.createdBy}</TableCell>
            <TableCell>
              {new Date(offer.validUntil).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                onClick={() => console.log("Accept", offer.orderId)}
                label="Accept"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
