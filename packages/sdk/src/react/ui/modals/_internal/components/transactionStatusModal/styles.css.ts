import { atoms } from '@0xsequence/design-system';
import { dialogContent } from '../../../../styles/index';
import { style } from '@vanilla-extract/css';

export { closeButton, dialogOverlay } from '../../../../styles/modal.css';

export const transactionStatusModalContent = style([
	dialogContent.wide,
	atoms({
		display: 'grid',
		flexDirection: 'column',
		gap: '6',
		padding: '7',
	}),
]);
