'use client';

import { Field, FieldLabel, TextInput } from '@0xsequence/design-system';

const MAX_WALLET_ADDRESS_LENGTH = 42;

type WalletAddressInputProps = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const WalletAddressInput = ({
	value,
	onChange,
	disabled,
}: WalletAddressInputProps) => {
	const handleChangeWalletAddress = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		onChange(event.target.value);
	};

	return (
		<Field>
			<FieldLabel className="text-text-80 text-xs">Wallet address</FieldLabel>
			<TextInput
				autoFocus
				value={value}
				maxLength={MAX_WALLET_ADDRESS_LENGTH}
				onChange={handleChangeWalletAddress}
				name="walletAddress"
				placeholder="Enter wallet address"
				disabled={disabled}
				type="text"
				className="h-9 rounded-sm [&>input]:h-9 [&>input]:text-sm"
			/>
		</Field>
	);
};

export default WalletAddressInput;
