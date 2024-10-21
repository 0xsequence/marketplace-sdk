import { useEffect } from 'react';

import TransactionViewFooter from '../../_components/footer';
import TransactionPreview from '../../_components/transactionPreview';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import { Box, Text } from '@0xsequence/design-system';

const TransferTransactionProcessingView = () => {
	// Replace the useEffect with the actual logic, this is for just a placeholder
	useEffect(() => {
		const timeout = setTimeout(() => {
			transferModal$.state.isTransactionProcessing.set(false);
			transferModal$.nextStep();
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Box display="flex" flexDirection="column" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold">
				Your transfer is processing
			</Text>

			<Text color="text80" fontSize="normal" fontWeight="medium">
				{getMessage(
					'transferProcessing',
					transferModal$.state.collectibleMetadata.get()?.name,
				)}
			</Text>

			<TransactionPreview />

			<TransactionViewFooter />
		</Box>
	);
};

export default TransferTransactionProcessingView;
