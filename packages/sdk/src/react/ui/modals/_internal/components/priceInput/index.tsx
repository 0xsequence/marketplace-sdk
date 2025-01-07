import { Box, NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useCallback, useEffect, useState } from 'react';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import CurrencyImage from '../currencyImage';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: string;
	$listingPrice: Observable<Price | undefined>;
	priceChanged?: boolean;
	onPriceChange?: () => void;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
};

const PriceInput = observer(function PriceInput({
	chainId,
	collectionAddress,
	$listingPrice,
	priceChanged,
	onPriceChange,
	checkBalance,
}: PriceInputProps) {
	const [balanceError, setBalanceError] = useState('');
	const { address: accountAddress } = useAccount();
	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: $listingPrice.currency.contractAddress.get() as Hex,
		chainId: Number(chainId),
		userAddress: accountAddress as Hex,
	});

	const currencyDecimals = $listingPrice.currency.decimals.get();

	const [value, setValue] = useState('');

	useEffect(() => {
		if (!priceChanged) return;

		const parsedAmount = parseUnits(value, Number(currencyDecimals));
		$listingPrice.amountRaw.set(parsedAmount.toString());
	}, [value, currencyDecimals, priceChanged, $listingPrice.amountRaw.set]);

	const checkInsufficientBalance = useCallback(
		(priceAmountRaw: string) => {
			const hasInsufficientBalance =
				isBalanceSuccess &&
				priceAmountRaw &&
				currencyDecimals &&
				BigInt(priceAmountRaw) > (balance?.value || 0);

			if (!checkBalance) return;

			if (hasInsufficientBalance) {
				setBalanceError('Insufficient balance');
				checkBalance.callback(true);
			} else {
				setBalanceError('');
				checkBalance.callback(false);
			}
		},
		[isBalanceSuccess, currencyDecimals, balance?.value, checkBalance],
	);

	const changeListingPrice = (value: string) => {
		setValue(value);
		onPriceChange?.();
	};

	useEffect(() => {
		const priceAmountRaw = $listingPrice.amountRaw.get();
		if (priceAmountRaw && priceAmountRaw !== '0') {
			checkInsufficientBalance(priceAmountRaw);
		}
	}, [$listingPrice.amountRaw, checkInsufficientBalance]);

	return (
		<Box className={priceInputWrapper} position="relative">
			<Box
				className={priceInputCurrencyImage}
				position="absolute"
				left="2"
				display="flex"
				alignItems="center"
			>
				<CurrencyImage $listingPrice={$listingPrice} />
			</Box>

			<NumericInput
				name="listingPrice"
				decimals={currencyDecimals}
				label="Enter price"
				labelLocation="top"
				controls={
					<CurrencyOptionsSelect
						selectedCurrency$={$listingPrice?.currency}
						collectionAddress={collectionAddress}
						chainId={chainId}
					/>
				}
				value={value}
				onChange={(event) => changeListingPrice(event.target.value)}
				width="full"
			/>

			{balanceError && (
				<Text
					color="negative"
					fontSize="xsmall"
					fontFamily="body"
					fontWeight="semibold"
					position="absolute"
					style={{ bottom: '-13px' }}
				>
					{balanceError}
				</Text>
			)}
		</Box>
	);
});

export default PriceInput;
