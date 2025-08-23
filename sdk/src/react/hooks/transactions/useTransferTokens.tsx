import { type Abi, type Address, erc721Abi } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { ERC1155_ABI } from '../../../utils';
import { NoWalletConnectedError } from '../../../utils/_internal/error/transaction';
import type { ContractType } from '../../_internal';

interface BaseTransferParams {
	chainId: number;
	collectionAddress: Address;
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

/**
 * Transfers NFTs between addresses supporting both ERC721 and ERC1155
 *
 * This hook provides a simple interface for transferring NFTs from the connected
 * wallet to another address. It automatically detects the contract type and uses
 * the appropriate transfer method (safeTransferFrom for both standards).
 *
 * @returns Token transfer interface
 * @returns returns.transferTokensAsync - Async function to transfer tokens
 * @returns returns.hash - Transaction hash after successful transfer
 * @returns returns.transferring - True while transfer is pending
 * @returns returns.transferFailed - True if the last transfer failed
 * @returns returns.transferSuccess - True if the last transfer succeeded
 *
 * @example
 * Transfer ERC721 token:
 * ```typescript
 * const { transferTokensAsync, transferring, hash } = useTransferTokens();
 *
 * const txHash = await transferTokensAsync({
 *   chainId: 137,
 *   contractType: ContractType.ERC721,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   receiverAddress: '0x...'
 * });
 *
 * console.log('Transfer transaction:', txHash);
 * ```
 *
 * @example
 * Transfer ERC1155 tokens with quantity:
 * ```typescript
 * const { transferTokensAsync, transferring, transferSuccess } = useTransferTokens();
 *
 * try {
 *   await transferTokensAsync({
 *     chainId: 1,
 *     contractType: ContractType.ERC1155,
 *     collectionAddress: collectionAddress,
 *     tokenId: '456',
 *     quantity: '5', // Transfer 5 tokens
 *     receiverAddress: recipientAddress
 *   });
 *
 *   if (transferSuccess) {
 *     console.log('Transfer completed successfully');
 *   }
 * } catch (error) {
 *   console.error('Transfer failed:', error);
 * }
 * ```
 *
 * @example
 * With UI feedback:
 * ```typescript
 * const { transferTokensAsync, transferring, hash } = useTransferTokens();
 *
 * return (
 *   <button
 *     onClick={() => transferTokensAsync(transferParams)}
 *     disabled={transferring}
 *   >
 *     {transferring ? 'Transferring...' : 'Transfer NFT'}
 *   </button>
 *   {hash && <p>Transaction: {hash}</p>}
 * );
 * ```
 *
 * @remarks
 * - Uses `safeTransferFrom` for both ERC721 and ERC1155
 * - Requires the connected wallet to own the tokens being transferred
 * - The quantity parameter is only used for ERC1155 transfers
 * - No approval is needed when transferring your own tokens
 * - The hook uses wagmi's `useWriteContract` internally
 *
 * @throws {NoWalletConnectedError} When no wallet is connected
 *
 * @see {@link ContractType} - Enum for ERC721/ERC1155 types
 * @see {@link TransferTokensParams} - Parameter types for different token standards
 */
export const useTransferTokens = () => {
	const { address: accountAddress } = useAccount();
	const {
		writeContractAsync,
		data: hash,
		isPending,
		isError,
		isSuccess,
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
	};
};
