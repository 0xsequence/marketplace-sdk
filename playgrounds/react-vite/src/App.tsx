import {
	Box,
	Button,
	Card,
	Divider,
	TabbedNav,
	Tabs,
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
import type { ContractInfo } from '@0xsequence/metadata';
import React from 'react';
import type { Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { OrderSide } from '../../../packages/sdk/src';
import { sdkConfig } from './config';
import {
	MarketplaceProvider,
	type Tab,
	useMarketplace,
} from './lib/MarketplaceContext';
import Providers from './lib/provider';

function App() {
	return (
		<Providers sdkConfig={sdkConfig}>
			<MarketplaceProvider>
				<div style={{ width: '100vw', paddingBlockStart: '70px' }}>
					<InnerApp />
				</div>
			</MarketplaceProvider>
		</Providers>
	);
}

function InnerApp() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();
	const {
		pendingCollectionAddress,
		setCollectionAddress,
		isCollectionAddressValid,
		pendingChainId,
		setChainId,
		isChainIdValid,
		pendingCollectibleId,
		setCollectibleId,
		isCollectibleIdValid,
		setActiveTab,
		activeTab,
	} = useMarketplace();

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
						value={pendingCollectionAddress}
						onChange={(ev) => setCollectionAddress(ev.target.value as Hex)}
						error={
							!isCollectionAddressValid
								? 'Invalid collection address'
								: undefined
						}
					/>
					<TextInput
						label="Chain ID"
						labelLocation="top"
						name="chainId"
						value={pendingChainId}
						onChange={(ev) => setChainId(ev.target.value)}
						error={!isChainIdValid ? 'Chainid undefined' : undefined}
					/>
					<TextInput
						label="Collectible ID"
						labelLocation="top"
						name="collectibleId"
						value={pendingCollectibleId}
						onChange={(ev) => setCollectibleId(ev.target.value)}
						error={!isCollectibleIdValid ? 'Missing collectable id' : undefined}
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
			<Tabs
				defaultValue="collections"
				value={activeTab}
				onValueChange={(tab) => setActiveTab(tab as Tab)}
				tabs={
					[
						{
							label: 'Collections',
							value: 'collections',
							content: <Collections />,
						},
						{
							label: 'Collectibles',
							value: 'collectibles',
							content: <Collectibles />,
						},
						{
							label: 'Collectible',
							value: 'collectible',
							content: <Collectible />,
						},
					] as const
				}
			/>
		</Box>
	);
}

function Collections() {
	const { data: collections } = useListCollections();
	const { setChainId, setCollectionAddress, setActiveTab } = useMarketplace();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(String(collection.chainId));
		setCollectionAddress(collection.address as Hex);
		setActiveTab('collectibles');
	};

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
				<Card
					key={collection.address}
					gap="2"
					onClick={() => handleCollectionClick(collection)}
					style={{ cursor: 'pointer' }}
				>
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

function Collectibles() {
	const { collectionAddress, chainId } = useMarketplace();
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

function Collectible() {
	const context = useMarketplace();
	const { show: openMakeOfferModal } = useMakeOfferModal();
	const { show: openCreateListingModal } = useCreateListingModal();
	const { show: openTransferModal } = useTransferModal();
	const { show: openSellModal } = useSellModal();
	return (
		<Box gap="3">
			<Card gap="3">
				<Button
					variant="primary"
					onClick={() => openMakeOfferModal(context)}
					label="Make Offer"
				/>
				<Button
					variant="primary"
					onClick={() => openCreateListingModal(context)}
					label="Create Listing"
				/>
				<Button
					variant="primary"
					onClick={() =>
						openTransferModal({
							collectionAddress: context.collectionAddress,
							chainId: context.chainId,
							tokenId: context.collectibleId,
						})
					}
					label="Transfer"
				/>
			</Card>
			<CollectibleCard
				chainId={Number(context.chainId)}
				collectionAddress={context.collectionAddress}
				tokenId={context.collectibleId}
				onCollectibleClick={() => console.log('Collectible clicked')}
				onOfferClick={() => console.log('Offer clicked')}
			/>
		</Box>
	);
}

export default App;
