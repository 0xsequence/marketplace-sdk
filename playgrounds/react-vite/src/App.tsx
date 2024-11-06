import Providers from 'provider';
import './App.css';
import { Button } from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import {
	useCreateListingModal,
	useMakeOfferModal,
} from '@0xsequence/marketplace-sdk';
import { sdkConfig } from 'config';
import { useAccount } from 'wagmi';

const consts = {
	collectionAddress: '0xf2ea13ce762226468deac9d69c8e77d291821676',
	chainId: '80002',
	collectibleId: '1',
};

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
		<>
			<div>{address ? address : 'No wallet connected'}</div>
			<Button
				onClick={() => setOpenConnectModal(true)}
				label="Connect Wallet"
			/>
			<Button onClick={() => openMakeOfferModal(consts)} label="Make Offer" />
			<Button
				onClick={() => openCreateListingModal(consts)}
				label="Create Listingr"
			/>
		</>
	);
}

export default App;
