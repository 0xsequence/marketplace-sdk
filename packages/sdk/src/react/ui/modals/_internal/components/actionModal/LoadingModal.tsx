import { Spinner } from '@0xsequence/design-system';
import type { JSX } from 'react/jsx-runtime';
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
