import { Text } from '@0xsequence/design-system';
import { ShopCollectibleCard } from '@0xsequence/marketplace-sdk/react';

export function Store() {
	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Store (Demonstration)</Text>
			</div>

			<div className="flex items-center justify-center">
				<DemoStoreCollectibleCard supply={10} />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoStoreCollectibleCard supply={100} />
				<DemoStoreCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
			</div>

			<div className="flex items-center justify-center gap-4">
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
				<DemoStoreCollectibleCard />
			</div>
		</div>
	);
}

function DemoStoreCollectibleCard({ supply }: { supply?: number }) {
	return (
		<ShopCollectibleCard
			chainId={137}
			collectionAddress={'0x46a1d82dc33f4e598e38ec0e409a94100f0f806d'}
			collectibleId={'262150'}
			collectible={{ metadata: collectible }}
			cardLoading={false}
			supply={supply ?? 0}
		/>
	);
}

const collectible = {
	tokenId: '262150',
	name: 'Topaz Crystal',
	description:
		"Crystals change the color of your username in-game! They reflect how long a player's been part of Skyweaver's journey and were distributed for free at Open Beta on February 8, 2022. The Topaz Crystal was distributed to players who joined during Soft Launch between November 25, 2021 and February 7th, 2022 and reached level 5.",
	image:
		'https://assets.skyweaver.net/EWxuWBFM/cosmetics/crystals/skyweaver-crystal-6.png',
	properties: {
		color: '#08EBDD',
		type: 'Crystal',
	},
	attributes: [],
	decimals: 2,
	updatedAt: '2025-04-30T13:46:41.038277Z',
};
