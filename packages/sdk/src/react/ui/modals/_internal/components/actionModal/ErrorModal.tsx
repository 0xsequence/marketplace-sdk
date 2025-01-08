import { Box } from '@0xsequence/design-system';
import { ActionModal } from './ActionModal';

interface ErrorModalProps {
	isOpen: boolean;
	chainId: number;
	onClose: () => void;
	title: string;
}

export const ErrorModal = ({
	isOpen,
	chainId,
	onClose,
	title,
}: ErrorModalProps) => (
	<ActionModal
		isOpen={isOpen}
		chainId={chainId}
		onClose={onClose}
		title={title}
		ctas={[]}
	>
		<Box display="flex" justifyContent="center" alignItems="center" padding="4">
			Error loading item details
		</Box>
	</ActionModal>
);
