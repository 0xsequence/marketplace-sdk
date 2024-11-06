import AlertMessage from '../../../_internal/components/alertMessage';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import { Box, Button, Text, TextInput } from '@0xsequence/design-system';
import { isAddress } from 'viem';

const EnterWalletAddressView = () => {
	const isWalletAddressValid = isAddress(
		transferModal$.state.receiverWalletAddress.get(),
	);

	function handleChangeWalletAddress(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		transferModal$.state.receiverWalletAddress.set(event.target.value);
	}

	return (
		<Box display="grid" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold">
				Transfer your item
			</Text>

			<Box display="flex" flexDirection="column" gap="3">
				<AlertMessage
					message={getMessage('enterWalletAddress')}
					type="warning"
				/>

				<TextInput
					label="Wallet address"
					labelLocation="top"
					value={transferModal$.state.receiverWalletAddress.get()}
					onChange={handleChangeWalletAddress}
					name="walletAddress"
					placeholder="Enter wallet address of recipient"
				/>
			</Box>

			<Button
				onClick={transferModal$.transfer}
				disabled={!isWalletAddressValid}
				title="Transfer"
				label="Transfer"
				variant="primary"
				shape="square"
				size="sm"
				justifySelf="flex-end"
				paddingX="10"
			/>
		</Box>
	);
};

export default EnterWalletAddressView;
