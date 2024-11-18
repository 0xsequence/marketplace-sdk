import { globalStyle, style } from '@vanilla-extract/css';

export const priceInputWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
});

export const priceInputCurrencyImage = style({
	top: 29,
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
