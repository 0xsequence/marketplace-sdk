import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';

export const tokenPreview = style([
	atoms({
		display: 'flex',
		alignItems: 'center',
		width: 'full',
		marginX: '4',
	}),
]);
