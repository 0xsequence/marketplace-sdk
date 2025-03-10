import { style } from '@vanilla-extract/css';
import { styleVariants } from '@vanilla-extract/css';

export const dialogOverlay = style([
	'bg-background-backdrop fixed inset-0 z-20',
]);

const dialogContentBase = style([
	'flex bg-background-primary rounded-2xl fixed z-20',
	{
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		padding: '24px',
	},
]);

export const dialogContent = styleVariants({
	narrow: [
		dialogContentBase,
		{
			width: '360px',
			'@media': {
				'screen and (max-width: 360px)': {
					width: '100%',
					bottom: '0',
					transform: 'unset',
					top: 'unset',
					left: 'unset',
					borderBottomLeftRadius: '0 !important',
					borderBottomRightRadius: '0 !important',
				},
			},
		},
	],
	wide: [
		dialogContentBase,
		{
			width: '540px',
			'@media': {
				'screen and (max-width: 540px)': {
					width: '100%',
					bottom: '0',
					transform: 'unset',
					top: 'unset',
					left: 'unset',
					borderBottomLeftRadius: '0 !important',
					borderBottomRightRadius: '0 !important',
				},
			},
		},
	],
});

export const closeButton = style(['absolute right-6 top-6']);
