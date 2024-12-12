import { Box } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { ActionModal } from './ActionModal';
import type { ActionModalState } from './store';

interface ErrorModalProps {
	store: Observable<ActionModalState>;
	onClose: () => void;
	title: string;
}

export const ErrorModal = ({ store, onClose, title }: ErrorModalProps) => (
	<ActionModal store={store} onClose={onClose} title={title} ctas={[]}>
		<Box display="flex" justifyContent="center" alignItems="center" padding="4">
			Error loading item details
		</Box>
	</ActionModal>
);
