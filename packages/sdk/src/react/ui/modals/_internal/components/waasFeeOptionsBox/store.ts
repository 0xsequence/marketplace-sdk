import { Observable, observable } from '@legendapp/state';
import type { FeeOption } from '../waasFeeOptionsSelect/WaasFeeOptionsSelect';

type WaasFeeOptionsModalState = {
	selectedFeeOption: FeeOption | undefined;
};

const initialState = {
	selectedFeeOption: undefined,
} as WaasFeeOptionsModalState;

export const waasFeeOptionsModal$: Observable<WaasFeeOptionsModalState> = observable(initialState);
