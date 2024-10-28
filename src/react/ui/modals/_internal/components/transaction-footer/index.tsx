import { truncateMiddle } from "../../../../../../utils";
import SvgPositiveCircleIcon from "../../../../icons/PositiveCircleIcon";
import { Box, Spinner, Text } from "@0xsequence/design-system";
import { TransactionStatusExtended } from "../transactionStatusModal/store";
import { Address } from "viem";

type TransactionFooterProps = {
  status: TransactionStatusExtended;
  creatorAddress: Address;
};

export default function TransactionFooter({
  status,
  creatorAddress,
}: TransactionFooterProps) {
  return (
    <Box display="flex" alignItems="center">
      {
        (status === "PENDING" && <Spinner size="md" />) ||
          (status === "SUCCESSFUL" && <SvgPositiveCircleIcon size="md" />)
        // TODO: Add failure icon
      }

      <Text color="text50" fontSize="normal" fontWeight="medium" marginLeft="2">
        {
          (status === "PENDING" && "Processing transaction") ||
            (status === "SUCCESSFUL" && "Transaction complete")
          // TODO: Add failure message
        }
      </Text>

      <Text
        // TODO: Replace "polygonLight" with the actual color from design system
        color="polygonLight"
        flexGrow="1"
        textAlign="right"
        fontSize="normal"
        fontWeight="medium"
        marginLeft="2"
      >
        {truncateMiddle(creatorAddress, 4, 4)}
      </Text>
    </Box>
  );
}
