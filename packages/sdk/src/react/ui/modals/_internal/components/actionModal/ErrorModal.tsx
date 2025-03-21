import { Box, Text } from '@0xsequence/design-system';
import { ActionModal } from './ActionModal';

interface ErrorModalProps {
	isOpen: boolean;
	chainId: number;
	onClose: () => void;
	title: string;
	message?: string;
}

export const ErrorModal = ({
	isOpen,
	chainId,
	onClose,
	title,
	message,
}: ErrorModalProps) => (
	<ActionModal
		isOpen={isOpen}
		chainId={chainId}
		onClose={onClose}
		title={title}
		ctas={[]}
	>
		<Box
			data-testid="error-modal"
			display="flex"
			justifyContent="center"
			alignItems="center"
			padding="4"
		>
			<Text color="text80" fontFamily="body">
				{message || 'Error loading item details'}
			</Text>
		</Box>
	</ActionModal>
);
