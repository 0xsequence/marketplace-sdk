import { NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import { useEffect, useRef, useState } from 'react';
import { type Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import { useCurrencyBalance } from '../../../../../hooks/useCurrencyBalance';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';

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
	const prevCurrencyDecimals = useRef(currencyDecimals);

	// Handle currency changes and adjust the raw amount accordingly
	useEffect(() => {
		if (prevCurrencyDecimals.current !== currencyDecimals && value !== '0') {
			try {
				// If the user has entered a value and the currency decimals have changed,
				// we need to adjust the raw amount to maintain the same displayed value
				const parsedAmount = parseUnits(value, Number(currencyDecimals));
				$price.amountRaw.set(parsedAmount.toString());

				if (onPriceChange && parsedAmount !== 0n) {
					onPriceChange();
				}
			} catch {
				$price.amountRaw.set('0');
			}
		}

		prevCurrencyDecimals.current = currencyDecimals;
	}, [currencyDecimals, $price.amountRaw, value, onPriceChange]);

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
		<div className="relative flex w-full flex-col [&>label]:gap-[2px]">
			<div className="absolute top-[29px] left-2 flex items-center">
				<CurrencyImage price$={$price} />
			</div>
			<NumericInput
				className="w-full [&>div>div>input]:text-xs [&>div>div]:h-9 [&>div>div]:rounded [&>div>div]:pr-0 [&>div>div]:pl-7 [&>div>div]:text-xs"
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
			/>
			{balanceError && (
				<Text
					className="absolute font-body text-xs"
					color="negative"
					fontWeight="semibold"
					style={{ bottom: '-13px' }}
				>
					Insufficient balance
				</Text>
			)}
		</div>
	);
}
