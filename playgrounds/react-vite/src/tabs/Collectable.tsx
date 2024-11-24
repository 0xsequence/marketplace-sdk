import { Box, Card, Button, Text } from "@0xsequence/design-system";
import {
  useMakeOfferModal,
  useCreateListingModal,
  useTransferModal,
  useSellModal,
  CollectibleCard,
  useListListingsForCollectible,
  useListOffersForCollectible,
  useCurrencies,
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
} from "./../lib/Table/Table";
import type { Order } from "@0xsequence/marketplace-sdk";

export function Collectible() {
  const context = useMarketplace();

  return (
    <Box paddingTop="3" gap="3" flexDirection="column">
      <Box gap="3">
        <Box>
          <CollectibleCard
            chainId={Number(context.chainId)}
            collectionAddress={context.collectionAddress}
            tokenId={context.collectibleId}
            onCollectibleClick={() => console.log("Collectible clicked")}
            onOfferClick={() => console.log("Offer clicked")}
          />
        </Box>
        <Card gap="3"></Card>
      </Box>
      <Actions />
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
  const { address } = useAccount();

  if (!address) {
    return (
      <Card gap="3">
        <Text variant="large">Connect Wallet to see collectable actions</Text>
      </Card>
    );
  }
  return (
    <Card gap="6" justifyContent="center">
      <Box gap="3">
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
      <Box gap="3">
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
      </Box>
    </Card>
  );
}

function ListingsTable() {
  const context = useMarketplace();
  const { data: listings, isLoading } = useListListingsForCollectible(context);
  const { show: openSellModal } = useSellModal();

  return (
    <OrdersTable
      isLoading={isLoading}
      items={listings?.listings}
      emptyMessage="No listings available"
      actionLabel="Buy"
      onAction={(order) =>
        openSellModal({
          collectionAddress: context.collectionAddress,
          chainId: context.chainId,
          tokenId: context.collectibleId,
          order: order,
        })
      }
      type="listings"
    />
  );
}

function OffersTable() {
  const context = useMarketplace();
  const { data: offers, isLoading } = useListOffersForCollectible(context);
  // const { show: openBuyModal } = useBuyModal();

  return (
    <OrdersTable
      isLoading={isLoading}
      items={offers?.offers}
      emptyMessage="No offers available"
      actionLabel="Accept"
      onAction={
        (order) => {}
        // openBuyModal({
        //   collectionAddress: context.collectionAddress,
        //   chainId: context.chainId,
        //   tokenId: context.collectibleId,
        //   order: order,
        // })
      }
      type="offers"
    />
  );
}

interface TableProps {
  isLoading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  items?: any[];
  emptyMessage: string;
  actionLabel: string;
  onAction: (order: Order) => void;
  type: "listings" | "offers";
}

function OrdersTable({
  isLoading,
  items,
  emptyMessage,
  actionLabel,
  onAction,
  type,
}: TableProps) {
  const { chainId } = useMarketplace();
  const { data: curencies } = useCurrencies({ chainId });

  const getCurrency = (currencyAddress: string) => {
    return curencies?.find(
      (currency) => currency.contractAddress === currencyAddress
    );
  };

  if (isLoading) {
    return <Box>Loading {type}...</Box>;
  }

  if (!items?.length) {
    return <Box>{emptyMessage}</Box>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Price</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>{type === "listings" ? "Seller" : "Buyer"}</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.orderId}>
            <TableCell>{item.priceAmountFormatted}</TableCell>
            <TableCell>
              {getCurrency(item.priceCurrencyAddress)?.symbol}
            </TableCell>
            <TableCell>{item.createdBy}</TableCell>
            <TableCell>
              {new Date(item.validUntil).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                onClick={() => onAction(item.orderId)}
                label={actionLabel}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
