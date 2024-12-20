import { atoms } from '@0xsequence/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const feeOptionsWrapper = style([
	atoms({
		position: 'absolute',
		background: 'buttonEmphasis',
		backdropFilter: 'blur',
		width: 'full',
		left: '0',
		borderRadius: 'lg',
		display: 'flex',
		flexDirection: 'column',
		gap: '2',
		padding: '4',
	}),
	{
		bottom: '-166px',
	},
]);

export const dialogOverlay = style([
	atoms({
		background: 'backgroundBackdrop',
		position: 'fixed',
		inset: '0',
		zIndex: '50',
	}),
]);

export const dialogContent = style([
	atoms({
		display: 'flex',
		background: 'backgroundPrimary',
		borderRadius: 'lg',
		position: 'fixed',
		zIndex: '50',
	}),
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
