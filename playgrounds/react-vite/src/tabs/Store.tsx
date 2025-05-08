import { Text } from '@0xsequence/design-system';
import { ContractType, type TokenMetadata } from '@0xsequence/marketplace-sdk';
import { ShopCollectibleCard } from '@0xsequence/marketplace-sdk/react';

export function Shop() {
	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Shop (Demonstration)</Text>
			</div>

			<div className="flex items-center justify-center">
				<DemoShopCollectibleCard supply={10} />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoShopCollectibleCard supply={100} />
				<DemoShopCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
				<DemoShopCollectibleCard />
			</div>
		</div>
	);
}

// TODO: use actual component once we have shop ready in the SDK
function DemoShopCollectibleCard({ supply }: { supply?: number }) {
	return (
		<ShopCollectibleCard
			chainId={80002}
			collectionAddress={'0x6838956422070bd85aa0c422b0ae33e4fde0f5dc'}
			collectionType={ContractType.ERC1155}
			collectibleId={'6'}
			tokenMetadata={tokenMetadata}
			cardLoading={false}
			supply={supply ?? 0}
			salesContractAddress="0x078839fabe130418ea6bc4c0f915ff6800994888"
			salePrice={{
				amount: '100',
				currencyAddress: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
			}}
		/>
	);
}

const tokenMetadata: TokenMetadata = {
	tokenId: '6',
	name: 'Lightning Shard',
	description: '',
	image:
		'https://metadata.sequence.app/projects/34598/collections/1029/tokens/6/image.png',
	properties: {},
	attributes: [],
};
