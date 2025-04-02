import { observable } from '@legendapp/state';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';

type WaasFeeOptionsModalState = {
	selectedFeeOption: FeeOption | undefined;
	pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
	isVisible: boolean;
	hide: () => void;
};

const initialState = {
	selectedFeeOption: undefined,
	pendingFeeOptionConfirmation: undefined,
	isVisible: false,
	hide: () => {
		waasFeeOptionsModal$.isVisible.set(false);
		waasFeeOptionsModal$.selectedFeeOption.set(undefined);
		waasFeeOptionsModal$.pendingFeeOptionConfirmation.set(undefined);
	},
} as WaasFeeOptionsModalState;

export const waasFeeOptionsModal$ = observable(initialState);
