import { Box, Spinner } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { ActionModal } from './ActionModal';
import type { ActionModalState } from './store';

interface LoadingModalProps {
	store: Observable<ActionModalState>;
	onClose: () => void;
	title: string;
}

export const LoadingModal = ({ store, onClose, title }: LoadingModalProps) => (
	<ActionModal store={store} onClose={onClose} title={title} ctas={[]}>
		<Box display="flex" justifyContent="center" alignItems="center" padding="4">
			<Spinner size="lg" />
		</Box>
	</ActionModal>
);
