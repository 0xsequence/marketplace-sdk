'use client';

import { Button, Text } from '@0xsequence/design-system';
import type { TokenMetadata } from '@0xsequence/metadata';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import type { Currency, Order } from '../../../../_internal';

export interface FallbackPurchaseUIProps {
	chainId: number;
	collectible: TokenMetadata;
	order: Order;
	currency: Currency;
	calldata: {
		to: string;
		data: string;
		value?: string;
	};
	onExecute: () => Promise<void>;
}

export const FallbackPurchaseUI = ({
	chainId,
	collectible,
	order,
	currency,
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

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-start gap-4">
					<img
						src={collectible?.image}
						alt={collectible?.name}
						className="h-16 w-16 rounded-lg object-cover"
					/>
					<div className="flex flex-col">
						<div className="flex flex-col">
							<Text className="font-bold text-lg">
								{collectible?.name} #{collectible?.tokenId}
							</Text>
						</div>

						<div className="mt-2">
							<Text className="font-bold text-2xl">
								{order?.priceAmountFormatted} {currency?.symbol}
							</Text>
							<Text className="text-text-50">${order?.priceUSDFormatted}</Text>
						</div>
					</div>
				</div>

				<Button
					onClick={handleExecute}
					pending={isExecuting}
					disabled={hasInsufficientBalance}
					variant="primary"
					size="lg"
					label={isExecuting ? 'Confirming...' : 'Buy Now'}
					className="w-full"
				/>
			</div>
		</div>
	);
};
