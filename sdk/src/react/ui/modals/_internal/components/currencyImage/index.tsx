'use client';

import type { Address } from '@0xsequence/api-client';
import { TokenImage } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Price } from '../../../../../../types';

function CurrencyImage({ price }: { price: Price | undefined }) {
	const [imageLoadErrorCurrencyAddresses, setImageLoadErrorCurrencyAddresses] =
		useState<Address[] | null>(null);

	if (!price?.currency) {
		return <div className="h-3 w-3 rounded-full bg-background-secondary" />;
	}

	if (
		imageLoadErrorCurrencyAddresses?.includes(price.currency.contractAddress)
	) {
		return <div className="h-3 w-3 rounded-full bg-background-secondary" />;
	}

	return (
		<TokenImage
			src={price.currency.imageUrl}
			onError={() => {
				if (price) {
					setImageLoadErrorCurrencyAddresses((prev) => {
						if (!prev) return [price.currency.contractAddress];
						if (!prev.includes(price.currency.contractAddress)) {
							return [...prev, price.currency.contractAddress];
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
