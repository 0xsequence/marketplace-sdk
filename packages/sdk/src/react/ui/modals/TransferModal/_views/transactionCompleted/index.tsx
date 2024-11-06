import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import { Box, Text } from '@0xsequence/design-system';

const TransferTransactionCompletedView = () => {
	return (
		<Box display="flex" flexDirection="column" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold">
				Your transfer has processed
			</Text>

			<Text color="text80" fontSize="normal" fontWeight="medium">
				{getMessage(
					'transferCompleted',
					transferModal$.state.collectibleMetadata.get()?.name,
				)}
			</Text>
		</Box>
	);
};

export default TransferTransactionCompletedView;
