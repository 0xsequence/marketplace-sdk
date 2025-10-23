'use client';

import { Field, FieldLabel, TextInput } from '@0xsequence/design-system';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { transferModalStore, useModalState } from '../../../store';

const MAX_WALLET_ADDRESS_LENGTH = 42;

const WalletAddressInput = () => {
	const { address: connectedAddress } = useAccount();
	const { receiverAddress, transferIsProcessing } = useModalState();
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
		<Field>
			<FieldLabel className="text-sm text-text-80">Wallet address</FieldLabel>
			<TextInput
				autoFocus
				value={receiverAddress}
				maxLength={MAX_WALLET_ADDRESS_LENGTH}
				onChange={handleChangeWalletAddress}
				name="walletAddress"
				placeholder="Enter wallet address"
				disabled={transferIsProcessing}
			/>
			{isSelfTransfer && (
				<div className="mt-1 text-negative text-sm">
					You cannot transfer to your own address
				</div>
			)}
		</Field>
	);
};

export default WalletAddressInput;
