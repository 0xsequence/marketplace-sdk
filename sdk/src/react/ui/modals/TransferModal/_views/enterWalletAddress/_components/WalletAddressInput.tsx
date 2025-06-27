'use client';

import { TextInput } from '@0xsequence/design-system';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { transferModalStore, useModalState } from '../../../store';

const MAX_WALLET_ADDRESS_LENGTH = 42;

const WalletAddressInput = () => {
	const { address: connectedAddress } = useAccount();
	const { receiverAddress, transferIsProcessesing } = useModalState();
	const isWalletAddressValid = isAddress(receiverAddress);

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		receiverAddress.toLowerCase() === connectedAddress.toLowerCase();

	const handleChangeWalletAddress = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		transferModalStore.send({
			type: 'updateTransferDetails',
			receiverAddress: event.target.value,
		});
	};

	return (
		<div className="[&>label>div>span]:text-sm [&>label>div>span]:text-text-80 [&>label]:gap-1">
			<TextInput
				label="Wallet address"
				labelLocation="top"
				autoFocus
				value={receiverAddress}
				maxLength={MAX_WALLET_ADDRESS_LENGTH}
				onChange={handleChangeWalletAddress}
				name="walletAddress"
				placeholder="Enter wallet address"
				disabled={transferIsProcessesing}
			/>
			{isSelfTransfer && (
				<div className="mt-1 text-negative text-sm">
					You cannot transfer to your own address
				</div>
			)}
		</div>
	);
};

export default WalletAddressInput;
