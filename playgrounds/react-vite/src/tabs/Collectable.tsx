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
import { type Order } from "@0xsequence/marketplace-sdk";
import useSendCancelTransaction from "../hooks/useSendCancelTransaction";

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
        {/* TODO: some metadata */}
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
  const { isConnected } = useAccount();

  const hooksProps = {
    collectionAddress: context.collectionAddress,
    chainId: context.chainId,
    collectibleId: context.collectibleId,
  };

  return (
    <Card gap="6" justifyContent="center">
      {!isConnected && (
        <Text variant="large">Connect Wallet to see collectable actions</Text>
      )}
      <Box gap="3">
        <Button
          variant="primary"
          onClick={() => openMakeOfferModal(hooksProps)}
          label="Make Offer"
          disabled={!isConnected}
        />
        <Button
          variant="primary"
          onClick={() => openCreateListingModal(hooksProps)}
          label="Buy Item"
          disabled={!isConnected}
        />
      </Box>
      <Box gap="3">
        <Button
          variant="primary"
          onClick={() => openCreateListingModal(hooksProps)}
          label="Create Listing"
          disabled={!isConnected}
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
          disabled={!isConnected}
        />
      </Box>
    </Card>
  );
}

function ListingsTable() {
  const { collectionAddress, chainId, collectibleId } = useMarketplace();
  const { data: listings, isLoading } = useListListingsForCollectible({
    collectionAddress,
    chainId,
    collectibleId,
  });

  return (
    <OrdersTable
      isLoading={isLoading}
      items={listings?.listings}
      emptyMessage="No listings available"
      actionLabel="Buy"
      onAction={() => console.log("buy")}
      type="listings"
    />
  );
}

function OffersTable() {
  const context = useMarketplace();
  const { data: offers, isLoading } = useListOffersForCollectible(context);

  const { show: openSellModal } = useSellModal();
  return (
    <OrdersTable
      isLoading={isLoading}
      items={offers?.offers}
      emptyMessage="No offers available"
      actionLabel="Accept"
      onAction={(order) => {
        openSellModal({
          collectionAddress: context.collectionAddress,
          chainId: context.chainId,
          tokenId: context.collectibleId,
          order: order,
        });
      }}
      type="offers"
    />
  );
}

interface TableProps {
  isLoading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  items?: Order[];
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
          <OrdersTableRow
            key={item.orderId}
            order={item}
            actionLabel={actionLabel}
            onAction={onAction}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function OrdersTableRow({
  order,
  actionLabel,
  onAction,
}: {
  order: Order;
  actionLabel: string;
  onAction: (order: Order) => void;
}) {
  const { chainId, collectionAddress } = useMarketplace();
  const { address } = useAccount();
  const isOrderOwner = order.createdBy.toLowerCase() === address?.toLowerCase();
  const { data: currencies } = useCurrencies({ chainId });
  const { sendCancelTransaction, isPending, isSuccess } =
    useSendCancelTransaction();

  const getCurrency = (currencyAddress: string) => {
    return currencies?.find(
      (currency) => currency.contractAddress === currencyAddress
    );
  };

  const label = isOrderOwner
    ? (isPending && "Cancelling") || (isSuccess && "Cancelled") || "Cancel"
    : actionLabel;
  const onClick = isOrderOwner
    ? () =>
        sendCancelTransaction({
          orderId: order.orderId,
          collectionAddress,
          maker: order.createdBy,
          marketplace: order.marketplace,
        })
    : () => onAction(order);
  const disabled = (isOrderOwner && (isPending || isSuccess)) || !address;

  return (
    <TableRow key={order.orderId}>
      <TableCell>{order.priceAmountFormatted}</TableCell>
      <TableCell>{getCurrency(order.priceCurrencyAddress)?.symbol}</TableCell>
      <TableCell>{order.createdBy}</TableCell>
      <TableCell>{new Date(order.validUntil).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button disabled={disabled} onClick={onClick} label={label} />
      </TableCell>
    </TableRow>
  );
}
