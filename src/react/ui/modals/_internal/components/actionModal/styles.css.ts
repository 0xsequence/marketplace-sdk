import { globalStyle, style } from '@vanilla-extract/css';

export {
	closeButton,
	dialogContent,
	dialogOverlay,
} from '../../../../styles/modal.css';

export const cta = style({
	borderRadius: '12px !important',
});

globalStyle(`${cta} > div`, {
	justifyContent: 'center !important',
});
