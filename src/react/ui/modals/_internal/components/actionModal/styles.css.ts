import { atoms } from '@0xsequence/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const dialogOverlay = style([
	atoms({
		background: 'backgroundBackdrop',
		position: 'fixed',
		inset: '0',
		zIndex: '20',
	}),
]);

export const dialogContent = style([
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
		width: '360px',
		height: '476px',
		padding: '24px',
		'@media': {
			'screen and (max-width: 640px)': {
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
]);

export const closeButton = style([
	atoms({
		position: 'absolute',
		right: '6',
		top: '6',
	}),
]);

export const cta = style({
	borderRadius: '12px !important',
});

globalStyle(`${cta} > div`, {
	justifyContent: 'center !important',
});
