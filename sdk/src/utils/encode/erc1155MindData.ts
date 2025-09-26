import { type Address, encodeFunctionData, type Hex } from 'viem';
import { ContractType } from '../../react/_internal';
import { SalesContractVersion, useSalesContractABI } from '../../react/hooks';
import {
	ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155_SALES_CONTRACT_ABI_V1,
} from '../abi';
import { DEFAULT_DATA, DEFAULT_PROOF } from '../const';

interface ERC1155MintArgs {
	to: Address;
	tokenIds: bigint[];
	amounts: bigint[];
	data?: Hex;
	expectedPaymentToken: Address;
	maxTotal: bigint;
	proof?: Hex[];
	salesContractAddress: Address;
	chainId: number;
}

const encodeERC1155MintData = ({
	to,
	tokenIds,
	amounts,
	data = DEFAULT_DATA,
	expectedPaymentToken,
	maxTotal,
	proof = DEFAULT_PROOF,
	salesContractAddress,
	chainId,
}: ERC1155MintArgs): Hex => {
	if (
		!to ||
		!tokenIds ||
		!amounts ||
		!expectedPaymentToken ||
		!maxTotal ||
		!salesContractAddress ||
		!chainId
	) {
		console.error('Invalid arguments', {
			to,
			tokenIds,
			amounts,
			expectedPaymentToken,
			maxTotal,
		});
		throw new Error('Invalid arguments');
	}

	const { version } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled: true,
	});

	return encodeFunctionData({
		abi:
			version === SalesContractVersion.V0
				? ERC1155_SALES_CONTRACT_ABI_V0
				: ERC1155_SALES_CONTRACT_ABI_V1,
		functionName: 'mint',
		args: [to, tokenIds, amounts, data, expectedPaymentToken, maxTotal, proof],
	});
};

export { encodeERC1155MintData };
