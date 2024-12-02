import {
  Box,
  Card,
  Button,
  Text,
  Select,
  TextArea,
} from "@0xsequence/design-system";
import { useState } from "react";
import { decodeErrorResult, type Hex } from "viem";
import {
  ERC1155_ABI,
  ERC20_ABI,
  ERC721_ABI,
  SequenceMarketplaceV1_ABI,
  SequenceMarketplaceV2_ABI,
} from "@0xsequence/marketplace-sdk";

const ABIs = {
  ERC20: ERC20_ABI,
  ERC721: ERC721_ABI,
  ERC1155: ERC1155_ABI,
  SequenceMarketplaceV1: SequenceMarketplaceV1_ABI,
  SequenceMarketplaceV2: SequenceMarketplaceV2_ABI,
} as const;

export function Debug() {
  const [selectedAbi, setSelectedAbi] = useState<keyof typeof ABIs>("ERC20");
  const [errorData, setErrorData] = useState<Hex>();
  const [decodedError, setDecodedError] = useState<string>();
  const [error, setError] = useState<string>();

  const handleDecode = () => {
    try {
      setError(undefined);
      const decoded = decodeErrorResult({
        abi: ABIs[selectedAbi],
        data: errorData as Hex,
      });
      setDecodedError(
        `Error: ${decoded.errorName}\nArgs: ${JSON.stringify(
          decoded.args,
          null,
          2
        )}`
      );
    } catch (err) {
      setError((err as Error).message);
      setDecodedError(undefined);
    }
  };

  return (
    <Box paddingTop="3" gap="3" flexDirection="column">
      <Card>
        <Box justifyContent="space-between">
          <Text variant="large">Debug Tools</Text>

          <Select
            label="Select ABI"
            value={selectedAbi}
            name="abi"
            onValueChange={(value) =>
              setSelectedAbi(value as keyof typeof ABIs)
            }
            options={Object.keys(ABIs).map((key) => ({
              label: key,
              value: key,
            }))}
          />
        </Box>
        <Box gap="3" alignItems="flex-end">
          <Box flexGrow="1">
            <TextArea
              name="errorData"
              label="Error Data"
              labelLocation="top"
              value={errorData}
              onChange={(e) => setErrorData(e.target.value as Hex)}
              placeholder="Enter error data (0x...)"
            />
          </Box>
          <Button
            variant="primary"
            onClick={handleDecode}
            label="Decode Error"
            disabled={!errorData}
          />
        </Box>
        {error && (
          <Box padding="3" background="negative">
            <Text>{error}</Text>
          </Box>
        )}
        {decodedError && (
          <Box padding="3">
            <Text style={{ whiteSpace: "pre-wrap" }}>{decodedError}</Text>
          </Box>
        )}
      </Card>
    </Box>
  );
}
