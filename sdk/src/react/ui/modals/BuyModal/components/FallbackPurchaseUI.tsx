'use client';

import { Button, Divider, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { getPresentableChainName } from '../../../../../utils/network';

export interface FallbackPurchaseUIProps {
	chainId: number;
	calldata: {
		to: string;
		data: string;
		value?: string;
	};
	onExecute: () => Promise<void>;
}

export const FallbackPurchaseUI = ({
	chainId,
	calldata,
	onExecute,
}: FallbackPurchaseUIProps) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const { address } = useAccount();
	const { data: balance } = useBalance({ address, chainId });

	const value = BigInt(calldata.value || 0);
	const hasInsufficientBalance = balance ? balance.value < value : false;

	const handleExecute = async () => {
		setIsExecuting(true);
		try {
			await onExecute();
		} catch (error) {
			console.error('Transaction failed:', error);
		} finally {
			setIsExecuting(false);
		}
	};

	const chainName = getPresentableChainName(chainId);

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="rounded-lg border border-border-weak bg-background-secondary p-4">
				<Text className="mb-3 font-bold">Transaction Details</Text>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<Text className="text-text-50" variant="small">
							Network
						</Text>
						<Text className="font-mono" variant="small">
							{chainName}
						</Text>
					</div>
					<Divider />
					<div className="flex items-center justify-between">
						<Text className="text-text-50" variant="small">
							To
						</Text>
						<Text className="font-mono" variant="small">
							{`${calldata.to.slice(0, 6)}...${calldata.to.slice(-4)}`}
						</Text>
					</div>
					<Divider />
					<div className="flex items-center justify-between">
						<Text className="text-text-50" variant="small">
							Value
						</Text>
						<Text className="font-mono" variant="small">
							{formatEther(value)} ETH
						</Text>
					</div>
					{balance && (
						<>
							<Divider />
							<div className="flex items-center justify-between">
								<Text className="text-text-50" variant="small">
									Your Balance
								</Text>
								<Text
									className={`font-mono ${hasInsufficientBalance ? 'text-negative' : ''}`}
									variant="small"
								>
									{formatEther(balance.value)} ETH
								</Text>
							</div>
						</>
					)}
				</div>
			</div>

			<Button
				onClick={handleExecute}
				pending={isExecuting}
				disabled={hasInsufficientBalance}
				variant="primary"
				size="lg"
				label={isExecuting ? 'Confirming...' : 'Send Transaction'}
				className="w-full"
			/>
		</div>
	);
};
