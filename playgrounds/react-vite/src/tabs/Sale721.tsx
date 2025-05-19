import { Button, CartIcon, Text } from '@0xsequence/design-system';
import {
	CollectibleCard,
	useBuyModal,
	useCurrency,
	useList721ShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import type { Address } from 'viem';
import { formatPrice } from '../../../../sdk/src';

export function Sale721() {
	const tokenIds = ['0', '14'];
	const chainId = 80002;
	const collectionAddress: Address =
		'0xf2ea13ce762226468deac9d69c8e77d291821676';
	const salesContractAddress: Address =
		'0x30131575129ee043f9c7409ca599bfd8ffe1b4e0';
	const [quantity, setQuantity] = useState(1);

	const { collectibleCards, salePrice } = useList721ShopCardData({
		tokenIds,
		chainId,
		contractAddress: collectionAddress,
		salesContractAddress,
	});
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: salePrice.currencyAddress,
	});

	const { show } = useBuyModal();

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center gap-2 rounded-sm bg-background-secondary p-4">
				<img
					src={currency?.imageUrl}
					alt={currency?.symbol}
					width={14}
					height={14}
				/>

				<Text className="text-sm" fontWeight="medium">
					{formatPrice(BigInt(salePrice.amount), currency?.decimals ?? 18)}{' '}
					{currency?.symbol}
				</Text>

				<input
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					className="h-9 w-16 rounded bg-background-muted px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
					min="1"
				/>

				<Button
					variant="primary"
					size="sm"
					label="Buy"
					leftIcon={CartIcon}
					onClick={() =>
						show({
							chainId,
							collectionAddress,
							salesContractAddress,
							quantityDecimals: 0,
							quantityRemaining: '1',
							marketplaceType: 'shop',
							collectionType: 'erc721',
						})
					}
				/>
			</div>

			<div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
				{collectibleCards.map((cardProps) => (
					<CollectibleCard
						key={cardProps.collectibleId}
						{...cardProps}
						quantityRemaining="1"
					/>
				))}
			</div>
		</div>
	);
}
