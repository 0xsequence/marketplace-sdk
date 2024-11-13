import { observer } from '@legendapp/state/react';
import AlertMessage from '../../../_internal/components/alertMessage';
import getMessage from '../../messages';
import { Box, Button, Text } from '@0xsequence/design-system';

const FollowWalletInstructionsView = observer(() => {
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
				disabled={true}
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
});

export default FollowWalletInstructionsView;
