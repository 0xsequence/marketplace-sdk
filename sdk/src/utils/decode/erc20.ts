import { decodeFunctionData, erc20Abi, type Hex } from 'viem';

interface DecodedApprovalData {
	spender: string;
	value: bigint;
}

export function decodeERC20Approval(calldata: Hex): DecodedApprovalData {
	const decoded = decodeFunctionData({
		abi: erc20Abi,
		data: calldata,
	});

	if (decoded.functionName !== 'approve') {
		throw new Error('Not an ERC20 approval transaction');
	}

	const [spender, value] = decoded.args;

	return {
		spender,
		value,
	};
}
