import { observer } from "@legendapp/state/react";
import { transactionStatusModal$ } from "./store";
import { Close, Content, Overlay, Portal, Root } from "@radix-ui/react-dialog";
import {
  closeButton,
  dialogOverlay,
  transactionStatusModalContent,
} from "./styles.css";
import { CloseIcon, IconButton, Text } from "@0xsequence/design-system";
import { useCollectible } from "@react-hooks/useCollectible";
import { Address } from "viem";
import TransactionPreview from "../transactionPreview";
import { TokenMetadata } from "@types";
import TransactionFooter from "../transaction-footer";

export type ShowTransactionStatusModalArgs = {
  collectionAddress: string;
  chainId: string;
  tokenId: string;
  title: string;
  message: string;
  creatorAddress: Address;
};

export const useTransactionStatusModal = () => {
  return {
    show: (args: ShowTransactionStatusModalArgs) =>
      transactionStatusModal$.open(args),
    close: () => transactionStatusModal$.close(),
  };
};

const TransactionStatusModal = observer(() => {
  const {
    status,
    collectionAddress,
    chainId,
    tokenId,
    title,
    message,
    creatorAddress,
  } = transactionStatusModal$.state.get();
  const { data: collectible } = useCollectible({
    collectionAddress,
    chainId,
    collectibleId: tokenId,
  });

  return (
    <Root open={transactionStatusModal$.isOpen.get()}>
      <Portal>
        <Overlay className={dialogOverlay} />

        <Content className={transactionStatusModalContent}>
          <Text fontSize="large" fontWeight="bold" color="text100">
            {title}
          </Text>

          <Text fontSize="small" color="text200">
            {message}
          </Text>

          <TransactionPreview
            collectionAddress={collectionAddress}
            chainId={chainId}
            collectible={collectible as TokenMetadata}
            status={status}
          />

          <TransactionFooter status={status} creatorAddress={creatorAddress!} />

          <Close
            onClick={() => {
              transactionStatusModal$.delete();
            }}
            className={closeButton}
            asChild
          >
            <IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
});

export default TransactionStatusModal;
