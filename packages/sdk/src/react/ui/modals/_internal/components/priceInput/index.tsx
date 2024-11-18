import { Box, NumericInput, TokenImage } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useState } from 'react';
import { type Hex, erc20Abi, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import type { Price } from '../../../../../../types';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';

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
	const { data: balance, isSuccess: isBalanceSuccess } = useReadContract({
		address: $listingPrice.currency.contractAddress.get() as Hex,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [accountAddress as Hex],
		query: {
			enabled: checkBalance?.enabled,
		},
	});
	const listingPriceAmountRaw = $listingPrice.amountRaw.get();
	const currencyDecimals = $listingPrice.currency.decimals.get();

	const checkInsufficientBalance = (priceAmountRaw: string) => {
		const hasInsufficientBalance =
			isBalanceSuccess &&
			priceAmountRaw &&
			currencyDecimals &&
			BigInt(priceAmountRaw) > (balance || 0);

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
		const parsedAmount = parseUnits(
			value,
			Number($listingPrice.currency.decimals.get()),
		);

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
				decimals={$listingPrice?.currency.decimals.get()}
				label="Enter price"
				labelLocation="top"
				placeholder="0.00"
				controls={
					<CurrencyOptionsSelect
						$selectedCurrency={$listingPrice?.currency}
						collectionAddress={collectionAddress}
						chainId={chainId}
					/>
				}
				numeric={true}
				value={
					listingPriceAmountRaw
						? formatUnits(
								BigInt(listingPriceAmountRaw),
								Number(currencyDecimals),
							)
						: ''
				}
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
