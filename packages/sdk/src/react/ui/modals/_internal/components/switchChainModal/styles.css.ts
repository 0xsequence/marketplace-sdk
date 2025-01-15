import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';
import { styleVariants } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { dialogContent, dialogOverlay } from '../../../../styles/index';

export { closeButton, dialogOverlay } from '../../../../styles/modal.css';

export const switchChainDialogOverlay = style([
	dialogOverlay,
	atoms({
		zIndex: '30',
	}),
]);

export const switchChainModalContent = style([
	dialogContent.wide,
	atoms({
		display: 'grid',
		flexDirection: 'column',
		gap: '6',
		padding: '7',
	}),
]);

const switchChainCtaBase = style({
	width: '147px',
});

export const switchChainCta = styleVariants({
	default: [switchChainCtaBase],
	pending: [
		switchChainCtaBase,
		{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	],
});

globalStyle(`${switchChainCta.pending} > div`, {
	justifyContent: 'center',
});
