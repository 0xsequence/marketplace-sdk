import { Text } from '@0xsequence/design-system';
import {
	ShopCollectibleCard,
	useList1155ShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';

export function Shop() {
	const tokenIds = ['1', '2', '3', '10'];
	const chainId = 80002;
	const contractAddress: Address = '0xbb92fdb23b41c1f47f01691a0aa6e747fab36847';
	const salesContractAddress: Address =
		'0xddc7029ce8390cdd6b6c1ff58d4bf4c3f1f88bed';

	const { collectibleCards } = useList1155ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
	});

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">1155 Shop</Text>
			</div>

			<div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
				{collectibleCards.map((cardProps) => (
					<ShopCollectibleCard key={cardProps.collectibleId} {...cardProps} />
				))}
			</div>
		</div>
	);
}
