import { createStore } from '@xstate/store';

type SetOpenEvent = { type: 'setOpen'; isOpen: boolean };

export const _accountModalOpen$ = createStore({
	context: {
		isOpen: false,
	},
	on: {
		setOpen: (context, event: SetOpenEvent) => ({
			...context,
			isOpen: event.isOpen,
		}),
		toggle: (context) => ({
			...context,
			isOpen: !context.isOpen,
		}),
	},
});
