import { Box, Card, Button, Text, useToast } from "@0xsequence/design-system";
import {
  useMakeOfferModal,
  useCreateListingModal,
  useTransferModal,
  useSellModal,
  CollectibleCard,
  useListListingsForCollectible,
  useListOffersForCollectible,
  useCurrencies,
  useCancelOrder,
  useCollectible,
  useCollection,
  useListCollectibles,
  useBalanceOfCollectible,
  useBuyModal,
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
import {
  compareAddress,
  type ContractType,
  OrderSide,
  type Order,
} from "@0xsequence/marketplace-sdk";
import { useState } from "react";

export function Collectible() {
  const context = useMarketplace();
  const { address: accountAddress } = useAccount();
  const { collectionAddress, chainId, collectibleId } = context;
  const { data: collectible, isLoading: collectibleLoading } = useCollectible({
    collectionAddress,
    chainId,
    collectibleId,
  });
  // we need to have this since we use CollectibleOrder type instead of Order in the CollectibleCard
  const { data: filteredCollectibles, isLoading: filteredCollectiblesLoading } =
    useListCollectibles({
      collectionAddress,
      chainId,
      side: OrderSide.listing,
      filter: {
        includeEmpty: true,
        searchText: collectible?.name,
      },
    });
  const { data: collection, isLoading: collectionLoading } = useCollection({
    collectionAddress,
    chainId,
  });
  const { data: balance } = useBalanceOfCollectible({
    collectionAddress,
    chainId,
    collectableId: collectibleId,
    userAddress: accountAddress,
  });

  const filteredCollectible = filteredCollectibles?.pages[0].collectibles.find(
    (fc) => fc.metadata.tokenId === collectibleId
  );

  return (
    <Box paddingTop="3" gap="3" flexDirection="column">
      <Box gap="3">
        <Box>
          <CollectibleCard
            collectibleId={collectibleId}
            chainId={chainId}
            collectionAddress={collectionAddress}
            collectionType={collection?.type as ContractType}
            lowestListing={filteredCollectible}
            onOfferClick={({ order }) => console.log(order)}
            balance={balance?.balance}
            cardLoading={
              collectibleLoading ||
              filteredCollectiblesLoading ||
              collectionLoading
            }
          />
        </Box>

        <Card gap='3' flexDirection='column'>
          <Text variant="large">Collectible Details</Text>
          <Text>{`Name: ${collectible?.name}`}</Text>
          <Text>{`ID: ${collectibleId}`}</Text>
        </Card>
      </Box>
      <Actions isOwner={!!balance?.balance} />
      <ListingsTable />
      <OffersTable />
    </Box>
  );
}

function Actions({
  isOwner
}:
{isOwner: boolean}) {
  const context = useMarketplace();
  const toast = useToast();
  
  const { show: openMakeOfferModal } = useMakeOfferModal({
    onSuccess: (hash) => {
      toast({
        title: "Success",
        variant: "success",
        description: `Transaction submitted: ${hash}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "error",
        description: error.message,
      });
    },
  });

  const { show: openCreateListingModal } = useCreateListingModal({
    onSuccess: (hash) => {
      toast({
        title: "Success",
        variant: "success",
        description: `Transaction submitted: ${hash}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "error",
        description: error.message,
      });
    },
  });

  const { show: openTransferModal } = useTransferModal();

  const { isConnected } = useAccount();

  const hooksProps = {
    collectionAddress: context.collectionAddress,
    chainId: context.chainId,
    collectibleId: context.collectibleId,
  };

  return (
    <Box>
      {!isConnected && (
        <Text variant="large">Connect Wallet to see collectable actions</Text>
      )}
      <Card gap="6" justifyContent="center">
        <Box gap="3">
          <Button
            variant="primary"
            onClick={() => openMakeOfferModal(hooksProps)}
            label="Make Offer"
            disabled={!isConnected}
          />
        </Box>
        <Box gap="3">
          <Button
            variant="primary"
            onClick={() => openCreateListingModal(hooksProps)}
            label="Create Listing"
            disabled={!isConnected || !isOwner}
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
            disabled={!isConnected || !isOwner}
          />
        </Box>
      </Card>
    </Box>
  );
}

function ListingsTable() {
  const { collectionAddress, chainId, collectibleId } = useMarketplace();
  const [page, setPage] = useState(0);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  const { data: listings, isLoading } = useListListingsForCollectible({
    collectionAddress,
    chainId,
    collectibleId,
    page: {
      page: page,
      pageSize: 30,
    },
  });
  const { address } = useAccount();
  const { cancel } = useCancelOrder({
    chainId,
    collectionAddress,
  });
  const toast = useToast();
  const {show: openBuyModal} = useBuyModal({
    onSuccess: (hash) => {
      toast({
        title: "Success",
        variant: "success",
        description: `Transaction submitted: ${hash}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "error",
        description: error.message,
      });
    },
  });

  const getLabel = (order: Order) => {
    return compareAddress(order.createdBy, address) ? "Cancel" : "Buy";
  };

  const handleAction = (order: Order) => {
    if (compareAddress(order.createdBy, address)) {
      cancel({
        orderId: order.orderId,
        marketplace: order.marketplace,
      });
    } else {
      openBuyModal({
        collectionAddress: collectionAddress,
        chainId: chainId,
        tokenId: collectibleId,
        order: order,
      });
    }
  };

  return (
    <OrdersTable
      isLoading={isLoading}
      items={listings?.listings}
      emptyMessage="No listings available"
      actionLabelFn={getLabel}
      onAction={handleAction}
      nextPage={nextPage}
      prevPage={prevPage}
      isPrevDisabled={page === 0}
      isNextDisabled={listings?.page?.more === false}
      type="listings"
    />
  );
}

function OffersTable() {
  const context = useMarketplace();
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  const { data: offers, isLoading } = useListOffersForCollectible({
    collectionAddress: context.collectionAddress,
    chainId: context.chainId,
    collectibleId: context.collectibleId,
    page: {
      page: page,
      pageSize: 30,
    },
  });
  const toast = useToast();
  const { show: openSellModal } = useSellModal({
    onSuccess: (hash) => {
      toast({
        title: "Success",
        variant: "success",
        description: `Transaction submitted: ${hash}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "error",
        description: error.message,
      });
    },
  });

  return (
    <OrdersTable
      isLoading={isLoading}
      items={offers?.offers}
      emptyMessage="No offers available"
      actionLabelFn={() => "Sell"}
      disableOnAction={(order) => order.createdBy === address}
      nextPage={nextPage}
      prevPage={prevPage}
      isPrevDisabled={page === 0}
      isNextDisabled={!offers?.page?.more}
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
  items?: Order[];
  emptyMessage: string;
  actionLabelFn: (order: Order) => string;
  onAction: (order: Order) => void;
  disableOnAction?: (order: Order) => boolean;
  type: "listings" | "offers";
  nextPage: () => void;
  prevPage: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

function OrdersTable({
  isLoading,
  items,
  emptyMessage,
  actionLabelFn,
  onAction,
  type,
  nextPage,
  prevPage,
  isPrevDisabled,
  isNextDisabled,
}: TableProps) {
  if (isLoading) {
    return <Box>Loading {type}...</Box>;
  }

  if (!items?.length) {
    return <Box>{emptyMessage}</Box>;
  }

  return (
    <>
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
              actionLabel={actionLabelFn(item)}
              onAction={onAction}
            />
          ))}
        </TableBody>
      </Table>
      <Box
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Button
          label="Previous page"
          onClick={prevPage}
          disabled={isPrevDisabled}
        />
        <Button
          label="Next page"
          onClick={nextPage}
          disabled={isNextDisabled}
        />
      </Box>
    </>
  );
}

function OrdersTableRow({
  order,
  actionLabel,
  onAction,
  disableOnAction,
}: {
  order: Order;
  actionLabel: string;
  onAction: (order: Order) => void;
  disableOnAction?: (order: Order) => boolean;
}) {
  const { chainId } = useMarketplace();
  const { data: currencies } = useCurrencies({ chainId });

  const getCurrency = (currencyAddress: string) => {
    return currencies?.find(
      (currency) => currency.contractAddress === currencyAddress
    );
  };

  return (
    <TableRow key={order.orderId}>
      <TableCell>{order.priceAmountFormatted}</TableCell>
      <TableCell>{getCurrency(order.priceCurrencyAddress)?.symbol}</TableCell>
      <TableCell>{order.createdBy}</TableCell>
      <TableCell>{new Date(order.validUntil).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button
          disabled={disableOnAction?.(order) || false}
          onClick={() => onAction(order)}
          label={actionLabel}
        />
      </TableCell>
    </TableRow>
  );
}
