import { globalStyle, style } from '@vanilla-extract/css';

export const quantityInputWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	margin: '16px 0 2px 0',
});

globalStyle(`${quantityInputWrapper} > label`, {
	gap: 2,
});

globalStyle(`${quantityInputWrapper} > label > div > div`, {
	height: 36,
	fontSize: 12,
	borderRadius: 4,
	paddingLeft: 12,
	paddingRight: 0,
});

globalStyle(
	`${quantityInputWrapper} > label > div > div:has(:disabled) , ${quantityInputWrapper} > label > div > div:has(:disabled):hover`,
	{
		opacity: 1,
	},
);

globalStyle(`${quantityInputWrapper} > label > div > div > input`, {
	fontSize: 12,
});
