'use client';

import { getNetwork } from '@0xsequence/connect';
import { Divider, Skeleton, Text } from '@0xsequence/design-system';
import { NetworkType } from '@0xsequence/network';
import { observer } from '@legendapp/state/react';
import type { FeeOption } from '../../../../../../types/waas-types';
import { cn } from '../../../../../../utils';
import WaasFeeOptionsSelect from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import ActionButtons from './_components/ActionButtons';
import BalanceIndicator from './_components/BalanceIndicator';
import { selectWaasFeeOptions$ } from './store';
import useWaasFeeOptionManager from './useWaasFeeOptionManager';

type SelectWaasFeeOptionsProps = {
	onCancel?: () => void;
	chainId: number;
	titleOnConfirm?: string;
	className?: string;
};

const SelectWaasFeeOptions = observer(
	({
		chainId,
		onCancel,
		titleOnConfirm,
		className,
	}: SelectWaasFeeOptionsProps) => {
		const network = getNetwork(chainId);
		const isTestnet = network.type === NetworkType.TESTNET;
		const {
			selectedFeeOption$,
			selectedFeeOption,
			pendingFeeOptionConfirmation,
			currencyBalance,
			currencyBalanceLoading,
			insufficientBalance,
			feeOptionsConfirmed,
			handleConfirmFeeOption,
		} = useWaasFeeOptionManager(chainId);

		console.log('pendingFeeOptionConfirmation', pendingFeeOptionConfirmation);

		const handleCancelFeeOption = () => {
			selectWaasFeeOptions$.hide();

			onCancel?.();
		};

		if (
			!selectWaasFeeOptions$.isVisible.get() ||
			isTestnet ||
			!selectedFeeOption
		) {
			return null;
		}

		return (
			<div
				className={cn(
					'flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-0 backdrop-blur-md',
					className,
				)}
			>
				<Divider className="mt-0 mb-4" />

				<Text className="mb-2 font-body text-large" fontWeight="bold">
					{feeOptionsConfirmed ? titleOnConfirm : 'Select a fee option'}
				</Text>

				{!feeOptionsConfirmed && !pendingFeeOptionConfirmation && (
					<Skeleton className="h-[52px] w-full animate-shimmer rounded-xl" />
				)}

				{(feeOptionsConfirmed || pendingFeeOptionConfirmation) && (
					<div
						className={cn(
							'[&>label>button>span]:overflow-hidden [&>label>button]:w-full [&>label>button]:text-xs [&>label]:flex [&>label]:w-full',
							feeOptionsConfirmed && 'pointer-events-none opacity-70',
						)}
					>
						<WaasFeeOptionsSelect
							options={
								(pendingFeeOptionConfirmation?.options as FeeOption[]) || [
									selectedFeeOption,
								]
							}
							selectedFeeOption$={selectedFeeOption$}
						/>
					</div>
				)}

				<div className="flex w-full items-start justify-between">
					{!feeOptionsConfirmed &&
						(!pendingFeeOptionConfirmation || currencyBalanceLoading) && (
							<Skeleton className="h-[20px] w-2/3 animate-shimmer rounded-xl" />
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
	},
);

export default SelectWaasFeeOptions;
