import { useCallback, useState } from 'react';

import type { Address, Hex } from 'viem';
import {
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi';
import { ERC721_SALE_ABI } from '../../src/utils/abi/primary-sale/sequence-721-sales-contract';

export type ERC721SaleDetails = {
	supplyCap: bigint;
	cost: bigint;
	paymentToken: Address;
	startTime: bigint;
	endTime: bigint;
	merkleRoot: Hex;
};

export function useSaleDetails({
	address,
	chainId,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC721_SALE_ABI,
		functionName: 'saleDetails',
		chainId,
		query: {
			enabled,
		},
	});
}

export function useCheckMerkleProof({
	address: contractAddress,
	chainId,
	root,
	proof,
	addr,
	salt,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	root: Hex;
	proof: Hex[];
	addr: Address;
	salt: Hex;
	enabled?: boolean;
}) {
	return useReadContract({
		address: contractAddress,
		abi: ERC721_SALE_ABI,
		functionName: 'checkMerkleProof',
		args: [root, proof, addr, salt],
		chainId,
		query: {
			enabled,
		},
	});
}

export function useItemsContract({
	address,
	chainId,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC721_SALE_ABI,
		functionName: 'itemsContract',
		chainId,
		query: {
			enabled,
		},
	});
}

export function useMint({
	address,
	chainId,
	onSuccess,
	onError,
}: {
	address: Address;
	chainId?: number;
	onSuccess?: (data: Hex) => void;
	onError?: (error: Error) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const { writeContract, isPending, data: hash } = useWriteContract();
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const mint = useCallback(
		async ({
			to,
			amount,
			paymentToken,
			maxTotal,
			proof,
			value,
		}: {
			to: Address;
			amount: bigint;
			paymentToken: Address;
			maxTotal: bigint;
			proof: Hex[];
			value?: bigint;
		}) => {
			try {
				setIsLoading(true);
				writeContract(
					{
						address,
						abi: ERC721_SALE_ABI,
						functionName: 'mint',
						args: [to, amount, paymentToken, maxTotal, proof],
						chainId,
						value,
					},
					{
						onSuccess,
						onError,
					},
				);
			} catch (err) {
				if (onError && err instanceof Error) onError(err);
			} finally {
				setIsLoading(false);
			}
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	return {
		mint,
		isLoading: isLoading || isPending || isConfirming,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useSetSaleDetails({
	address,
	chainId,
	onSuccess,
	onError,
}: {
	address: Address;
	chainId?: number;
	onSuccess?: (data: Hex) => void;
	onError?: (error: Error) => void;
}) {
	const { writeContract, isPending, data: hash } = useWriteContract();
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const setSaleDetails = useCallback(
		({
			supplyCap,
			cost,
			paymentToken,
			startTime,
			endTime,
			merkleRoot,
		}: {
			supplyCap: bigint;
			cost: bigint;
			paymentToken: Address;
			startTime: bigint;
			endTime: bigint;
			merkleRoot: Hex;
		}) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'setSaleDetails',
					args: [supplyCap, cost, paymentToken, startTime, endTime, merkleRoot],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	return {
		setSaleDetails,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useWithdrawETH({
	address,
	chainId,
	onSuccess,
	onError,
}: {
	address: Address;
	chainId?: number;
	onSuccess?: (data: Hex) => void;
	onError?: (error: Error) => void;
}) {
	const { writeContract, isPending, data: hash } = useWriteContract();
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const withdrawETH = useCallback(
		({ to, value }: { to: Address; value: bigint }) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'withdrawETH',
					args: [to, value],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	return {
		withdrawETH,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useWithdrawERC20({
	address,
	chainId,
	onSuccess,
	onError,
}: {
	address: Address;
	chainId?: number;
	onSuccess?: (data: Hex) => void;
	onError?: (error: Error) => void;
}) {
	const { writeContract, isPending, data: hash } = useWriteContract();
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const withdrawERC20 = useCallback(
		({ token, to, value }: { token: Address; to: Address; value: bigint }) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'withdrawERC20',
					args: [token, to, value],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	return {
		withdrawERC20,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useRoleManagement({
	address,
	chainId,
	onSuccess,
	onError,
}: {
	address: Address;
	chainId?: number;
	onSuccess?: (data: Hex) => void;
	onError?: (error: Error) => void;
}) {
	const { writeContract, isPending, data: hash } = useWriteContract();
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const grantRole = useCallback(
		({ role, account }: { role: Hex; account: Address }) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'grantRole',
					args: [role, account],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	const revokeRole = useCallback(
		({ role, account }: { role: Hex; account: Address }) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'revokeRole',
					args: [role, account],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	const renounceRole = useCallback(
		({ role, account }: { role: Hex; account: Address }) => {
			writeContract(
				{
					address,
					abi: ERC721_SALE_ABI,
					functionName: 'renounceRole',
					args: [role, account],
					chainId,
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[address, chainId, writeContract, onSuccess, onError],
	);

	return {
		grantRole,
		revokeRole,
		renounceRole,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useHasRole({
	address,
	chainId,
	role,
	account,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	role: Hex;
	account: Address;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC721_SALE_ABI,
		functionName: 'hasRole',
		args: [role, account],
		chainId,
		query: {
			enabled,
		},
	});
}

export function useGetRoleAdmin({
	address,
	chainId,
	role,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	role: Hex;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC721_SALE_ABI,
		functionName: 'getRoleAdmin',
		args: [role],
		chainId,
		query: {
			enabled,
		},
	});
}

export function useDefaultAdminRole({
	address,
	chainId,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC721_SALE_ABI,
		functionName: 'DEFAULT_ADMIN_ROLE',
		chainId,
		query: {
			enabled,
		},
	});
}
