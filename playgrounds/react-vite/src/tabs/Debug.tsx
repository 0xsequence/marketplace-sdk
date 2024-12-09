import {
  Box,
  Card,
  Button,
  Text,
  Select,
  TextArea,
  TextInput,
} from "@0xsequence/design-system";
import { useState } from "react";
import { decodeErrorResult, type Hex, decodeFunctionData, toFunctionSelector, trim } from "viem";
import {
  ERC1155_ABI,
  ERC20_ABI,
  ERC721_ABI,
  getPublicRpcClient,
  SequenceMarketplaceV1_ABI,
  SequenceMarketplaceV2_ABI,
} from "@0xsequence/marketplace-sdk";
import { useSwitchChain } from "wagmi";

import { SeaportABI } from "../lib/abis/seaport";

const ABIs = {
  ERC20: ERC20_ABI,
  ERC721: ERC721_ABI,
  ERC1155: ERC1155_ABI,
  SequenceMarketplaceV1: SequenceMarketplaceV1_ABI,
  SequenceMarketplaceV2: SequenceMarketplaceV2_ABI,
  Seaport: SeaportABI,
} as const;

export function Debug() {
  const [selectedAbi, setSelectedAbi] = useState<keyof typeof ABIs>("ERC20");
  const [errorData, setErrorData] = useState<Hex>();
  const [inputData, setInputData] = useState<Hex>();

  const handleDecodeError = () => {
    try {
      const decoded = decodeErrorResult({
        abi: ABIs[selectedAbi],
        data: errorData as Hex,
      });
      console.dir(decoded)
    } catch (err) {
      console.dir(err)
    }
  };

  const handleDecodeData = () => {
    try {
      const decoded = decodeFunctionData({
        abi: ABIs[selectedAbi],
        data: trim(inputData as Hex)
      });
      console.dir(decoded);
    } catch (err) {
      console.dir(err);
    }
  };

  const getFunctionSignatures = () => {
    const abi = ABIs[selectedAbi];
    return abi
      .filter((item) => item.type === 'function')
      .map((func) => {
        try {
          const signature = toFunctionSelector(func)
          return `${func.name}: ${signature}`;
        } catch (err) {
          return `${func.name}: Error generating signature`;
        }
      });
  };

  const { switchChain } = useSwitchChain()

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
        <Box padding="3" background="negative">
          <Text>Open your console to see decoded results</Text>
        </Box>
        <Text variant="large">Decode data</Text>
        <Box gap="3" alignItems="flex-end">
          <Box flexGrow="1">
            <TextArea
              name="inputData"
              label="Input Data"
              labelLocation="top"
              value={inputData}
              onChange={(e) => setInputData(e.target.value as Hex)}
              placeholder="Enter function data (0x...)"
            />
          </Box>
          <Button
            variant="primary"
            onClick={handleDecodeData}
            label="Decode Data"
            disabled={!inputData}
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
            onClick={handleDecodeError}
            label="Decode Error"
            disabled={!errorData}
          />
        </Box>
        <CheckApproval selectedAbi={selectedAbi} />
      </Card>
      <Card>
        <Text variant="large">Function Signatures</Text>
        <Box padding="3" flexDirection="column" gap="2">
          {getFunctionSignatures().map((signature, index) => (
            <Text key={index}>{signature}</Text>
          ))}
        </Box>
      </Card>

      <Card>
        <Text variant="large">Switch Chain</Text>
        <Button variant="primary" label="Switch to polygon" onClick={() => switchChain({ chainId: 137 })} />
      </Card>



    </Box>
  );
}

function CheckApproval({ selectedAbi }: { selectedAbi: keyof typeof ABIs }) {
  const [contractAddress, setContractAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState('1');
  const [spenderAddress, setSpenderAddress] = useState('');
  const [result, setResult] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!contractAddress || !walletAddress || !spenderAddress || !chainId) return;

    setIsLoading(true);
    try {
      const publicClient = getPublicRpcClient(chainId);


      let data;
      switch (selectedAbi) {
        case 'ERC20':
          data = await publicClient.readContract({
            address: contractAddress as Hex,
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: [walletAddress, spenderAddress] as [Hex, Hex],
          });
          break;
        case 'ERC721':
          data = await publicClient.readContract({
            address: contractAddress as Hex,
            abi: ERC721_ABI,
            functionName: 'isApprovedForAll',
            args: [walletAddress, spenderAddress] as [Hex, Hex],
          });
          break;
        case 'ERC1155':
          data = await publicClient.readContract({
            address: contractAddress as Hex,
            abi: ERC1155_ABI,
            functionName: 'isApprovedForAll',
            args: [walletAddress, spenderAddress] as [Hex, Hex],
          });
          break;
        default:
          throw new Error('Unsupported contract type for approval checking');
      }

      setResult(String(data));
    } catch (error) {
      console.error(error);
      setResult('Error checking approval');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Text variant="large">Check Token Approval</Text>
      <Box gap="3" flexDirection="column">
        <TextInput
          name="chainId"
          label="Chain ID"
          labelLocation="top"
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          placeholder="Enter chain ID"
        />
        <TextInput
          name="contractAddress"
          label="Contract Address"
          labelLocation="top"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address"
        />
        <TextInput
          name="walletAddress"
          label="Wallet Address"
          labelLocation="top"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
        />
        <TextInput
          name="spenderAddress"
          label="Spender Address"
          labelLocation="top"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
          placeholder="Enter spender address"
        />
        <Button
          variant="primary"
          onClick={handleCheck}
          label="Check Approval"
          disabled={isLoading || !contractAddress || !walletAddress || !spenderAddress || !chainId}
        />
        {result && (
          <Box padding="3" background={result.includes('Error') || result === "0" ? 'negative' : 'positive'}>
            <Text>
              {!isNaN(Number(result)) 
                ? `Allowance amount: ${result}`
                : result}
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
}