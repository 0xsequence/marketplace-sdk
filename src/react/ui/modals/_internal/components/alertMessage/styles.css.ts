import { atoms } from '@0xsequence/design-system';
import { style, styleVariants } from '@vanilla-extract/css';

export const alertMessageBox = style([
	atoms({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: '3',
		padding: '4',
		borderRadius: 'md',
	}),
]);

export const alertMessageBoxVariants = styleVariants({
	warning: {
		background: 'hsla(39, 71%, 40%, 0.3)',
	},
	info: {
		background: 'hsla(247, 100%, 75%, 0.3)',
	},
});
