'use client';

import { Button, Text } from '@0xsequence/design-system';
import type { TokenMetadata } from '@0xsequence/metadata';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import type { Currency, Order, Step } from '../../../../_internal';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';
import { Address } from 'viem';
import { useBuyModalData } from '../hooks/useBuyModalData';

export interface FallbackPurchaseUIProps {
	chainId: number;
	steps: Step[];
}

export const FallbackPurchaseUI = ({
	chainId,
	steps,
}: FallbackPurchaseUIProps) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const buyStep = steps.find((step) => step.id === 'buy');
	if (!buyStep) throw new Error('Buy step not found');

	const { collectible, currencyAddress, currency, order } = useBuyModalData();

	const { data, isLoading } = useHasSufficientBalance({
		chainId,
		value: BigInt(buyStep?.price || 0),
		tokenAddress: currencyAddress,
	});


	const hasSufficientBalance = data?.hasSufficientBalance;

	const handleExecute = async () => {
		setIsExecuting(true);
		try {
			// await onExecute();
			console.log('execute');
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
					pending={isExecuting || isLoading}
					disabled={!hasSufficientBalance}
					variant="primary"
					size="lg"
					label={isExecuting ? 'Confirming...' : 'Buy Now'}
					className="w-full"
				/>
			</div>
		</div>
	);
};
