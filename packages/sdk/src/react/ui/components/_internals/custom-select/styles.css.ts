import { style } from '@vanilla-extract/css';

export const trigger = style([
	'inline-flex items-center justify-center rounded-full px-3 text-sm h-7 gap-2 bg-background-secondary text-text100 cursor-pointer border-none mr-1',
]);

export const content = style([
	'bg-background-raised border-1 border backdrop-blur-md border-solid rounded-xl overflow-hidden z-30',
]);

export const item = style([
	'flex text-sm text-text100 rounded-none items-center h-7 p-2 pl-6 relative select-none cursor-pointer',
	{
		':hover': {
			background: 'var(--seq-colors-background-muted)',
		},
	},
]);

export const itemIndicator = style([
	'inline-flex absolute left-1 items-center justify-center',
]);
