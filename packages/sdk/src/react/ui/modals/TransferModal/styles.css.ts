import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';
import { dialogContent } from '../../styles/index';

export { closeButton, dialogOverlay } from '../../styles/modal.css';

export const transferModalContent = style([
	dialogContent.wide,
	atoms({
		padding: '7',
	}),
	{
		width: '540px',
		'@media': {
			'screen and (max-width: 540px)': {
				width: '100%',
			},
		},
	},
]);
