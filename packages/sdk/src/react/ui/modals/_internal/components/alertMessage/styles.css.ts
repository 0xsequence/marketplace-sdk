import { style, styleVariants } from '@vanilla-extract/css';

export const alertMessageBox = style([
	'flex items-center justify-between gap-3 p-4 rounded-xl',
]);

export const alertMessageBoxVariants = styleVariants({
	warning: {
		background: 'hsla(39, 71%, 40%, 0.3)',
	},
	info: {
		background: 'hsla(247, 100%, 75%, 0.3)',
	},
});
