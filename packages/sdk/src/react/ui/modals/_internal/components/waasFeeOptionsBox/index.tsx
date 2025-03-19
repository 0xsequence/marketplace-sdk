'use client';

import {
	Box,
	Button,
	Skeleton,
	Text,
	WarningIcon,
} from '@0xsequence/design-system';
import { useWaasFeeOptions } from '@0xsequence/kit';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import { type Hex, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import WaasFeeOptionsSelect, {
	type FeeOption,
} from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { waasFeeOptionsModal$ } from './store';
import { feeOptionsWrapper } from './styles.css';

type WaasFeeOptionsBoxProps = {
	onFeeOptionsLoaded: () => void;
	onFeeOptionConfirmed: () => void;
	chainId: number;
};

const WaasFeeOptionsBox = observer(
	({
		onFeeOptionsLoaded,
		onFeeOptionConfirmed,
		chainId,
	}: WaasFeeOptionsBoxProps) => {
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

			onFeeOptionConfirmed();
		};

		if (!pendingFeeOptionConfirmation) return null;

		return (
			<Box className={feeOptionsWrapper}>
				<Text
					fontSize="medium"
					fontFamily="body"
					fontWeight="bold"
					marginBottom="2"
				>
					Select a fee option
				</Text>

				<WaasFeeOptionsSelect
					options={(pendingFeeOptionConfirmation?.options as FeeOption[]) || []}
					selectedFeeOption$={selectedFeeOption$}
				/>

				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					width="full"
				>
					{currencyBalanceLoading ? (
						<Skeleton style={{ height: 15 }} borderRadius="md" width="1/3" />
					) : (
						<Box display="flex" alignItems="center" gap="2">
							{insufficientBalance && (
								<WarningIcon color="negative" size="xs" />
							)}
							<Text
								fontSize="small"
								fontWeight="semibold"
								fontFamily="body"
								color={insufficientBalance ? 'negative' : 'text100'}
							>
								You have {currencyBalance?.formatted || '0'}{' '}
								{selectedFeeOption?.token.symbol}
							</Text>
						</Box>
					)}

					<Button
						disabled={
							!selectedFeeOption?.token ||
							insufficientBalance ||
							currencyBalanceLoading
						}
						pending={currencyBalanceLoading}
						onClick={handleConfirmFeeOption}
						label={
							<Box display="flex" alignItems="center" gap="2">
								Confirm
							</Box>
						}
						variant={insufficientBalance ? 'danger' : 'primary'}
						size="xs"
					/>
				</Box>
			</Box>
		);
	},
);

export default WaasFeeOptionsBox;
