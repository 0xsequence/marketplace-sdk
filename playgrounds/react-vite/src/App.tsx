import {
	Box,
	Button,
	Card,
	Divider,
	TabbedNav,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import {
	CollectibleCard,
	useCreateListingModal,
	useListCollectibles,
	useListCollections,
	useMakeOfferModal,
	useSellModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import React from 'react';
import type { Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { OrderSide } from '../../../packages/sdk/src';
import { sdkConfig } from './config';
import Providers from './lib/provider';

function App() {
	return (
		<Providers sdkConfig={sdkConfig}>
			<div style={{ width: '100vw', paddingBlockStart: '70px' }}>
				<InnerApp />
			</div>
		</Providers>
	);
}

function InnerApp() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();
	const [collectionAddress, setCollectionAddress] = useState<Hex>(
		'0xf2ea13ce762226468deac9d69c8e77d291821676',
	);
	const [chainId, setChainId] = useState('80002');
	const [collectibleId, setCollectibleId] = useState('1');
	const [activeTab, setActiveTab] = useState('collections');

	function toggleConnect() {
		if (address) {
			disconnect();
		} else {
			setOpenConnectModal(true);
		}
	}

	return (
		<Box margin="auto" style={{ width: '500px' }}>
			<Text variant="xlarge" textAlign="center">
				Sequence Marketplace SDK Playground
			</Text>
			<Divider />
			<Card gap="3" flexDirection="column">
				<Box gap="3">
					<TextInput
						label="Collection address"
						style={{ width: '200px' }}
						labelLocation="top"
						name="collectionAddress"
						value={collectionAddress}
						onChange={setCollectionAddress}
					/>
					<TextInput
						label="Chain ID"
						labelLocation="top"
						name="chainId"
						value={chainId}
						onChange={setChainId}
					/>
					<TextInput
						label="Collectible ID"
						labelLocation="top"
						name="collectibleId"
						value={collectibleId}
						onChange={setCollectibleId}
					/>
				</Box>
				<TextInput
					label="Wallet"
					labelLocation="top"
					placeholder="No wallet connected"
					value={address || ''}
					disabled={true}
					name="wallet"
					controls={
						<Box>
							<Button
								label={address ? 'Disconnect' : 'Connect'}
								size="xs"
								shape="square"
								onClick={toggleConnect}
							/>
						</Box>
					}
				/>
			</Card>
			<TabbedNav
				onTabChange={(tab) => setActiveTab(tab)}
				tabs={[
					{
						label: 'Collections',
						value: 'collections',
					},
					{
						label: 'Collectibles',
						value: 'collectibles',
					},
					{ label: 'Collectible', value: 'collectible' },
				]}
			/>
			{(() => {
				switch (activeTab) {
					case 'collections':
						return <Collections />;
					case 'collectibles':
						return (
							<Collectibles
								collectionAddress={collectionAddress}
								chainId={chainId}
							/>
						);
					case 'collectible':
						return (
							<Collectible
								collectionAddress={collectionAddress}
								chainId={chainId}
								collectibleId={collectibleId}
							/>
						);
				}
			})()}
		</Box>
	);
}

function Collections() {
	const { data: collections } = useListCollections();
	return (
		<Box
			gap="3"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collections?.map((collection) => (
				<Card key={collection.address} gap="2">
					<Box
						style={{
							backgroundImage: `url(${collection.extensions?.ogImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							minHeight: '200px',
							minWidth: '90px',
						}}
						alignItems="center"
					>
						<Card blur={true} flexDirection="column" gap="1">
							<Text variant="large">{collection.name}</Text>
							<Text variant="small">{collection.address}</Text>
						</Card>
					</Box>
				</Card>
			))}
		</Box>
	);
}

function Collectibles({
	collectionAddress,
	chainId,
}: { collectionAddress: Hex; chainId: string }) {
	const { data: collectibles } = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
	});

	return (
		<Box
			gap="3"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collectibles?.pages.map((group, i) => (
				<React.Fragment key={i}>
					{group.collectibles.map((collectible) => (
						<CollectibleCard
							key={collectible.metadata.tokenId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							tokenId={collectible.metadata.tokenId}
							onCollectibleClick={() => console.log('Collectible clicked')}
							onOfferClick={() => console.log('Offer clicked')}
						/>
					))}
				</React.Fragment>
			))}
		</Box>
	);
}

function Collectible(props: {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
}) {
	const { show: openMakeOfferModal } = useMakeOfferModal();
	const { show: openCreateListingModal } = useCreateListingModal();
	const { show: openTransferModal } = useTransferModal();
	const { show: openSellModal } = useSellModal();

	return (
		<Box gap="3">
			<Card gap="3">
				<Button
					variant="primary"
					onClick={() => openMakeOfferModal(props)}
					label="Make Offer"
				/>
				<Button
					variant="primary"
					onClick={() => openCreateListingModal(props)}
					label="Create Listing"
				/>
				<Button
					variant="primary"
					onClick={() =>
						openTransferModal({
							collectionAddress: props.collectionAddress,
							chainId: props.chainId,
							tokenId: props.collectibleId,
						})
					}
					label="Transfer"
				/>
			</Card>
			<CollectibleCard
				chainId={Number(props.chainId)}
				collectionAddress={props.collectionAddress}
				tokenId={props.collectibleId}
				onCollectibleClick={() => console.log('Collectible clicked')}
				onOfferClick={() => console.log('Offer clicked')}
			/>
		</Box>
	);
}

export default App;
