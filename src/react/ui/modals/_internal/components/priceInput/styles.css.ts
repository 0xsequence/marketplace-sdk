import { globalStyle, style } from '@vanilla-extract/css';

export const priceInputWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	margin: '16px 0 2px 0',
});

globalStyle(`${priceInputWrapper} > label`, {
	gap: 2,
});

globalStyle(`${priceInputWrapper} > label > div > div`, {
	height: 36,
	fontSize: 12,
	borderRadius: 4,
	paddingLeft: 28,
	paddingRight: 0,
});

globalStyle(`${priceInputWrapper} > label > div > div > input`, {
	fontSize: 12,
});
