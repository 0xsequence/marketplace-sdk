export interface ErrorAction {
	type: 'retry' | 'topUp' | 'switchChain' | 'signIn' | 'custom';
	label: string;
	data?: unknown;
}
