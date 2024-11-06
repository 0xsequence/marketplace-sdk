import { useEffect } from 'react';

import AlertMessage from '../../../_internal/components/alertMessage';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import { Box, Button, Text } from '@0xsequence/design-system';

const FollowWalletInstructionsView = () => {
	// TODO: Replace the useEffect with the actual logic, this is for just a placeholder
	useEffect(() => {
		const timeout = setTimeout(() => {
			// Simulate the user is done with the wallet processing
			transferModal$.state.isWalletProcessing.set(false);
			transferModal$.state.isTransactionProcessing.set(true);
			transferModal$.nextStep();
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Box display="grid" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold">
				Transfer your item
			</Text>

			<Box display="flex" flexDirection="column" gap="3">
				<AlertMessage
					message={getMessage('followWalletInstructions')}
					type="info"
				/>
			</Box>

			<Button
				disabled={transferModal$.state.isWalletProcessing.get()}
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

export default FollowWalletInstructionsView;
