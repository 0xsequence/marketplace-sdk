import { useConfig } from './useConfig';

export const useOpenConnectModal = () => {
	const context = useConfig();

	return {
		setOpenConnectModal: context.setOpenConnectModal,
	};
};
