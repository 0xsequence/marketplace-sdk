import { Box, NumericInput, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useCallback, useMemo } from 'react';
import { type Hex } from 'viem';
import { useAccount } from 'wagmi';
import type { Price } from '../../../../../../types';
import CurrencyImage from '../currencyImage';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputCurrencyImage, priceInputWrapper } from './styles.css';
import { usePriceInput } from './hooks/usePriceInput';
import { useBalanceCheck } from './hooks/useBalanceCheck';

type PriceInputProps = {
	collectionAddress: Hex;
	chainId: string;
	secondCurrencyAsDefault?: boolean;
	$price: Observable<Price | undefined>;
	onPriceChange?: () => void;
	checkBalance?: {
		enabled: boolean;
		callback: (state: boolean) => void;
	};
};

const PriceInput = observer(function PriceInput({
	chainId,
	collectionAddress,
	$price,
	onPriceChange,
	checkBalance,
	secondCurrencyAsDefault,
}: PriceInputProps) {
	const { address: accountAddress } = useAccount();
	const currencyDecimals = $price.currency.decimals.get() || 18;
	const currencyAddress = $price.currency.contractAddress.get() as Hex;

	const { value, handlePriceChange } = usePriceInput({
		price$: $price,
		currencyDecimals,
		onPriceChange,
	});

	const { balanceError } = useBalanceCheck({
		checkBalance,
		price$: $price,
		currencyAddress,
		chainId: Number(chainId),
		userAddress: accountAddress as Hex,
		currencyDecimals,
	});

	const renderBalanceError = useMemo(() => {
		if (!balanceError) return null;

		return (
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
		);
	}, [balanceError]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			handlePriceChange(event.target.value);
		},
		[handlePriceChange],
	);

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
					/>
				}
				value={value}
				onChange={handleChange}
				width="full"
			/>

			{renderBalanceError}
		</Box>
	);
});

export default PriceInput;
