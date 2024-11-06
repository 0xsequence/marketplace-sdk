import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';
import { styleVariants } from '@vanilla-extract/css';

export const dialogOverlay = style([
	atoms({
		background: 'backgroundBackdrop',
		position: 'fixed',
		inset: '0',
		zIndex: '20',
	}),
]);

const dialogContentBase = style([
	atoms({
		display: 'flex',
		background: 'backgroundPrimary',
		borderRadius: 'lg',
		position: 'fixed',
		zIndex: '20',
	}),
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

export const closeButton = style([
	atoms({
		position: 'absolute',
		right: '6',
		top: '6',
	}),
]);
