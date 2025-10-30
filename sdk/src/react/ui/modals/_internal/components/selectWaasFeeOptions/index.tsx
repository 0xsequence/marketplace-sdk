'use client';

import { Skeleton, Text } from '@0xsequence/design-system';
import type { FeeOption } from '../../../../../../types/waas-types';
import { cn } from '../../../../../../utils';
import type { WaasFeeSelectionState } from '../../hooks/useWaasFeeSelection';
import WaasFeeOptionsSelect from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import ActionButtons from './_components/ActionButtons';
import BalanceIndicator from './_components/BalanceIndicator';
import useWaasFeeBalance from './useWaasFeeBalance';

type SelectWaasFeeOptionsProps = {
	chainId: number;
	waasFees: WaasFeeSelectionState;
	titleOnConfirm?: string;
	className?: string;
};

const SelectWaasFeeOptions = ({
	chainId,
	waasFees,
	titleOnConfirm,
	className,
}: SelectWaasFeeOptionsProps) => {
	const {
		isVisible,
		selectedFeeOption,
		pendingConfirmation,
		confirmed,
		setSelectedFeeOption,
		handleConfirm,
		handleCancel,
	} = waasFees;
	const { currencyBalance, currencyBalanceLoading, insufficientBalance } =
		useWaasFeeBalance({
			chainId,
			selectedFeeOption,
			pendingFeeOptionConfirmation: pendingConfirmation,
		});
	const isSponsored = pendingConfirmation?.options?.length === 0;

	if (!isVisible || isSponsored || !selectedFeeOption) {
		return null;
	}

	return (
		<div
			className={cn(
				'flex w-full flex-col gap-2 border-border-base border-t bg-button-emphasis p-0 pt-4 backdrop-blur-md',
				className,
			)}
		>
			<Text className="mb-2 font-body font-bold text-text-100">
				{confirmed ? titleOnConfirm : 'Select a fee option'}
			</Text>

			{!confirmed && !pendingConfirmation && (
				<Skeleton className="h-[52px] w-full animate-shimmer rounded-xl" />
			)}

			{(confirmed || pendingConfirmation) && (
				<div
					className={cn(
						'[&>button>span]:overflow-hidden [&>button]:w-full [&>button]:text-xs [&>div]:w-full [&>label]:flex [&>label]:w-full',
						confirmed && 'pointer-events-none opacity-70',
					)}
				>
					<WaasFeeOptionsSelect
						options={
							(pendingConfirmation?.options as FeeOption[]) || [
								selectedFeeOption,
							]
						}
						selectedFeeOption={selectedFeeOption}
						onSelectedFeeOptionChange={setSelectedFeeOption}
					/>
				</div>
			)}

			<div className="flex w-full items-start justify-between">
				{!confirmed && (!pendingConfirmation || currencyBalanceLoading) && (
					<Skeleton className="h-[20px] w-2/3 animate-shimmer rounded-xl" />
				)}

				{(confirmed || (pendingConfirmation && !currencyBalanceLoading)) && (
					<BalanceIndicator
						insufficientBalance={insufficientBalance}
						currencyBalance={currencyBalance}
						selectedFeeOption={selectedFeeOption}
					/>
				)}
			</div>

			<ActionButtons
				onCancel={handleCancel}
				onConfirm={handleConfirm}
				disabled={
					!selectedFeeOption?.token ||
					insufficientBalance ||
					currencyBalanceLoading
				}
				loading={currencyBalanceLoading}
				confirmed={confirmed}
				tokenSymbol={selectedFeeOption?.token.symbol}
			/>
		</div>
	);
};

export default SelectWaasFeeOptions;
