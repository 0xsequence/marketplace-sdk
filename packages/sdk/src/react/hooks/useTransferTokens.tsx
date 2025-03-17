import { type Abi, type Address, type Hex, erc721Abi } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { ERC1155_ABI } from '../../utils';
import { NoWalletConnectedError } from '../../utils/_internal/error/transaction';
import type { ChainId, ContractType } from '../_internal';

interface BaseTransferParams {
	chainId: ChainId;
	collectionAddress: Hex;
	tokenId: string;
	receiverAddress: Address;
}

interface ERC721TransferParams extends BaseTransferParams {
	contractType: ContractType.ERC721;
}

interface ERC1155TransferParams extends BaseTransferParams {
	contractType: ContractType.ERC1155;
	quantity: string;
}

export type TransferTokensParams = ERC721TransferParams | ERC1155TransferParams;

const prepareTransferConfig = (
	params: TransferTokensParams,
	accountAddress: Address,
) => {
	if (params.contractType === 'ERC721') {
		return {
			abi: erc721Abi as Abi,
			address: params.collectionAddress,
			functionName: 'safeTransferFrom',
			args: [
				accountAddress,
				params.receiverAddress,
				BigInt(params.tokenId),
			] as const,
		} as const;
	}

	return {
		abi: ERC1155_ABI as Abi,
		address: params.collectionAddress,
		functionName: 'safeTransferFrom',
		args: [
			accountAddress,
			params.receiverAddress,
			BigInt(params.tokenId),
			params.quantity,
			'0x', // data
		] as const,
	};
};

export const useTransferTokens = (): {
    transferTokensAsync: (params: TransferTokensParams) => Promise<any>;
    hash: any;
    transferring: any;
    transferFailed: any;
    transferSuccess: any;
} => {
	const { address: accountAddress } = useAccount();
	const {
		writeContractAsync,
		data: hash,
		isPending,
		isError,
		isSuccess,
	} = useWriteContract();

	const transferTokensAsync = async (params: TransferTokensParams): Promise<any> => {
		if (!accountAddress) {
			throw new NoWalletConnectedError();
		}

		const config = prepareTransferConfig(params, accountAddress);
		return await writeContractAsync(config);
	};

	return {
		transferTokensAsync,
		hash,
		transferring: isPending,
		transferFailed: isError,
		transferSuccess: isSuccess,
	};
};
