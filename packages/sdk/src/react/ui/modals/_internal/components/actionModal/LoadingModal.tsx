import { Box, Spinner } from '@0xsequence/design-system';
import { ActionModal } from './ActionModal';

interface LoadingModalProps {
	isOpen: boolean;
	chainId: number;
	onClose: () => void;
	title: string;
}

export const LoadingModal = ({
	isOpen,
	chainId,
	onClose,
	title,
}: LoadingModalProps) => (
	<ActionModal
		isOpen={isOpen}
		chainId={chainId}
		onClose={onClose}
		title={title}
		ctas={[]}
	>
		<Box data-testid='loading-modal' display="flex" justifyContent="center" alignItems="center" padding="4">
			<Spinner size="lg" />
		</Box>
	</ActionModal>
);
