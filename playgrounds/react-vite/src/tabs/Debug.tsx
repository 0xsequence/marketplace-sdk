import {
	Box,
	Card,
	Button,
	Text,
	Select,
	TextArea,
} from '@0xsequence/design-system';
import { useState } from 'react';
import {
	decodeErrorResult,
	type Hex,
	decodeFunctionData,
	toFunctionSelector,
} from 'viem';
import {
	ERC1155_ABI,
	ERC20_ABI,
	ERC721_ABI,
	SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2_ABI,
} from '@0xsequence/marketplace-sdk';
import { useSwitchChain } from 'wagmi';
import { SeaportABI } from '../lib/abis/seaport';
import { trim } from 'viem';

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
					const signature = toFunctionSelector(func);
					return `${func.name}: ${signature}`;
				} catch (err) {
					return `${func.name}: Error generating signature`;
				}
			});
	};

	const { switchChain } = useSwitchChain();

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
				<Button
					variant="primary"
					label="Switch to polygon"
					onClick={() => switchChain({ chainId: 137 })}
				/>
			</Card>
		</Box>
	);
}
