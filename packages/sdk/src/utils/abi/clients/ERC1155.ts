import type { Hex, WalletClient } from 'viem';
import { encodeFunctionData, getContract } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

import { getPublicRpcClient } from '../../get-public-rpc-client';
import { ERC1155_ABI } from '../abi/token/ERC1155';

// biome-ignore lint/complexity/noStaticOnlyClass: In this case, this provide a pretty nice API
export class ERC1155 {
	static setApprovalForAll = async (
		erc1155Address: string,
		operator: string,
		approved: boolean,
		signer: GetWalletClientData<any, any>,
	): Promise<string> => {
		const txHash = await signer.writeContract({
			chain: signer.chain,
			address: erc1155Address as Hex,
			abi: ERC1155_ABI,
			functionName: 'setApprovalForAll',
			args: [operator as Hex, approved],
		});

		return txHash;
	};

	static setApprovalForAll_data = (
		operator: string,
		approved: boolean,
	): string => {
		return encodeFunctionData({
			abi: ERC1155_ABI,
			functionName: 'setApprovalForAll',
			args: [operator as Hex, approved],
		});
	};

	static isApprovedForAll = async (
		erc1155Address: string,
		owner: string,
		operator: string,
		chainId: number,
	) => {
		const contract = getERC1155Contract({
			contractAddress: erc1155Address,
			chainId,
		});
		return contract.read.isApprovedForAll([owner as Hex, operator as Hex]);
	};

	static balanceOf = async (
		erc1155Address: string,
		owner: string,
		tokenId: string,
		chainId: number,
	): Promise<bigint> => {
		const contract = getERC1155Contract({
			contractAddress: erc1155Address,
			chainId,
		});
		return contract.read.balanceOf([owner as Hex, BigInt(tokenId)]);
	};
}

interface ContractInstanceParams {
	contractAddress: string;
	chainId: number;
	signer?: WalletClient;
}

const getERC1155Contract = (args: ContractInstanceParams) => {
	const publicClient = getPublicRpcClient(args.chainId);

	return getContract({
		address: args.contractAddress as Hex,
		abi: ERC1155_ABI,
		client: {
			public: publicClient,
			wallet: args.signer,
		},
	});
};
