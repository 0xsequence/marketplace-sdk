'use client';

import { TokenImage } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address } from 'viem';
import type { Currency } from '../../../../../../types';

function CurrencyImage({ currency }: { currency: Currency }) {
	const [imageLoadErrorCurrencyAddresses, setImageLoadErrorCurrencyAddresses] =
		useState<Address[] | null>(null);

	if (
		imageLoadErrorCurrencyAddresses?.includes(
			currency.contractAddress as Address,
		)
	) {
		return <div className="h-3 w-3 rounded-full bg-background-secondary" />;
	}

	return (
		<TokenImage
			src={currency.imageUrl}
			onError={() => {
				setImageLoadErrorCurrencyAddresses((prev) => {
					if (!prev) return [currency.contractAddress as Address];
					if (!prev.includes(currency.contractAddress as Address)) {
						return [...prev, currency.contractAddress as Address];
					}
					return prev;
				});
			}}
			size="xs"
		/>
	);
}
export default CurrencyImage;
