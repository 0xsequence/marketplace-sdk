import { observable } from '@legendapp/state';
import type { FeeOption } from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';

type WaasFeeOptionsModalState = {
	selectedFeeOption: FeeOption | undefined;
	isVisible: boolean;
	hide: () => void;
};

const initialState = {
	selectedFeeOption: undefined,
	isVisible: false,
	hide: () => {
		waasFeeOptionsModal$.isVisible.set(false);
		waasFeeOptionsModal$.selectedFeeOption.set(undefined);
	},
} as WaasFeeOptionsModalState;

export const waasFeeOptionsModal$ = observable(initialState);
