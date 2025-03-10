import { style } from '@vanilla-extract/css';

export const dateSelectButton = style({
	flex: '3 !important',
	padding: '10px 8px !important',
	height: '36px !important',
	border: '1px solid #4F4F4F !important',
	borderRadius: '4px !important',
	fontWeight: '400 !important',
	fontSize: '12px !important',
});

export const dateSelectPopoverContent = style([
	'z-20 pointer-events-auto bg-background-raised backdrop-blur-md rounded-lg',
]);
