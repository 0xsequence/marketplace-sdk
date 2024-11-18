import { Box, Button, Modal, Text } from '@0xsequence/design-system';
import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useAccount } from 'wagmi';

const accountModalOpen$ = observable(false);

export const useAccountModal = () => {
	return {
		show: () => accountModalOpen$.set(true),
		hide: () => accountModalOpen$.set(false),
		toggle: () => accountModalOpen$.toggle(),
	};
};

export const AccountModal = observer(function AccountModal() {
	const { address } = useAccount();
	return (
		accountModalOpen$.get() && (
			<Modal>
				<Box>
					<Text>Wallet address</Text>
					<Text>{address}</Text>
				</Box>
				<Button label="Sign out" />
			</Modal>
		)
	);
});
