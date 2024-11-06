import { globalStyle, style } from '@vanilla-extract/css';

export const rangeSelect = style({
	flex: 2,
});

globalStyle(`${rangeSelect} > label > button`, {
	background: '#FFFFFF1A',
	borderRadius: 30,
	padding: '12px',
	marginTop: 4,
	marginBottom: 4,
	height: 28,
	border: 'none',
	boxShadow: 'none',
});

globalStyle(`${rangeSelect} > label > button > span`, {
	fontSize: 10,
});

globalStyle(`${rangeSelect} > label > button > span > svg`, {
	width: 16,
	height: 16,
});
