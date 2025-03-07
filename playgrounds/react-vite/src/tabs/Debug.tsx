import {
	Button,
	Card,
	Modal,
	Select,
	Text,
	TextArea,
	TextInput,
} from '@0xsequence/design-system2';
import {
	ERC20_ABI,
	ERC721_ABI,
	ERC1155_ABI,
	SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2_ABI,
} from '@0xsequence/marketplace-sdk';
import { useState } from 'react';
import {
	type AbiFunction,
	type Hex,
	decodeErrorResult,
	decodeFunctionData,
	toFunctionSelector,
	trim,
} from 'viem';
import { useAccount, usePublicClient, useSwitchChain } from 'wagmi';

import { SeaportABI } from '../lib/abis/seaport';

const ABIs = {
	ERC20: ERC20_ABI,
	ERC721: ERC721_ABI,
	ERC1155: ERC1155_ABI,
	SequenceMarketplaceV1: SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2: SequenceMarketplaceV2_ABI,
	Seaport: SeaportABI,
} as const;

export function Debug() {
	const [selectedAbi, setSelectedAbi] = useState<keyof typeof ABIs>('ERC20');
	const [errorData, setErrorData] = useState<Hex>();
	const [inputData, setInputData] = useState<Hex>();
	const [isChainModalOpen, setIsChainModalOpen] = useState(false);
	const publicClient = usePublicClient();
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
					// @ts-ignore
					return `${func.name}: ${signature}`;
				} catch (err) {
					// @ts-ignore
					return `${func.name}: Error generating signature`;
				}
			});
	};

	return (
		<div className="flex pt-3 gap-3 flex-col">
			<Card>
				<div className="flex justify-between">
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
				</div>
				<div className="p-3 bg-negative">
					<Text>Open your console to see decoded results</Text>
				</div>
				<Text variant="large">Decode data</Text>
				<div className="flex gap-3 items-end">
					<div className="grow">
						<TextArea
							name="inputData"
							label="Input Data"
							labelLocation="top"
							value={inputData}
							onChange={(e) => setInputData(e.target.value as Hex)}
							placeholder="Enter function data (0x...)"
						/>
					</div>
					<Button
						variant="primary"
						onClick={handleDecodeData}
						label="Decode Data"
						disabled={!inputData}
					/>
				</div>

				<div className="flex gap-3 items-end">
					<div className="grow">
						<TextArea
							name="errorData"
							label="Error Data"
							labelLocation="top"
							value={errorData}
							onChange={(e) => setErrorData(e.target.value as Hex)}
							placeholder="Enter error data (0x...)"
						/>
					</div>
					<Button
						variant="primary"
						onClick={handleDecodeError}
						label="Decode Error"
						disabled={!errorData}
					/>
				</div>
				<CheckApproval selectedAbi={selectedAbi} />
			</Card>
			<Card>
				<Text variant="large">Function Signatures</Text>
				<div className="flex p-3 flex-col gap-2">
					{getFunctionSignatures().map((signature) => (
						<Text key={signature}>{signature}</Text>
					))}
				</div>
			</Card>
			<Card>
				<Text variant="large">Switch Chain</Text>
				<Button
					variant="primary"
					label="Open Chain Selector"
					onClick={() => setIsChainModalOpen(true)}
				/>
				<ChainSwitchModal
					isOpen={isChainModalOpen}
					onClose={() => setIsChainModalOpen(false)}
				/>
			</Card>
			<Card>
				<Text variant="large">Simulate Call</Text>
				<div className="flex gap-3 flex-col">
					<TextInput
						name="simulateChainId"
						label="Chain ID"
						labelLocation="top"
						placeholder="Enter chain ID"
					/>
					<TextInput
						name="simulateAccount"
						label="Account"
						labelLocation="top"
						placeholder="Enter account address"
					/>
					<TextInput
						name="simulateData"
						label="Data"
						labelLocation="top"
						placeholder="Enter call data"
					/>
					<TextInput
						name="simulateTo"
						label="To"
						labelLocation="top"
						placeholder="Enter recipient address"
					/>
					<TextInput
						name="simulateValue"
						label="Value"
						labelLocation="top"
						placeholder="Enter value in wei"
					/>
					<Button
						variant="primary"
						label="Simulate Call"
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

								const result = await publicClient?.call({
									account: account as Hex,
									data: data as Hex,
									to: to as Hex,
									value: value ? BigInt(value) : undefined,
								});

								console.log('Simulation result:', result);
							} catch (error) {
								console.error('Simulation error:', error);
							}
						}}
					/>
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
	const publicClient = usePublicClient();

	const handleCheck = async () => {
		if (!contractAddress || !walletAddress || !spenderAddress || !chainId)
			return;

		setIsLoading(true);
		try {
			let data: string | boolean | bigint | undefined;
			switch (selectedAbi) {
				case 'ERC20':
					data = await publicClient?.readContract({
						address: contractAddress as Hex,
						abi: ERC20_ABI,
						functionName: 'allowance',
						args: [walletAddress, spenderAddress] as [Hex, Hex],
					});
					break;
				case 'ERC721':
					data = await publicClient?.readContract({
						address: contractAddress as Hex,
						abi: ERC721_ABI,
						functionName: 'isApprovedForAll',
						args: [walletAddress, spenderAddress] as [Hex, Hex],
					});
					break;
				case 'ERC1155':
					data = await publicClient?.readContract({
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
			<div className="flex gap-3 flex-col">
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
					disabled={
						isLoading ||
						!contractAddress ||
						!walletAddress ||
						!spenderAddress ||
						!chainId
					}
				/>
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
				{chains.map((chainInfo) => (
					<Button
						className="w-full"
						key={chainInfo.id}
						disabled={chain?.id === chainInfo.id}
						label={chainInfo.name}
						onClick={async () => {
							await switchChainAsync({ chainId: chainInfo.id });
							onClose();
						}}
					/>
				))}
			</div>
		</Modal>
	);
}
