'use client';

import { TextInput } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { transferModal$ } from '../../../_store';

const MAX_WALLET_ADDRESS_LENGTH = 42;

const WalletAddressInput = observer(() => {
	const { address: connectedAddress } = useAccount();
	const receiverAddress = transferModal$.state.receiverAddress.get();
	const isWalletAddressValid = isAddress(receiverAddress);
	const isProcessing = transferModal$.state.transferIsBeingProcessed.get();

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		receiverAddress.toLowerCase() === connectedAddress.toLowerCase();

	const handleChangeWalletAddress = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		transferModal$.state.receiverAddress.set(event.target.value);
	};

	return (
		<div className="[&>label>div>>span]:text-sm [&>label>div>span]:text-text-80 [&>label]:gap-1">
			<TextInput
				label="Wallet address"
				labelLocation="top"
				autoFocus
				value={receiverAddress}
				maxLength={MAX_WALLET_ADDRESS_LENGTH}
				onChange={handleChangeWalletAddress}
				name="walletAddress"
				placeholder="Enter wallet address"
				disabled={isProcessing}
			/>
			{isSelfTransfer && (
				<div className="mt-1 text-negative text-sm">
					You cannot transfer to your own address
				</div>
			)}
		</div>
	);
});

export default WalletAddressInput;
