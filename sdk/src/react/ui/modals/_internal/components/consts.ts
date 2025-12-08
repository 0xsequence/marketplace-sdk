import { TransactionType } from '../../../../_internal';

const MODAL_WIDTH = '360px';
const MODAL_WIDTH_WIDER = '500px';

const MODAL_OVERLAY_PROPS = {
	style: {
		background: 'hsla(0, 0%, 15%, 0.9)',
	},
};

const MODAL_CONTENT_PROPS = (transactionType?: TransactionType) => {
	if (transactionType === TransactionType.TRANSFER) {
		return {
			style: {
				height: 'auto',
			},
			className: `w-[${MODAL_WIDTH_WIDER}] md:w-[${MODAL_WIDTH}]`,
		};
	}

	return {
		style: {
			width: MODAL_WIDTH,
			height: 'auto',
		},
	};
};

export { MODAL_OVERLAY_PROPS, MODAL_CONTENT_PROPS };
