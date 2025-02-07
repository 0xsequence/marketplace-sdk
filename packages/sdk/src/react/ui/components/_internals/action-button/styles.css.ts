import { globalStyle, style } from '@vanilla-extract/css';

export const actionButton = style({});

globalStyle(`${actionButton} > div`, {
	justifyContent: 'center',
	alignItems: 'center',
});
