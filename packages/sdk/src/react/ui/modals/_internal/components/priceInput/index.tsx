import { Box, NumericInput, TokenImage } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useState } from 'react';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: string;
	$listingPrice: Observable<Price | undefined>;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
};

const PriceInput = observer(function PriceInput({
	chainId,
	collectionAddress,
	$listingPrice,
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

	const changeListingPrice = (value: string) => {
		setValue(value);
		const parsedAmount = parseUnits(value, Number(currencyDecimals));
		$listingPrice.amountRaw.set(parsedAmount.toString());
		checkBalance && checkInsufficientBalance(parsedAmount.toString());
	};

	return (
		<Box className={priceInputWrapper} position="relative">
			<Box
				className={priceInputCurrencyImage}
				position="absolute"
				left="2"
				display="flex"
				alignItems="center"
			>
				<TokenImage src={$listingPrice.currency.imageUrl.get()} size="xs" />
			</Box>

			<NumericInput
				name="listingPrice"
				decimals={currencyDecimals}
				label="Enter price"
				labelLocation="top"
				controls={
					<CurrencyOptionsSelect
						$selectedCurrency={$listingPrice?.currency}
						collectionAddress={collectionAddress}
						chainId={chainId}
					/>
				}
				value={value}
				onChange={(event) => changeListingPrice(event.target.value)}
				width="full"
			/>
			{balanceError && (
				<Box color="negative" fontSize="small">
					{balanceError}
				</Box>
			)}
		</Box>
	);
});

export default PriceInput;
