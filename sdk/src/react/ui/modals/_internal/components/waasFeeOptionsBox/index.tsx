'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import {
	Button,
	Divider,
	Skeleton,
	Spinner,
	Text,
	WarningIcon,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import { type Hex, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import WaasFeeOptionsSelect, {
	type FeeOption,
} from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { waasFeeOptionsModal$ } from './store';

type SelectWaasFeeOptionsProps = {
	onFeeOptionsLoaded: () => void;
	onFeeOptionConfirmed: () => void;
	chainId: number;
};

const SelectWaasFeeOptions = observer(
	({ onFeeOptionsLoaded, chainId }: SelectWaasFeeOptionsProps) => {
		const { address: userAddress } = useAccount();
		const selectedFeeOption$ = waasFeeOptionsModal$.selectedFeeOption;
		const [pendingFeeOptionConfirmation, confirmPendingFeeOption] =
			useWaasFeeOptions();
		const { data: currencyBalance, isLoading: currencyBalanceLoading } =
			useCurrencyBalance({
				chainId,
				currencyAddress: (selectedFeeOption$.token.contractAddress.get() ||
					zeroAddress) as Hex,
				userAddress: userAddress as Hex,
			});
		const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (pendingFeeOptionConfirmation) {
				onFeeOptionsLoaded();
			}
		}, [pendingFeeOptionConfirmation]);

		const selectedFeeOption = selectedFeeOption$.get();
		const insufficientBalance = (() => {
			if (!selectedFeeOption?.value || !selectedFeeOption.token.decimals) {
				return false;
			}

			if (!currencyBalance?.value && currencyBalance?.value !== 0n) {
				return true;
			}

			try {
				const feeValue = BigInt(selectedFeeOption.value);
				return currencyBalance.value === 0n || currencyBalance.value < feeValue;
			} catch {
				return true;
			}
		})();

		const handleConfirmFeeOption = () => {
			if (!selectedFeeOption?.token || !pendingFeeOptionConfirmation?.id)
				return;

			confirmPendingFeeOption(
				pendingFeeOptionConfirmation?.id,
				selectedFeeOption.token.contractAddress || zeroAddress,
			);

			setFeeOptionsConfirmed(true);
		};

		const handleCancelFeeOption = () => {
			// TODO: Hide fee selection components
			waasFeeOptionsModal$.selectedFeeOption.set(undefined);
		};

		return (
			<div className="flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-4 pt-0 backdrop-blur-md">
				<Divider className="mt-0 mb-7" />

				<Text className="mb-2 font-body text-large" fontWeight="bold">
					Select a fee option
				</Text>

				{(!pendingFeeOptionConfirmation || feeOptionsConfirmed) && (
					<Skeleton className="h-[52px] w-full animate-shimmer rounded-xl" />
				)}

				{(pendingFeeOptionConfirmation || feeOptionsConfirmed) && (
					<WaasFeeOptionsSelect
						options={
							(pendingFeeOptionConfirmation?.options as FeeOption[]) || []
						}
						selectedFeeOption$={selectedFeeOption$}
					/>
				)}

				<div className="flex w-full items-start justify-between">
					{!feeOptionsConfirmed &&
						(!pendingFeeOptionConfirmation || currencyBalanceLoading) && (
							<Skeleton className="h-[20px] w-2/3 animate-shimmer rounded-xl" />
						)}

					{feeOptionsConfirmed ||
						(pendingFeeOptionConfirmation && !currencyBalanceLoading && (
							<div className="flex items-center gap-2">
								{insufficientBalance && (
									<WarningIcon className="text-negative" size="xs" />
								)}
								<Text
									className="font-body font-medium text-xs"
									color={insufficientBalance ? 'negative' : 'text100'}
								>
									You have {currencyBalance?.formatted || '0'}{' '}
									{selectedFeeOption?.token.symbol}
								</Text>
							</div>
						))}

					<div className="flex items-center gap-2">
						{/*
	 <Button
              pending={currencyBalanceLoading}
              onClick={handleCancelFeeOption}
              label={<div className="flex items-center gap-2">Cancel</div>}
              variant={"ghost"}
              shape="square"
              size="lg"
            />    
	     */}

						<Button
							disabled={
								!selectedFeeOption?.token ||
								insufficientBalance ||
								currencyBalanceLoading ||
								feeOptionsConfirmed
							}
							pending={currencyBalanceLoading}
							onClick={handleConfirmFeeOption}
							label={
								!feeOptionsConfirmed ? (
									<div className="flex items-center gap-2">
										Continue with {selectedFeeOption?.token.symbol}
									</div>
								) : (
									<Spinner size="sm" className="text-white" />
								)
							}
							variant={'primary'}
							shape="square"
							size="md"
						/>
					</div>
				</div>
			</div>
		);
	},
);

export default SelectWaasFeeOptions;
