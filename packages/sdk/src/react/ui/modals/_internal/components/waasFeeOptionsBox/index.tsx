import { waasFeeOptionsModal$ } from './store';
import {
	Box,
	Button,
	Skeleton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import WaasFeeOptionsSelect, {
	FeeOption,
} from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { useWaasFeeOptions } from '@0xsequence/kit';
import { feeOptionsWrapper } from './styles.css';
import { Hex, zeroAddress } from 'viem';
import { observer } from '@legendapp/state/react';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';

type WaasFeeOptionsBoxProps = {
	chainId: number;
};

const WaasFeeOptionsBox = observer(({ chainId }: WaasFeeOptionsBoxProps) => {
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
	const insufficientBalance =
		!!currencyBalance?.formatted &&
		!!selectedFeeOption$.get()?.value &&
		(currencyBalance?.formatted === '0' ||
			(currencyBalance?.formatted ?? 0) <
				(selectedFeeOption$.get()?.value ?? 0));

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

			<Button
				disabled={!selectedFeeOption$.get()?.token || insufficientBalance}
				pending={currencyBalanceLoading}
				onClick={() => {
					if (!selectedFeeOption$.get()?.token) return;

					confirmPendingFeeOption(
						pendingFeeOptionConfirmation?.id,
						selectedFeeOption$.get()?.token.contractAddress || zeroAddress,
					);
				}}
				label={
					<Box display="flex" alignItems="center" gap="2">
						Confirm {currencyBalanceLoading && <Spinner size="sm" />}
					</Box>
				}
				variant="primary"
				size="xs"
				alignSelf="flex-end"
			/>

			{currencyBalanceLoading ? (
				<Skeleton style={{ height: 15 }} borderRadius="md" width="1/3" />
			) : (
				<Text
					fontSize="small"
					fontWeight="semibold"
					fontFamily="body"
					color={insufficientBalance ? 'negative' : 'text100'}
				>
					You have {currencyBalance?.formatted}{' '}
					{selectedFeeOption$.get()?.token.symbol}
				</Text>
			)}
		</Box>
	);
});

export default WaasFeeOptionsBox;
