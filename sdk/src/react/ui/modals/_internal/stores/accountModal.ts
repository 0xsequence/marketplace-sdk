import { createStore } from '@xstate/store';

type AccountModalStore = {
	isOpen: boolean;
};

export const _accountModalOpen$ = createStore<AccountModalStore>(
	{
		isOpen: false,
	},
	{
		setOpen: (context, event: { isOpen: boolean }) => ({
			...context,
			isOpen: event.isOpen,
		}),
		toggle: (context) => ({
			...context,
			isOpen: !context.isOpen,
		}),
	},
);
