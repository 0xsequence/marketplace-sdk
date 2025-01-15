import { Box, NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: string;
	secoundCurrencyAsDefault?: boolean;
	$listingPrice: Observable<Price | undefined>;
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
	onPriceChange,
	checkBalance,
	secoundCurrencyAsDefault,
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

	const changeListingPrice = (value: string) => {
		setValue(value);
		const trimmedValue = value.replace(/,/g, '');
		const parsedTrimmedValue = parseUnits(
			trimmedValue,
			Number(currencyDecimals),
		);

		try {
			const parsedAmount = parseUnits(value, Number(currencyDecimals));

			$listingPrice.amountRaw.set(parsedAmount.toString());

			if (onPriceChange && parsedTrimmedValue !== 0n) {
				onPriceChange();
			}
		} catch {
			$listingPrice.amountRaw.set('0');
		}
	};

	const checkInsufficientBalance = (priceAmountRaw: string) => {
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
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const priceAmountRaw = $listingPrice.amountRaw.get();
		if (priceAmountRaw && priceAmountRaw !== '0') {
			checkInsufficientBalance(priceAmountRaw);
		}
	}, [$listingPrice.currency.get()]);

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
						secoundCurrencyAsDefault={secoundCurrencyAsDefault}
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
