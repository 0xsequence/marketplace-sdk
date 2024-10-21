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
		zIndex: '30',
	}),
	{
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '360px',
		padding: '24px',
	},
]);

export const closeButton = style([
	atoms({
		position: 'absolute',
		right: '6',
		top: '6',
	}),
]);

export const collectiblesGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
});

export const collectiblesGridItem = style({
	width: '150px',
	height: '150px',
});

globalStyle(
	`${collectiblesGrid} > ${collectiblesGridItem}:nth-child(1):only-child`,
	{
		width: '312px',
		height: '312px',
	},
);

// horizontal centering for the 3rd item
globalStyle(`${collectiblesGrid} > ${collectiblesGridItem}:nth-child(3)`, {
	gridColumn: '1 / -1',
	justifySelf: 'center',
});

globalStyle(
	`${collectiblesGrid}:has(${collectiblesGridItem}:nth-child(4)) > ${collectiblesGridItem}`,
	{
		gridColumn: 'unset',
	},
);

export const collectiblesGridImage = style({
	width: '100%',
	height: '100%',
	objectFit: 'contain',
});

export const collectiblesGridImagePale = style([
	collectiblesGridImage,
	{
		// opacity:1 is set to inline style of the @0xsequence/design-system Image component, so we need to use !important
		opacity: '0.4 !important',
	},
]);
