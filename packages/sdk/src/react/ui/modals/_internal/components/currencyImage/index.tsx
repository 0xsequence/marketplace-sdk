import { Box, TokenImage } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address } from 'viem';
import type { Price } from '../../../../../../types';
import type { Observable } from '@legendapp/state';

function CurrencyImage({
	$listingPrice,
}: { $listingPrice: Observable<Price | undefined> }) {
	const [imageLoadErrorCurrencyAddresses, setImageLoadErrorCurrencyAddresses] =
		useState<Address[] | null>(null);

	if (
		imageLoadErrorCurrencyAddresses?.includes(
			$listingPrice.currency.contractAddress.get() as Address,
		)
	) {
		return (
			<Box
				width="3"
				height="3"
				borderRadius="circle"
				background="backgroundSecondary"
			/>
		);
	}

	return (
		<TokenImage
			src={$listingPrice.currency.imageUrl.get()}
			onError={() => {
				const listingPrice = $listingPrice?.get();
				if (listingPrice) {
					setImageLoadErrorCurrencyAddresses((prev) => {
						if (!prev)
							return [listingPrice.currency.contractAddress as Address];
						if (
							!prev.includes(listingPrice.currency.contractAddress as Address)
						) {
							return [
								...prev,
								listingPrice.currency.contractAddress as Address,
							];
						}
						return prev;
					});
				}
			}}
			size="xs"
		/>
	);
}
export default CurrencyImage;
