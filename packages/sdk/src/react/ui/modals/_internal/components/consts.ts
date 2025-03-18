const MODAL_WIDTH = '360px';

const MODAL_OVERLAY_PROPS = {
	style: {
		background: 'hsla(0, 0%, 15%, 0.9)',
	},
};

const MODAL_CONTENT_PROPS: {
	style: {
		width: string;
		height: string;
	};
} = {
	style: {
		width: MODAL_WIDTH,
		height: 'auto',
	},
};

export { MODAL_OVERLAY_PROPS, MODAL_CONTENT_PROPS };
