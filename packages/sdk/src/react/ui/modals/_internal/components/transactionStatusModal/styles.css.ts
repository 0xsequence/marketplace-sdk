import { style } from '@vanilla-extract/css';
import { dialogContent } from '../../../../styles/index';

export { closeButton, dialogOverlay } from '../../../../styles/modal.css';

export const transactionStatusModalContent = style([
	dialogContent.wide,
	'grid flex-col gap-6 p-7',
]);
