import { useCallback, useState } from 'react';

import type { Address, Hex } from 'viem';
import {
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../sequence-1155-sales-contract';

export type ERC1155SaleDetails = {
	cost: bigint;
	supplyCap: bigint;
	startTime: bigint;
	endTime: bigint;
	merkleRoot: Hex;
};

export function useGlobalSaleDetails({
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'globalSaleDetails',
		chainId,
		query: {
			enabled,
		},
	});
}

export function useTokenSaleDetails({
	address,
	chainId,
	tokenId,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	tokenId: bigint;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'tokenSaleDetails',
		args: [tokenId],
		chainId,
		query: {
			enabled,
		},
	});
}

export function usePaymentToken({
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'paymentToken',
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'checkMerkleProof',
		args: [root, proof, addr, salt],
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
			tokenIds,
			amounts,
			data,
			expectedPaymentToken,
			maxTotal,
			proof,
			value,
		}: {
			to: Address;
			tokenIds: bigint[];
			amounts: bigint[];
			data: Hex;
			expectedPaymentToken: Address;
			maxTotal: bigint;
			proof: Hex[];
			value?: bigint;
		}) => {
			try {
				setIsLoading(true);
				writeContract(
					{
						address,
						abi: ERC1155_SALES_CONTRACT_ABI,
						functionName: 'mint',
						args: [
							to,
							tokenIds,
							amounts,
							data,
							expectedPaymentToken,
							maxTotal,
							proof,
						],
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

export function useSetGlobalSaleDetails({
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

	const setGlobalSaleDetails = useCallback(
		({
			cost,
			supplyCap,
			startTime,
			endTime,
			merkleRoot,
		}: {
			cost: bigint;
			supplyCap: bigint;
			startTime: bigint;
			endTime: bigint;
			merkleRoot: Hex;
		}) => {
			writeContract(
				{
					address,
					abi: ERC1155_SALES_CONTRACT_ABI,
					functionName: 'setGlobalSaleDetails',
					args: [cost, supplyCap, startTime, endTime, merkleRoot],
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
		setGlobalSaleDetails,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useSetTokenSaleDetails({
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

	const setTokenSaleDetails = useCallback(
		({
			tokenId,
			cost,
			supplyCap,
			startTime,
			endTime,
			merkleRoot,
		}: {
			tokenId: bigint;
			cost: bigint;
			supplyCap: bigint;
			startTime: bigint;
			endTime: bigint;
			merkleRoot: Hex;
		}) => {
			writeContract(
				{
					address,
					abi: ERC1155_SALES_CONTRACT_ABI,
					functionName: 'setTokenSaleDetails',
					args: [tokenId, cost, supplyCap, startTime, endTime, merkleRoot],
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
		setTokenSaleDetails,
		isPending,
		isConfirming,
		isSuccess,
		hash,
	};
}

export function useSetPaymentToken({
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

	const setPaymentToken = useCallback(
		({ paymentTokenAddr }: { paymentTokenAddr: Address }) => {
			writeContract(
				{
					address,
					abi: ERC1155_SALES_CONTRACT_ABI,
					functionName: 'setPaymentToken',
					args: [paymentTokenAddr],
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
		setPaymentToken,
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
					abi: ERC1155_SALES_CONTRACT_ABI,
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
					abi: ERC1155_SALES_CONTRACT_ABI,
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
					abi: ERC1155_SALES_CONTRACT_ABI,
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
					abi: ERC1155_SALES_CONTRACT_ABI,
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
					abi: ERC1155_SALES_CONTRACT_ABI,
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
		abi: ERC1155_SALES_CONTRACT_ABI,
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'getRoleAdmin',
		args: [role],
		chainId,
		query: {
			enabled,
		},
	});
}

export function useGetRoleMember({
	address,
	chainId,
	role,
	index,
	enabled = true,
}: {
	address: Address;
	chainId?: number;
	role: Hex;
	index: bigint;
	enabled?: boolean;
}) {
	return useReadContract({
		address,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'getRoleMember',
		args: [role, index],
		chainId,
		query: {
			enabled,
		},
	});
}

export function useGetRoleMemberCount({
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'getRoleMemberCount',
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
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'DEFAULT_ADMIN_ROLE',
		chainId,
		query: {
			enabled,
		},
	});
}
