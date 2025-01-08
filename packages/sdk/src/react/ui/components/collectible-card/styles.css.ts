import { atoms } from '@0xsequence/design-system';
import { style, styleVariants } from '@vanilla-extract/css';

export const collectibleCard = style([
	{
		width: '175px',
		border: '1px solid hsla(0, 0%, 31%, 1)',
	},
]);

export const collectibleImage = style({
	width: '175px',
	height: '175px',
	objectFit: 'cover',
});

export const collectibleTileWrapper = style({
	padding: 0,
	border: 'none',
	borderRadius: 0,
	background: 'none',
	position: 'relative',
	selectors: {
		'&:focus': {
			outline: 'none',
		},
	},
});

export const offerBellButton = style({
	width: '22px',
	height: '22px',
});

const footerBase = style([atoms({ background: 'backgroundPrimary' })]);

export const footer = styleVariants({
	animated: [
		footerBase,
		{
			transition: 'transform 0.2s ease-in-out',
			selectors: {
				[`${collectibleTileWrapper}:hover &`]: {
					transform: 'translateY(-30px)',
				},
			},
		},
	],
	static: [footerBase],
});

export const actionWrapper = style({
	transition: 'transform 0.2s ease-in-out',
	position: 'absolute',
	width: '100%',
	bottom: -36,
	selectors: {
		[`${collectibleTileWrapper}:hover &`]: {
			transform: 'translateY(-36px)',
		},
	},
});
