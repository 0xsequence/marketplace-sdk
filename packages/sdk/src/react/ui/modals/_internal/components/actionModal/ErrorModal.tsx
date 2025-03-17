import { Text } from '@0xsequence/design-system';
import { ActionModal } from './ActionModal';
import { JSX } from 'react/jsx-runtime';

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
}: ErrorModalProps): JSX.Element => (
	<ActionModal
		isOpen={isOpen}
		chainId={chainId}
		onClose={onClose}
		title={title}
		ctas={[]}
	>
		<div
			className="flex items-center justify-center p-4"
			data-testid="error-modal"
		>
			<Text className="font-body" color="text80">
				{message || 'Error loading item details'}
			</Text>
		</div>
	</ActionModal>
);
