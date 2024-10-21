import { Box, NetworkImage, NumericInput } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import type { Price } from '@types';
import { useState } from 'react';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputWrapper } from './styles.css';

type PriceInputProps = {
	collectionAddress: string;
	chainId: string;
	$listingPrice: Observable<Price | undefined>;
};

const PriceInput = observer(function PriceInput({
	chainId,
	collectionAddress,
	$listingPrice,
}: PriceInputProps) {
	const [inputPrice, setInputPrice] = useState('');
	const changeListingPrice = (value: string) => {
		setInputPrice(value);
		$listingPrice.amountRaw.set(value);
	};

	return (
		<Box className={priceInputWrapper} position="relative">
			<Box
				position="absolute"
				bottom="3"
				left="2"
				display="flex"
				alignItems="center"
			>
				<NetworkImage chainId={Number(chainId)} size="xs" />
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
				value={inputPrice}
				onChange={(event) => changeListingPrice(event.target.value)}
				width="full"
			/>
		</Box>
	);
});

export default PriceInput;
