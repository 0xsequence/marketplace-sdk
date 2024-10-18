import type { Hex, WalletClient } from 'viem';
import { encodeFunctionData, getContract, maxUint256 } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

import { getPublicRpcClient } from '../../get-public-rpc-client';
import { ERC20_ABI } from '../abi/token/ERC20';

export class ERC20 {
	static approve = async (
		erc20Address: string,
		spender: string,
		amount: bigint,
		signer: GetWalletClientData<any, any>,
	): Promise<string> => {
		const txHash = await signer.writeContract({
			chain: signer.chain,
			address: erc20Address as Hex,
			abi: ERC20_ABI,
			functionName: 'approve',
			args: [spender as Hex, amount],
		});

		return txHash;
	};

	static approve_data = (spender: string, amount: bigint): string => {
		return encodeFunctionData({
			abi: ERC20_ABI,
			functionName: 'approve',
			args: [spender as Hex, amount],
		});
	};

	static approveInfinite = async (
		erc20Address: string,
		spender: string,
		signer: GetWalletClientData<any, any>,
	): Promise<string> => {
		const txHash = await signer.writeContract({
			chain: signer.chain,
			address: erc20Address as Hex,
			abi: ERC20_ABI,
			functionName: 'approve',
			args: [spender as Hex, maxUint256],
		});

		return txHash;
	};

	static approveInfinite_data = (spender: string): string => {
		return encodeFunctionData({
			abi: ERC20_ABI,
			functionName: 'approve',
			args: [spender as Hex, maxUint256],
		});
	};

	static getAllowance = async (
		erc20Address: string,
		owner: string,
		spender: string,
		chainId: number,
	): Promise<bigint> => {
		const contract = getERC20Contract({
			contractAddress: erc20Address,
			chainId,
		});
		return contract.read.allowance([owner as Hex, spender as Hex]);
	};

	static balanceOf = async (
		erc20Address: string,
		owner: string,
		chainId: number,
	): Promise<bigint> => {
		const contract = getERC20Contract({
			contractAddress: erc20Address,
			chainId,
		});
		return contract.read.balanceOf([owner as Hex]);
	};
}

interface ContractInstanceParams {
	contractAddress: string;
	chainId: number;
	signer?: WalletClient;
}

const getERC20Contract = (args: ContractInstanceParams) => {
	const publicClient = getPublicRpcClient(args.chainId);

	return getContract({
		address: args.contractAddress as Hex,
		abi: ERC20_ABI,
		client: {
			public: publicClient,
			wallet: args.signer,
		},
	});
};
