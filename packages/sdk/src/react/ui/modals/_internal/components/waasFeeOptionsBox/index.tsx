import { Button, Skeleton, Text, WarningIcon } from '@0xsequence/design-system';
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
			<div className={feeOptionsWrapper}>
				<Text className="text-large font-body mb-2" fontWeight="bold">
					Select a fee option
				</Text>
				<WaasFeeOptionsSelect
					options={(pendingFeeOptionConfirmation?.options as FeeOption[]) || []}
					selectedFeeOption$={selectedFeeOption$}
				/>
				<div className="flex items-center justify-between w-full">
					{currencyBalanceLoading ? (
						<Skeleton className="rounded-xl w-1/3" style={{ height: 15 }} />
					) : (
						<div className="flex items-center gap-2">
							{insufficientBalance && (
								<WarningIcon className="text-negative" size="xs" />
							)}
							<Text
								className="text-sm font-body"
								fontWeight="semibold"
								color={insufficientBalance ? 'negative' : 'text100'}
							>
								You have {currencyBalance?.formatted || '0'}{' '}
								{selectedFeeOption?.token.symbol}
							</Text>
						</div>
					)}

					<Button
						disabled={
							!selectedFeeOption?.token ||
							insufficientBalance ||
							currencyBalanceLoading
						}
						pending={currencyBalanceLoading}
						onClick={handleConfirmFeeOption}
						label={<div className="flex items-center gap-2">Confirm</div>}
						variant={insufficientBalance ? 'danger' : 'primary'}
						size="xs"
					/>
				</div>
			</div>
		);
	},
);

export default WaasFeeOptionsBox;
