import { Box, Button } from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import {
	useCreateListingModal,
	useMakeOfferModal,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount } from 'wagmi';
import { sdkConfig } from './config';
import Providers from './provider';

const consts = {
	collectionAddress: '0xf2ea13ce762226468deac9d69c8e77d291821676',
	chainId: '80002',
	collectibleId: '1',
} as const;

function App() {
	return (
		<Providers sdkConfig={sdkConfig}>
			<InnerApp />
		</Providers>
	);
}

function InnerApp() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { show: openMakeOfferModal } = useMakeOfferModal();
	const { show: openCreateListingModal } = useCreateListingModal();
	const { address } = useAccount();

	return (
		<Box style={{ width: '100vw' }} flexDirection="column" alignItems="center">
			<Box>{address ? address : 'No wallet connected'}</Box>
			<Box gap="1">
				<Button
					onClick={() => setOpenConnectModal(true)}
					label="Connect Wallet"
					disabled={!!address}
				/>
				<Button onClick={() => openMakeOfferModal(consts)} label="Make Offer" />
				<Button
					onClick={() => openCreateListingModal(consts)}
					label="Create Listing"
				/>
			</Box>
		</Box>
	);
}

export default App;
