'use client';

import { Button, Skeleton, Spinner, Text } from '@0xsequence/design-system';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';
import { cn } from '../../../../../../utils';
import { useWaasFeeBalance } from '../../../../../hooks/utils/useWaasFeeBalance';
import WaasFeeOptionsSelect from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import BalanceIndicator from './_components/BalanceIndicator';

type SelectWaasFeeOptionsProps = {
	chainId: number;
	feeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
	selectedOption: FeeOptionExtended;
	onSelectedOptionChange: (option: FeeOptionExtended | undefined) => void;
	onConfirm: () => void;
	optionConfirmed: boolean;
	titleOnConfirm?: string;
	className?: string;
};

const SelectWaasFeeOptions = ({
	chainId,
	feeOptionConfirmation,
	selectedOption,
	onSelectedOptionChange,
	onConfirm,
	optionConfirmed,
	titleOnConfirm,
	className,
}: SelectWaasFeeOptionsProps) => {
	const {
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		noBalanceForAnyOption,
	} = useWaasFeeBalance({
		chainId,
		selectedFeeOption: selectedOption,
		pendingFeeOptionConfirmation: feeOptionConfirmation
			? {
					...feeOptionConfirmation,
					options: feeOptionConfirmation.options as FeeOptionExtended[],
				}
			: undefined,
	});

	return (
		<div
			className={cn(
				'flex w-full flex-col gap-2 border-border-base border-t bg-button-emphasis p-0 pt-4 backdrop-blur-md',
				className,
			)}
		>
			<Text
				className={cn(
					'mb-2 font-body font-bold text-text-100',
					optionConfirmed && 'animate-pulse',
				)}
			>
				{optionConfirmed ? titleOnConfirm : 'Select a fee option'}
			</Text>

			{(optionConfirmed || feeOptionConfirmation) && (
				<div
					className={cn(
						'[&>button>span]:overflow-hidden [&>button]:w-full [&>button]:text-xs [&>div]:w-full [&>label]:flex [&>label]:w-full',
						optionConfirmed && 'pointer-events-none opacity-70',
					)}
				>
					<WaasFeeOptionsSelect
						options={
							(feeOptionConfirmation?.options as FeeOptionExtended[]) || [
								selectedOption,
							]
						}
						selectedFeeOption={selectedOption}
						onSelectedFeeOptionChange={onSelectedOptionChange}
					/>
				</div>
			)}

			<div className="flex w-full items-start justify-between">
				{!optionConfirmed &&
					(!feeOptionConfirmation || currencyBalanceLoading) && (
						<Skeleton className="h-[16px] w-2/3 animate-shimmer rounded-xl" />
					)}

				{(optionConfirmed ||
					(feeOptionConfirmation && !currencyBalanceLoading)) && (
					<BalanceIndicator
						insufficientBalance={insufficientBalance}
						currencyBalance={currencyBalance}
						selectedFeeOption={selectedOption}
					/>
				)}
			</div>

			<Button
				variant={noBalanceForAnyOption ? 'destructive' : 'primary'}
				shape="square"
				size="lg"
				onClick={onConfirm}
				disabled={
					optionConfirmed || insufficientBalance || noBalanceForAnyOption
				}
				className="mt-2 flex justify-center"
			>
				{optionConfirmed && (
					<Spinner
						size="sm"
						className="flex items-center justify-center text-white"
					/>
				)}
				{noBalanceForAnyOption ? 'No balance for any option' : 'Accept Offer'}
			</Button>
		</div>
	);
};

export default SelectWaasFeeOptions;
