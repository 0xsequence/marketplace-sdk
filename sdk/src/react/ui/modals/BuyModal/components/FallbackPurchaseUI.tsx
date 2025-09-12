'use client';

import { Button, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import { type Step, StepType } from '../../../../_internal';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';

export interface FallbackPurchaseUIProps {
	chainId: number;
	steps: Step[];
}

export const FallbackPurchaseUI = ({
	chainId,
	steps,
}: FallbackPurchaseUIProps) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const buyStep = steps.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error('Buy step not found');
	const approvalStep = steps.find((step) => step.id === StepType.tokenApproval);

	const { collectible, currencyAddress, currency, order } = useBuyModalData();

	const { data, isLoading } = useHasSufficientBalance({
		chainId,
		value: BigInt(buyStep?.price || 0),
		tokenAddress: currencyAddress,
	});

	const hasSufficientBalance = data?.hasSufficientBalance;

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
								{buyStep?.price} {currency?.symbol}
							</Text>
							<Text className="text-text-50">${order?.priceUSDFormatted}</Text>
						</div>
					</div>
				</div>

				{/* {approvalStep && (
					<Button
						onClick={handleApprove}
						pending={isExecuting}
						disabled={!hasSufficientBalance}
						variant="primary"
						size="lg"
						label={isExecuting ? 'Confirming...' : 'Buy Now'}
						className="w-full"
					/>
				)} */}

				<Button
					onClick={() => {
						console.log('execute');
					}}
					pending={isExecuting}
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
