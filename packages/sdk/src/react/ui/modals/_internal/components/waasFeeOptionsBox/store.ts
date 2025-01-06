import { observable } from '@legendapp/state';
import { FeeOption } from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';

type WaasFeeOptionsModalState = {
	selectedFeeOption: FeeOption | undefined;
};

const initialState = {
	selectedFeeOption: undefined,
} as WaasFeeOptionsModalState;

export const waasFeeOptionsModal$ = observable(initialState);
