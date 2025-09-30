import { type Address, encodeFunctionData, type Hex } from 'viem';
import { SalesContractVersion } from '../../react/hooks';
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
	salesContractVersion: SalesContractVersion;
}

const encodeERC1155MintData = ({
	to,
	tokenIds,
	amounts,
	data = DEFAULT_DATA,
	expectedPaymentToken,
	maxTotal,
	proof = DEFAULT_PROOF,
	salesContractVersion,
}: ERC1155MintArgs): Hex => {
	return encodeFunctionData({
		abi:
			salesContractVersion === SalesContractVersion.V0
				? ERC1155_SALES_CONTRACT_ABI_V0
				: ERC1155_SALES_CONTRACT_ABI_V1,
		functionName: 'mint',
		args: [to, tokenIds, amounts, data, expectedPaymentToken, maxTotal, proof],
	});
};

export { encodeERC1155MintData };
