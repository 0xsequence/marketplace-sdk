import { globalStyle, style } from '@vanilla-extract/css';

export const feeOptionsWrapper = style([
	'flex absolute bg-button-emphasis backdrop-blur-md w-full left-0 rounded-2xl flex-col gap-2 p-4',
	{
		bottom: '-140px',
	},
]);

export const dialogOverlay = style([
	'bg-background-backdrop fixed inset-0 z-50',
]);

export const dialogContent = style([
	'flex bg-background-primary rounded-2xl fixed z-50',
	{
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		padding: '24px',
	},
]);

export const cta = style({
	borderRadius: '12px !important',
});

globalStyle(`${cta} > div`, {
	justifyContent: 'center !important',
});
