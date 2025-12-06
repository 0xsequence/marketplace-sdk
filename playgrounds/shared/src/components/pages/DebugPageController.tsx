import {
	Button,
	Card,
	Field,
	FieldLabel,
	Modal,
	Select,
	Text,
	TextArea,
	TextInput,
} from '@0xsequence/design-system';
import {
	ERC20_ABI,
	ERC721_ABI,
	ERC721_SALE_ABI_V0,
	ERC721_SALE_ABI_V1,
	ERC1155_ABI,
	ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155_SALES_CONTRACT_ABI_V1,
	MAIN_MODULE_ABI,
	networkToWagmiChain,
	SEQUENCE_1155_ITEMS_ABI,
	SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2_ABI,
} from '@0xsequence/marketplace-sdk';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import { useState } from 'react';
import {
	type AbiFunction,
	type Address,
	createPublicClient,
	decodeErrorResult,
	decodeFunctionData,
	type Hex,
	http,
	toFunctionSelector,
	trim,
} from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { SeaportABI } from '../../abis/seaport';

const ABIs = {
	MAIN_MODULE: MAIN_MODULE_ABI,
	ERC20: ERC20_ABI,
	ERC721: ERC721_ABI,
	ERC1155: ERC1155_ABI,
	SEQUENCE_1155_ITEMS_ABI,
	SequenceMarketplaceV1: SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2: SequenceMarketplaceV2_ABI,
	ERC1155SalesV0: ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155SalesV1: ERC1155_SALES_CONTRACT_ABI_V1,
	ERC721SaleV0: ERC721_SALE_ABI_V0,
	ERC721SaleV1: ERC721_SALE_ABI_V1,
	Seaport: SeaportABI,
} as const;

export function DebugPageController() {
	const [selectedAbi, setSelectedAbi] = useState<keyof typeof ABIs>('ERC20');
	const [errorData, setErrorData] = useState<Hex>();
	const [inputData, setInputData] = useState<Hex>();
	const [isChainModalOpen, setIsChainModalOpen] = useState(false);
	const handleDecodeError = () => {
		try {
			const decoded = decodeErrorResult({
				abi: ABIs[selectedAbi],
				data: errorData as Hex,
			});
			console.dir(decoded);
		} catch (err) {
			console.dir(err);
		}
	};

	const handleDecodeData = () => {
		try {
			const decoded = decodeFunctionData({
				abi: ABIs[selectedAbi],
				data: trim(inputData as Hex),
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
					const signature = toFunctionSelector(func as AbiFunction);
					// @ts-expect-error
					return `${func.name}: ${signature}`;
				} catch (_err) {
					// @ts-expect-error
					return `${func.name}: Error generating signature`;
				}
			});
	};

	return (
		<div className="flex flex-col gap-3 pt-3">
			<Card>
				<div className="flex justify-between">
					<Text variant="large">Debug Tools</Text>

					<Field>
						<FieldLabel>Select ABI</FieldLabel>
						<Select.Helper
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
					</Field>
				</div>
				<div className="bg-negative p-3">
					<Text>Open your console to see decoded results</Text>
				</div>
				<Text variant="large">Decode data</Text>
				<div className="flex items-end gap-3">
					<div className="grow">
						<Field>
							<FieldLabel>Input Data</FieldLabel>
							<TextArea
								name="inputData"
								value={inputData}
								onChange={(e) => setInputData(e.target.value as Hex)}
								placeholder="Enter function data (0x...)"
							/>
						</Field>
					</div>
					<Button
						variant="primary"
						onClick={handleDecodeData}
						disabled={!inputData}
					>
						Decode Data
					</Button>
				</div>

				<div className="flex items-end gap-3">
					<div className="grow">
						<Field>
							<FieldLabel>Error Data</FieldLabel>
							<TextArea
								name="errorData"
								value={errorData}
								onChange={(e) => setErrorData(e.target.value as Hex)}
								placeholder="Enter error data (0x...)"
							/>
						</Field>
					</div>
					<Button
						variant="primary"
						onClick={handleDecodeError}
						disabled={!errorData}
					>
						Decode Error
					</Button>
				</div>
				<CheckApproval selectedAbi={selectedAbi} />
			</Card>
			<Card>
				<Text variant="large">Function Signatures</Text>
				<div className="flex flex-col gap-2 p-3">
					{getFunctionSignatures().map((signature) => (
						<Text key={signature}>{signature}</Text>
					))}
				</div>
			</Card>
			<Card>
				<Text variant="large">Switch Chain</Text>
				<Button variant="primary" onClick={() => setIsChainModalOpen(true)}>
					Open Chain Selector
				</Button>
				<ChainSwitchModal
					isOpen={isChainModalOpen}
					onClose={() => setIsChainModalOpen(false)}
				/>
			</Card>
			<Card>
				<Text variant="large">Simulate Call</Text>
				<div className="flex flex-col gap-3">
					<Field>
						<FieldLabel>Chain ID</FieldLabel>
						<TextInput name="simulateChainId" placeholder="Enter chain ID" />
					</Field>
					<Field>
						<FieldLabel>Account</FieldLabel>
						<TextInput
							name="simulateAccount"
							placeholder="Enter account address"
						/>
					</Field>
					<Field>
						<FieldLabel>Data</FieldLabel>
						<TextInput name="simulateData" placeholder="Enter call data" />
					</Field>
					<Field>
						<FieldLabel>To</FieldLabel>
						<TextInput
							name="simulateTo"
							placeholder="Enter recipient address"
						/>
					</Field>
					<Field>
						<FieldLabel>Value</FieldLabel>
						<TextInput name="simulateValue" placeholder="Enter value in wei" />
					</Field>
					<Button
						variant="primary"
						onClick={async () => {
							try {
								const chainId = (
									document.querySelector(
										'[name="simulateChainId"]',
									) as HTMLInputElement
								)?.value;
								const account = (
									document.querySelector(
										'[name="simulateAccount"]',
									) as HTMLInputElement
								)?.value;
								const data = (
									document.querySelector(
										'[name="simulateData"]',
									) as HTMLInputElement
								)?.value;
								const to = (
									document.querySelector(
										'[name="simulateTo"]',
									) as HTMLInputElement
								)?.value;
								const value = (
									document.querySelector(
										'[name="simulateValue"]',
									) as HTMLInputElement
								)?.value;

								if (!chainId || !account || !data || !to) {
									console.error('All fields except value are required');
									return;
								}
								const publicClient = getPublicClient(chainId);

								const result = await publicClient?.call({
									account: account as Address,
									data: data as Hex,
									to: to as Hex,
									value: value ? BigInt(value) : undefined,
								});

								console.log('Simulation result:', result);
							} catch (error) {
								console.error('Simulation error:', error);
							}
						}}
					>
						Simulate Call
					</Button>
				</div>
			</Card>
		</div>
	);
}

function CheckApproval({ selectedAbi }: { selectedAbi: keyof typeof ABIs }) {
	const [contractAddress, setContractAddress] = useState('');
	const [walletAddress, setWalletAddress] = useState('');
	const [chainId, setChainId] = useState('1');
	const [spenderAddress, setSpenderAddress] = useState('');
	const [result, setResult] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [isRevoking, setIsRevoking] = useState(false);
	const { address: connectedWalletAddress } = useAccount();
	const { writeContractAsync, isPending } = useWriteContract();

	const handleCheck = async () => {
		if (!contractAddress || !walletAddress || !spenderAddress || !chainId)
			return;

		const publicClient = getPublicClient(chainId);

		setIsLoading(true);
		try {
			let data: string | boolean | bigint | undefined;
			switch (selectedAbi) {
				case 'ERC20':
					data = await publicClient?.readContract({
						address: contractAddress as Address,
						abi: ERC20_ABI,
						functionName: 'allowance',
						args: [walletAddress, spenderAddress] as [Address, Address],
					});
					break;
				case 'ERC721':
					data = await publicClient?.readContract({
						address: contractAddress as Address,
						abi: ERC721_ABI,
						functionName: 'isApprovedForAll',
						args: [walletAddress, spenderAddress] as [Address, Address],
					});
					break;
				case 'ERC1155':
					data = (await publicClient?.readContract({
						address: contractAddress as Address,
						abi: ERC1155_ABI,
						functionName: 'isApprovedForAll',
						args: [walletAddress, spenderAddress] as [Address, Address],
					})) as boolean | undefined;
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

	const handleRevokeApproval = async () => {
		if (!contractAddress || !spenderAddress || !chainId) return;

		if (selectedAbi !== 'ERC20') {
			setResult('Revoke approval is only available for ERC20 tokens');
			return;
		}

		setIsRevoking(true);
		try {
			const ownerAddress = connectedWalletAddress;

			if (!ownerAddress) {
				setResult('No wallet address available. Please connect your wallet');
				setIsRevoking(false);
				return;
			}

			const hash = await writeContractAsync({
				address: contractAddress as Address,
				abi: ERC20_ABI,
				functionName: 'approve',
				args: [spenderAddress as Address, 0n],
			});

			setResult(`Approval set to 0. Transaction hash: ${hash}`);
		} catch (error) {
			console.error(error);
			setResult(`Error revoking approval: ${(error as Error).message}`);
		} finally {
			setIsRevoking(false);
		}
	};

	return (
		<Card>
			<Text variant="large">Check Token Approval</Text>
			<div className="flex flex-col gap-3">
				<Field>
					<FieldLabel>Chain ID</FieldLabel>
					<TextInput
						name="chainId"
						value={chainId}
						onChange={(e) => setChainId(e.target.value)}
						placeholder="Enter chain ID"
					/>
				</Field>
				<Field>
					<FieldLabel>Contract Address</FieldLabel>
					<TextInput
						name="contractAddress"
						value={contractAddress}
						onChange={(e) => setContractAddress(e.target.value)}
						placeholder="Enter contract address"
					/>
				</Field>
				<div className="flex items-end gap-3">
					<div className="grow">
						<Field>
							<FieldLabel>Wallet Address</FieldLabel>
							<TextInput
								name="walletAddress"
								value={walletAddress}
								onChange={(e) => setWalletAddress(e.target.value)}
								placeholder="Enter wallet address"
							/>
						</Field>
					</div>
					<Button
						onClick={() =>
							connectedWalletAddress && setWalletAddress(connectedWalletAddress)
						}
						disabled={!connectedWalletAddress}
					>
						Use connected Wallet
					</Button>
				</div>
				<Field>
					<FieldLabel>Spender Address</FieldLabel>
					<TextInput
						name="spenderAddress"
						value={spenderAddress}
						onChange={(e) => setSpenderAddress(e.target.value)}
						placeholder="Enter spender address"
					/>
				</Field>
				<div className="flex gap-3">
					<Button
						variant="primary"
						onClick={handleCheck}
						disabled={
							isLoading ||
							!contractAddress ||
							!walletAddress ||
							!spenderAddress ||
							!chainId
						}
					>
						Check Approval
					</Button>
					{selectedAbi === 'ERC20' && (
						<Button
							variant="destructive"
							onClick={handleRevokeApproval}
							disabled={
								isRevoking ||
								isPending ||
								!contractAddress ||
								!spenderAddress ||
								!chainId
							}
						>
							Set Approval to 0
						</Button>
					)}
				</div>
				{result && (
					<div className="p-3">
						<Text>
							{!Number.isNaN(Number(result))
								? `Allowance amount: ${result}`
								: result}
						</Text>
					</div>
				)}
			</div>
		</Card>
	);
}

interface ChainSwitchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function ChainSwitchModal({ isOpen, onClose }: ChainSwitchModalProps) {
	const { switchChainAsync, chains } = useSwitchChain();
	const { chain } = useAccount();
	if (!isOpen) return null;

	return (
		<Modal onClose={onClose} size="sm">
			<div className="flex flex-col gap-2 p-10">
				{chains.map((chainInfo: { id: number; name: string }) => (
					<Button
						className="w-full"
						key={chainInfo.id}
						disabled={chain?.id === chainInfo.id}
						onClick={async () => {
							await switchChainAsync({ chainId: chainInfo.id });
							onClose();
						}}
					>
						{chainInfo.name}
					</Button>
				))}
			</div>
		</Modal>
	);
}

const getPublicClient = (chainId: string) => {
	const network = findNetworkConfig(allNetworks, chainId);
	if (!network) throw new Error('Network not found');
	return createPublicClient({
		chain: networkToWagmiChain(network),
		transport: http(),
	});
};
