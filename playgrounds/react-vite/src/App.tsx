import {
	Box,
	Button,
	Card,
	Divider,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import {
	CollectibleCard,
	useCreateListingModal,
	useMakeOfferModal,
	useSellModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
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
	const { show: openMakeOfferModal } = useMakeOfferModal();
	const { show: openCreateListingModal } = useCreateListingModal();
	const { show: openTransferModal } = useTransferModal();
	const { show: openSellModal } = useSellModal();
	const { address } = useAccount();
	const [collectionAddress, setCollectionAddress] = useState<Hex>(
		'0xf2ea13ce762226468deac9d69c8e77d291821676',
	);
	const [chainId, setChainId] = useState('80002');
	const [collectibleId, setCollectibleId] = useState('1');
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
					value={address}
					disabled={true}
					name="wallet"
					controls={
						<Button
							label="Connect"
							size="xs"
							shape="square"
							onClick={() => setOpenConnectModal(true)}
							disabled={!!address}
						/>
					}
				/>
			</Card>
			<Card gap="1" marginTop="3">
				<Button
					variant="primary"
					onClick={() =>
						openMakeOfferModal({
							collectionAddress,
							chainId,
							collectibleId,
						})
					}
					label="Make Offer"
				/>
				<Button
					variant="primary"
					onClick={() =>
						openCreateListingModal({
							collectionAddress,
							chainId,
							collectibleId,
						})
					}
					label="Create Listing"
				/>
				<Button
					variant="primary"
					onClick={() =>
						openTransferModal({
							collectionAddress,
							chainId,
							tokenId: collectibleId,
						})
					}
					label="Transfer"
				/>
			</Card>
			<CollectibleCard
				chainId={Number(chainId)}
				collectionAddress={collectionAddress}
				tokenId="0"
				onCollectibleClick={() => console.log('Collectible clicked')}
				onOfferClick={() => console.log('Offer clicked')}
			/>
		</Box>
	);
}

export default App;
