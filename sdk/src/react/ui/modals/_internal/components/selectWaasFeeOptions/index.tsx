'use client';

import { Separator, Skeleton, Text } from '@0xsequence/design-system';
import type { FeeOption } from '../../../../../../types/waas-types';
import { cn } from '../../../../../../utils';
import WaasFeeOptionsSelect from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import ActionButtons from './_components/ActionButtons';
import BalanceIndicator from './_components/BalanceIndicator';
import { useSelectWaasFeeOptionsStore } from './store';
import useWaasFeeOptionManager from './useWaasFeeOptionManager';

type SelectWaasFeeOptionsProps = {
	onCancel?: () => void;
	chainId: number;
	titleOnConfirm?: string;
	className?: string;
};

const SelectWaasFeeOptions = ({
	chainId,
	onCancel,
	titleOnConfirm,
	className,
}: SelectWaasFeeOptionsProps) => {
	const { isVisible, hide, setSelectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const {
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption,
		rejectPendingFeeOption,
	} = useWaasFeeOptionManager(chainId);

	const handleCancelFeeOption = () => {
		if (pendingFeeOptionConfirmation?.id) {
			rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		}

		hide();
		onCancel?.();
	};

	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const shouldDisplay =
		!isSponsored &&
		(isVisible || !!pendingFeeOptionConfirmation?.options?.length);

	if (!shouldDisplay || !selectedFeeOption) {
		return null;
	}

	return (
		<div
			className={cn(
				'flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-0 backdrop-blur-md',
				className,
			)}
		>
			<Separator className="mt-0 mb-4" />

			<Text className="mb-2 font-body font-bold text-large text-text-100">
				{feeOptionsConfirmed ? titleOnConfirm : 'Select a fee option'}
			</Text>

			{!feeOptionsConfirmed && !pendingFeeOptionConfirmation && (
				<Skeleton className="h-[52px] w-full animate-shimmer rounded-xl" />
			)}

			{(feeOptionsConfirmed || pendingFeeOptionConfirmation) && (
				<div
					className={cn(
						'[&>label>button>span]:overflow-hidden [&>label>button]:w-full [&>label>button]:text-xs [&>label>div]:w-full [&>label]:flex [&>label]:w-full',
						feeOptionsConfirmed && 'pointer-events-none opacity-70',
					)}
				>
					<WaasFeeOptionsSelect
						options={
							(pendingFeeOptionConfirmation?.options as FeeOption[]) || [
								selectedFeeOption,
							]
						}
						selectedFeeOption={selectedFeeOption}
						onSelectedFeeOptionChange={setSelectedFeeOption}
						currencyBalance={currencyBalance}
					/>
				</div>
			)}

			<div className="flex w-full items-start justify-between">
				{!feeOptionsConfirmed &&
					(!pendingFeeOptionConfirmation || currencyBalanceLoading) && (
						<Skeleton className="h-4 w-2/3 animate-shimmer rounded-xl" />
					)}

				{(feeOptionsConfirmed ||
					(pendingFeeOptionConfirmation && !currencyBalanceLoading)) && (
					<BalanceIndicator
						insufficientBalance={insufficientBalance}
						currencyBalance={currencyBalance}
						selectedFeeOption={selectedFeeOption}
					/>
				)}
			</div>

			<ActionButtons
				onCancel={handleCancelFeeOption}
				onConfirm={handleConfirmFeeOption}
				disabled={
					!selectedFeeOption?.token ||
					insufficientBalance ||
					currencyBalanceLoading
				}
				loading={currencyBalanceLoading}
				confirmed={feeOptionsConfirmed}
				tokenSymbol={selectedFeeOption?.token.symbol}
			/>
		</div>
	);
};

export default SelectWaasFeeOptions;
