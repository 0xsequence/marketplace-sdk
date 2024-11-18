import { atoms } from '@0xsequence/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const currencySelect = style([
	atoms({
		height: 'full',
	}),
]);

globalStyle(`${currencySelect} > label`, {
	height: '100%',
});

globalStyle(`${currencySelect} > label > button`, {
	background: '#FFFFFF1A',
	borderRadius: 30,
	padding: '12px',
	marginRight: 8,
	marginTop: 4,
	marginBottom: 4,
	height: 28,
	border: 'none',
	boxShadow: 'none',
});

globalStyle(`${currencySelect} > label > button > span`, {
	fontSize: 10,
});

globalStyle(`${currencySelect} > label > button > span > svg`, {
	width: 16,
	height: 16,
});
