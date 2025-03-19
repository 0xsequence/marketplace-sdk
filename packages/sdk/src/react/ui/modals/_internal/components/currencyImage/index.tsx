'use client';

import { Box, TokenImage } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { useState } from 'react';
import type { Address } from 'viem';
import type { Price } from '../../../../../../types';

function CurrencyImage({ price$ }: { price$: Observable<Price | undefined> }) {
	const [imageLoadErrorCurrencyAddresses, setImageLoadErrorCurrencyAddresses] =
		useState<Address[] | null>(null);

	if (
		imageLoadErrorCurrencyAddresses?.includes(
			price$.currency.contractAddress.get() as Address,
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
			src={price$.currency.imageUrl.get()}
			onError={() => {
				const price = price$?.get();
				if (price) {
					setImageLoadErrorCurrencyAddresses((prev) => {
						if (!prev)
							return [price$.currency.contractAddress.get() as Address];
						if (
							!prev.includes(price$.currency.contractAddress.get() as Address)
						) {
							return [
								...prev,
								price$.currency.contractAddress.get() as Address,
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
