import { observable } from '@legendapp/state';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../../../../types/waas-types';

type SelectWaasFeeOptionsState = {
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
		selectWaasFeeOptions$.isVisible.set(false);
		selectWaasFeeOptions$.selectedFeeOption.set(undefined);
		selectWaasFeeOptions$.pendingFeeOptionConfirmation.set(undefined);
	},
} as SelectWaasFeeOptionsState;

export const selectWaasFeeOptions$ = observable(initialState);
