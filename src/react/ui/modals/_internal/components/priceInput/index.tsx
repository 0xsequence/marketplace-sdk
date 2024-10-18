import { Box, NetworkImage, NumericInput } from '@0xsequence/design-system';
import type { Currency } from '@internal';
import type { Observable } from '@legendapp/state';
import { useObservable } from '@legendapp/state/react';
import type { Price } from '@types';
import { useState } from 'react';
import CurrencyOptionsSelect from '../currencyOptionsSelect';
import { priceInputWrapper } from './styles.css';

type PriceInputProps = {
	collectionAddress: string;
	chainId: string;
	$listingPrice: Observable<Price | undefined>;
};

export default function PriceInput({
	chainId,
	collectionAddress,
	$listingPrice,
}: PriceInputProps) {
	const selectedCurrency$ = useObservable<Currency | null>(null);
	const [inputPrice, setInputPrice] = useState('');
	const changeListingPrice = (value: string) => {
		setInputPrice(value);
		$listingPrice.set({
			amountRaw: value,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			currency: selectedCurrency$.get()!,
		});
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
				decimals={selectedCurrency$?.decimals.get()}
				label="Enter price"
				labelLocation="top"
				placeholder="0.00"
				controls={
					<CurrencyOptionsSelect
						$selectedCurrency={selectedCurrency$}
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
}
