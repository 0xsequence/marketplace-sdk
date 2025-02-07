import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';

export const collectibleCard = style([
	{
		width: '175px',
		border: '1px solid hsla(0, 0%, 31%, 1)',
		':active': {
			border: '1px solid hsla(247, 100%, 75%, 1)',
			boxShadow: '0px 0px 0px 1px hsla(247, 100%, 75%, 1)',
		},
		':focus': {
			border: '1px solid hsla(247, 100%, 75%, 1)',
			boxShadow: '0px 0px 0px 2px hsla(247, 100%, 75%, 1)',
			outline: '4px solid hsla(254, 100%, 57%, 1)',
			outlineOffset: '2px',
		},
	},
]);

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

		[`${collectibleCard}:focus &`]: {
			outline: '3px solid black',
			outlineOffset: '-3px',
			borderRadius: 10,
		},
	},
});

export const collectibleImage = style({
	width: '175px',
	height: '175px',
	objectFit: 'cover',
	transition: 'transform 0.2s ease-in-out',
	selectors: {
		[`${collectibleTileWrapper}:hover &`]: {
			transform: 'scale(1.165)',
		},
	},
});

export const offerBellButton = style({
	width: '22px',
	height: '22px',
});

export const footer = style([atoms({ background: 'backgroundPrimary' })]);

export const actionWrapper = style([
	atoms({
		backdropFilter: 'blur',
	}),
	{
		background: 'hsla(0, 0%, 100%, 0.1)',
		transition: 'transform 0.2s ease-in-out',
		position: 'absolute',
		width: '100%',
		bottom: -44,
		selectors: {
			[`${collectibleTileWrapper}:hover &`]: {
				transform: 'translateY(-44px)',
			},
		},
	},
]);
