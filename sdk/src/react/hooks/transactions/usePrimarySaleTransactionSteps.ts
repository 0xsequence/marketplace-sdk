import { type ContractType, type Step, StepType } from '@0xsequence/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { encodeFunctionData, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../../../utils/abi';
import {
	SalesContractVersion,
	useSalesContractABI,
} from '../contracts/useSalesContractABI';

export interface UsePrimarySaleTransactionStepsParams {
	chainId: number;
	buyer: Address;
	recipient?: Address;
	salesContractAddress: Address;
	tokenIds: bigint[];
	amounts: number[];
	maxTotal: bigint;
	paymentToken: Address;
	merkleProof?: string[];
	contractType: ContractType.ERC721 | ContractType.ERC1155;
	enabled?: boolean;
}

/**
 * Hook to generate transaction steps for primary sale transactions (minting/shop)
 * This directly creates steps without using generators
 */
export function usePrimarySaleTransactionSteps({
	chainId,
	buyer,
	recipient,
	salesContractAddress,
	tokenIds,
	amounts,
	maxTotal,
	paymentToken,
	merkleProof = [],
	contractType,
	enabled = true,
}: UsePrimarySaleTransactionStepsParams) {
	const queryEnabled =
		enabled &&
		!!buyer &&
		!!salesContractAddress &&
		tokenIds.length > 0 &&
		amounts.length > 0 &&
		maxTotal !== undefined &&
		paymentToken !== undefined;
	// Get the correct ABI version for this sales contract
	const {
		abi,
		version,
		isLoading: abiLoading,
	} = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType,
		chainId,
		enabled,
	});

	// Check allowance if using ERC20
	const { data: allowance, isLoading: allowanceLoading } = useReadContract({
		address: paymentToken,
		abi: ERC20_ABI,
		functionName: 'allowance',
		args: [buyer, salesContractAddress],
		chainId,
		query: {
			enabled: enabled && !!buyer && paymentToken !== zeroAddress,
		},
	});

	return useQuery<{ steps: Step[]; canBeUsedWithTrails: boolean }, Error>({
		queryKey: [
			'primary-sale-steps',
			{
				chainId,
				salesContractAddress,
				tokenIds,
				amounts,
				buyer,
				maxTotal,
				paymentToken,
			},
		],
		queryFn: async () => {
			if (!abi) {
				throw new Error('Unable to determine sales contract ABI');
			}

			const steps: Step[] = [];

			// Add approval step if needed
			if (
				paymentToken !== zeroAddress &&
				allowance !== undefined &&
				allowance < maxTotal
			) {
				const approvalCalldata = encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'approve',
					args: [salesContractAddress, maxTotal],
				});

				steps.push({
					id: StepType.tokenApproval,
					data: approvalCalldata,
					to: paymentToken,
					value: 0n,
					price: 0n,
				});
			}

			// Format mint args based on version
			const mintArgs = formatMintArgs({
				recipient: recipient || buyer,
				tokenIds,
				amounts,
				paymentToken,
				maxTotal,
				merkleProof,
				version: version!,
			});

			// Add mint step
			const mintCalldata = encodeFunctionData({
				abi,
				functionName: 'mint',
				args: mintArgs as any, // Type assertion needed due to complex ABI types
			});

			steps.push({
				id: StepType.buy,
				data: mintCalldata,
				to: salesContractAddress,
				value: paymentToken === zeroAddress ? maxTotal : 0n,
				price: maxTotal,
			});

			return {
				steps,
				canBeUsedWithTrails: true,
			};
		},
		enabled: queryEnabled && !!abi && !abiLoading && !allowanceLoading,
	});
}

/**
 * Format mint arguments based on contract version
 */
function formatMintArgs({
	recipient,
	tokenIds,
	amounts,
	paymentToken,
	maxTotal,
	merkleProof,
	version,
}: {
	recipient: Address;
	tokenIds: bigint[];
	amounts: number[];
	paymentToken: Address;
	maxTotal: bigint;
	merkleProof: string[];
	version: SalesContractVersion;
}): unknown[] {
	// V1 contracts have different argument order than V0
	if (version === SalesContractVersion.V1) {
		return [
			recipient, // to
			tokenIds, // tokenIds
			amounts, // amounts
			'0x', // data (empty bytes)
			paymentToken, // expectedPaymentToken
			maxTotal, // maxTotal
			merkleProof, // proof
		];
	}

	// V0 contracts
	return [
		recipient, // to
		tokenIds, // tokenIds
		amounts, // amounts
		paymentToken, // expectedPaymentToken
		maxTotal, // maxTotal
		'0x', // data (empty bytes)
	];
}
