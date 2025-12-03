import { useConfig } from '../config/useConfig';

export const useOpenConnectModal = () => {
	const context = useConfig();

	return {
		openConnectModal: context.openConnectModal,
	};
};
