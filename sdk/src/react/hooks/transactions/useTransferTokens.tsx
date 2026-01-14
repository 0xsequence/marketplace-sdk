import type { Address, ContractType } from '@0xsequence/api-client';
import { type Abi, erc721Abi } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import type { WriteContractErrorType } from 'wagmi/actions';
import { ERC1155_ABI } from '../../../utils';
import { NoWalletConnectedError } from '../../../utils/_internal/error/transaction';

interface BaseTransferParams {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	receiverAddress: Address;
}

interface ERC721TransferParams extends BaseTransferParams {
	contractType: ContractType.ERC721;
}

interface ERC1155TransferParams extends BaseTransferParams {
	contractType: ContractType.ERC1155;
	quantity: bigint;
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

export interface UseTransferTokensResult {
	transferTokensAsync: (params: TransferTokensParams) => Promise<Address>;
	hash: Address | undefined;
	transferring: boolean;
	transferFailed: boolean;
	transferSuccess: boolean;
	error: WriteContractErrorType | null;
}

export const useTransferTokens = (): UseTransferTokensResult => {
	const { address: accountAddress } = useAccount();
	const {
		writeContractAsync,
		data: hash,
		isPending,
		isError,
		isSuccess,
		error,
	} = useWriteContract();

	const transferTokensAsync = async (params: TransferTokensParams) => {
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
		error,
	};
};
