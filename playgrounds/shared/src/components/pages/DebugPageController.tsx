import {
	Button,
	Card,
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
import {
	useAccount,
	useSignTypedData,
	useSwitchChain,
	useWriteContract,
} from 'wagmi';
import { z } from 'zod';
import { SeaportABI } from '../../abis/seaport';

// Seaport order validation schema based on OpenSea listing parameters
const SeaportOrderSchema = z.object({
	// Core order parameters
	offerer: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid offerer address'),
	zone: z
		.string()
		.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid zone address')
		.optional(),
	zoneHash: z
		.string()
		.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid zone hash')
		.optional(),
	startTime: z.number().int().min(0).optional(),
	endTime: z.number().int().min(0).optional(),
	orderType: z.number().int().min(0).max(255).optional(),
	salt: z
		.string()
		.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid salt')
		.optional(),
	conduitKey: z
		.string()
		.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid conduit key')
		.optional(),
	counter: z.number().int().min(0).optional(),

	offer: z
		.array(
			z.object({
				itemType: z.number().int().min(0).max(3), // 0: ETH, 1: ERC20, 2: ERC721, 3: ERC1155
				token: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
				identifierOrCriteria: z
					.string()
					.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
				startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
				endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
			}),
		)
		.min(1, 'At least one offer item required'),

	consideration: z
		.array(
			z.object({
				itemType: z.number().int().min(0).max(3),
				token: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
				identifierOrCriteria: z
					.string()
					.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
				startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
				endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
				recipient: z
					.string()
					.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
			}),
		)
		.min(1, 'At least one consideration item required'),

	protocolData: z
		.object({
			parameters: z.object({
				offerer: z
					.string()
					.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid offerer address'),
				zone: z
					.string()
					.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid zone address')
					.optional(),
				zoneHash: z
					.string()
					.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid zone hash')
					.optional(),
				startTime: z.number().int().min(0).optional(),
				endTime: z.number().int().min(0).optional(),
				orderType: z.number().int().min(0).max(255).optional(),
				salt: z
					.string()
					.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid salt')
					.optional(),
				conduitKey: z
					.string()
					.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid conduit key')
					.optional(),
				counter: z.number().int().min(0).optional(),
				offer: z
					.array(
						z.object({
							itemType: z.number().int().min(0).max(3),
							token: z
								.string()
								.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
							identifierOrCriteria: z
								.string()
								.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
							startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
							endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
						}),
					)
					.min(1),
				consideration: z
					.array(
						z.object({
							itemType: z.number().int().min(0).max(3),
							token: z
								.string()
								.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
							identifierOrCriteria: z
								.string()
								.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
							startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
							endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
							recipient: z
								.string()
								.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
						}),
					)
					.min(1),
			}),
			signature: z.string().optional(),
		})
		.optional(),

	chainId: z.number().int().positive().optional(),
	verifyingContract: z
		.string()
		.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid verifying contract')
		.optional(),

	parameters: z
		.object({
			offerer: z
				.string()
				.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid offerer address'),
			zone: z
				.string()
				.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid zone address')
				.optional(),
			zoneHash: z
				.string()
				.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid zone hash')
				.optional(),
			startTime: z.number().int().min(0).optional(),
			endTime: z.number().int().min(0).optional(),
			orderType: z.number().int().min(0).max(255).optional(),
			salt: z
				.string()
				.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid salt')
				.optional(),
			conduitKey: z
				.string()
				.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid conduit key')
				.optional(),
			counter: z.number().int().min(0).optional(),
			offer: z
				.array(
					z.object({
						itemType: z.number().int().min(0).max(3),
						token: z
							.string()
							.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
						identifierOrCriteria: z
							.string()
							.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
						startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
						endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
					}),
				)
				.min(1),
			consideration: z
				.array(
					z.object({
						itemType: z.number().int().min(0).max(3),
						token: z
							.string()
							.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
						identifierOrCriteria: z
							.string()
							.regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid identifier'),
						startAmount: z.string().regex(/^\d+$/, 'Invalid start amount'),
						endAmount: z.string().regex(/^\d+$/, 'Invalid end amount'),
						recipient: z
							.string()
							.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
					}),
				)
				.min(1),
		})
		.optional(),
});

const ABIs = {
	ERC20: ERC20_ABI,
	ERC721: ERC721_ABI,
	ERC1155: ERC1155_ABI,
	SEQUENCE_1155_ITEMS_ABI: SEQUENCE_1155_ITEMS_ABI,
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
	const [seaportOrderData, setSeaportOrderData] = useState('');
	const [seaportSignature, setSeaportSignature] = useState('');
	const [isSigningSeaport, setIsSigningSeaport] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [isValidating, setIsValidating] = useState(false);
	const { signTypedDataAsync } = useSignTypedData();

	const validateSeaportOrder = async (orderDataString: string) => {
		setIsValidating(true);
		setValidationErrors([]);

		try {
			const parsedData = JSON.parse(orderDataString);
			const validatedData = SeaportOrderSchema.parse(parsedData);
			setValidationErrors([]);
			return validatedData;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors = (error as z.ZodError).issues.map(
					(issue) => `${issue.path.join('.')}: ${issue.message}`,
				);
				setValidationErrors(errors);
			} else if (error instanceof SyntaxError) {
				setValidationErrors(['Invalid JSON format']);
			} else {
				setValidationErrors(['Unknown validation error']);
			}
			return null;
		} finally {
			setIsValidating(false);
		}
	};

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
				<div className="bg-negative p-3">
					<Text>Open your console to see decoded results</Text>
				</div>
				<Text variant="large">Decode data</Text>
				<div className="flex items-end gap-3">
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

				<div className="flex items-end gap-3">
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
				<Text variant="large">Seaport Order Signing</Text>
				<div className="flex flex-col gap-3">
					<TextArea
						name="seaportOrderData"
						label="Seaport Order Data (JSON)"
						labelLocation="top"
						value={seaportOrderData}
						onChange={(e) => setSeaportOrderData(e.target.value)}
						placeholder="Paste your Seaport order data here..."
						rows={8}
					/>
					<Button
						variant="base"
						onClick={() => validateSeaportOrder(seaportOrderData)}
						label="Validate Order Data"
						disabled={!seaportOrderData || isValidating}
					/>

					{validationErrors.length > 0 && (
						<div className="rounded bg-negative p-3">
							<Text variant="small" className="font-semibold text-white">
								Validation Errors:
							</Text>
							{validationErrors.map((error) => (
								<Text key={error} className="text-sm text-white">
									• {error}
								</Text>
							))}
						</div>
					)}

					<Button
						variant="primary"
						onClick={async () => {
							if (!seaportOrderData) return;

							const validatedData =
								await validateSeaportOrder(seaportOrderData);
							if (!validatedData) {
								setSeaportSignature('Please fix validation errors first');
								return;
							}

							setIsSigningSeaport(true);
							try {
								// Seaport v1.5 domain
								const domain = {
									name: 'Seaport',
									version: '1.5',
									chainId: validatedData.chainId || 1,
									verifyingContract: (validatedData.verifyingContract ||
										'0x00000000000001ad428e4906aE43D8F9852d0dD6') as `0x${string}`,
								};

								// Seaport order types
								const types = {
									OrderComponents: [
										{ name: 'offerer', type: 'address' },
										{ name: 'zone', type: 'address' },
										{ name: 'zoneHash', type: 'bytes32' },
										{ name: 'startTime', type: 'uint256' },
										{ name: 'endTime', type: 'uint256' },
										{ name: 'orderType', type: 'uint8' },
										{ name: 'salt', type: 'bytes32' },
										{ name: 'conduitKey', type: 'bytes32' },
										{ name: 'counter', type: 'uint256' },
									],
								};

								// Extract order components from the validated data
								const orderComponents = {
									offerer:
										validatedData.offerer ||
										validatedData.parameters?.offerer ||
										validatedData.protocolData?.parameters.offerer,
									zone:
										validatedData.zone ||
										validatedData.parameters?.zone ||
										validatedData.protocolData?.parameters.zone ||
										'0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
									zoneHash:
										validatedData.zoneHash ||
										validatedData.parameters?.zoneHash ||
										validatedData.protocolData?.parameters.zoneHash ||
										'0x0000000000000000000000000000000000000000000000000000000000000000',
									startTime:
										validatedData.startTime ||
										validatedData.parameters?.startTime ||
										validatedData.protocolData?.parameters.startTime ||
										0,
									endTime:
										validatedData.endTime ||
										validatedData.parameters?.endTime ||
										validatedData.protocolData?.parameters.endTime ||
										0,
									orderType:
										validatedData.orderType ||
										validatedData.parameters?.orderType ||
										validatedData.protocolData?.parameters.orderType ||
										0,
									salt:
										validatedData.salt ||
										validatedData.parameters?.salt ||
										validatedData.protocolData?.parameters.salt ||
										'0x0000000000000000000000000000000000000000000000000000000000000000',
									conduitKey:
										validatedData.conduitKey ||
										validatedData.parameters?.conduitKey ||
										validatedData.protocolData?.parameters.conduitKey ||
										'0x0000000000000000000000000000000000000000000000000000000000000000',
									counter:
										validatedData.counter ||
										validatedData.parameters?.counter ||
										validatedData.protocolData?.parameters.counter ||
										0,
								};

								const signature = await signTypedDataAsync({
									domain,
									types,
									primaryType: 'OrderComponents',
									message: orderComponents,
								});

								setSeaportSignature(signature);
								console.log('Seaport order signed:', signature);
							} catch (error) {
								console.error('Error signing Seaport order:', error);
								setSeaportSignature('Error signing order');
							} finally {
								setIsSigningSeaport(false);
							}
						}}
						label="Sign Seaport Order"
						disabled={
							!seaportOrderData ||
							isSigningSeaport ||
							validationErrors.length > 0
						}
					/>
					{seaportSignature && !seaportSignature.startsWith('Error') && (
						<div className="rounded bg-positive p-3">
							<Text variant="small" className="font-semibold text-white">
								Signature:
							</Text>
							<Text className="break-all font-mono text-sm text-white">
								{seaportSignature}
							</Text>
						</div>
					)}

					{seaportSignature?.startsWith('Error') && (
						<div className="rounded bg-negative p-3">
							<Text className="text-white">{seaportSignature}</Text>
						</div>
					)}
				</div>
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
				<div className="flex flex-col gap-3">
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
				<div className="flex items-end gap-3">
					<div className="grow">
						<TextInput
							name="walletAddress"
							label="Wallet Address"
							labelLocation="top"
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							placeholder="Enter wallet address"
						/>
					</div>
					<Button
						onClick={() =>
							connectedWalletAddress && setWalletAddress(connectedWalletAddress)
						}
						label="Use connected Wallet"
						disabled={!connectedWalletAddress}
					/>
				</div>
				<TextInput
					name="spenderAddress"
					label="Spender Address"
					labelLocation="top"
					value={spenderAddress}
					onChange={(e) => setSpenderAddress(e.target.value)}
					placeholder="Enter spender address"
				/>
				<div className="flex gap-3">
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
					{selectedAbi === 'ERC20' && (
						<Button
							variant="danger"
							onClick={handleRevokeApproval}
							label="Set Approval to 0"
							disabled={
								isRevoking ||
								isPending ||
								!contractAddress ||
								!spenderAddress ||
								!chainId
							}
						/>
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

const getPublicClient = (chainId: string) => {
	const network = findNetworkConfig(allNetworks, chainId);
	if (!network) throw new Error('Network not found');
	return createPublicClient({
		chain: networkToWagmiChain(network),
		transport: http(),
	});
};
