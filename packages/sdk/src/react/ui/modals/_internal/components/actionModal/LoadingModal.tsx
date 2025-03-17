import { Spinner } from '@0xsequence/design-system';
import { ActionModal } from './ActionModal';
import { JSX } from 'react/jsx-runtime';

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
}: LoadingModalProps): JSX.Element => (
	<ActionModal
		isOpen={isOpen}
		chainId={chainId}
		onClose={onClose}
		title={title}
		ctas={[]}
		disableAnimation
	>
		<div
			className="flex items-center justify-center p-4"
			data-testid="loading-modal"
		>
			<Spinner size="lg" />
		</div>
	</ActionModal>
);
