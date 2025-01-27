import { Box, NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';
import { use$ } from '@legendapp/state/react';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import { useState } from 'react';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: string;
	secondCurrencyAsDefault?: boolean;
	$price: Observable<Price | undefined>;
	includeNativeCurrency?: boolean;
	onPriceChange?: () => void;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
};

export default function PriceInput({
	chainId,
	collectionAddress,
	$price,
	onPriceChange,
	checkBalance,
	secondCurrencyAsDefault,
	includeNativeCurrency,
}: PriceInputProps) {
	const { address: accountAddress } = useAccount();
	const currencyDecimals = use$($price.currency.decimals);
	const currencyAddress = use$($price.currency.contractAddress);
	const priceAmountRaw = use$($price.amountRaw);

	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress: currencyAddress as undefined | Hex,
		chainId: Number(chainId),
		userAddress: accountAddress,
	});

	const balanceError =
		!!checkBalance?.enabled &&
		!!isBalanceSuccess &&
		!!priceAmountRaw &&
		!!currencyDecimals &&
		BigInt(priceAmountRaw) > BigInt(balance?.value || 0n);

	if (checkBalance?.enabled) {
		checkBalance.callback(balanceError);
	}

	const [value, setValue] = useState('0');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setValue(newValue);
		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			$price.amountRaw.set(parsedAmount.toString());
			if (onPriceChange && parsedAmount !== 0n) {
				onPriceChange();
			}
		} catch {
			$price.amountRaw.set('0');
		}
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
				<CurrencyImage price$={$price} />
			</Box>

			<NumericInput
				name="price-input"
				decimals={currencyDecimals}
				label="Enter price"
				labelLocation="top"
				controls={
					<CurrencyOptionsSelect
						selectedCurrency$={$price.currency}
						collectionAddress={collectionAddress}
						chainId={chainId}
						secondCurrencyAsDefault={secondCurrencyAsDefault}
						includeNativeCurrency={includeNativeCurrency}
					/>
				}
				value={value}
				onChange={handleChange}
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
					Insufficient balance
				</Text>
			)}
		</Box>
	);
}
