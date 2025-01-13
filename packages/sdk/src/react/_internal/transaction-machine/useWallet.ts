import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { wallet, type WalletInstance } from './wallet';

type UseWalletReturn =
	| {
			status: 'loading';
			wallet: null;
			isLoading: true;
			isError: false;
	  }
	| {
			status: 'error';
			wallet: null;
			isLoading: false;
			isError: true;
	  }
	| {
			status: 'success';
			wallet: WalletInstance;
			isLoading: false;
			isError: false;
	  };

export const useWallet = (): UseWalletReturn => {
	const { chains } = useSwitchChain();
	const { data: walletClient, isLoading: walletClientIsLoading } =
		useWalletClient();
	const { connector, isConnected, isConnecting } = useAccount();

	if (walletClientIsLoading || isConnecting) {
		return {
			status: 'loading',
			wallet: null,
			isLoading: true,
			isError: false,
		};
	}

	if (!walletClient || !connector || !isConnected) {
		return {
			status: 'error',
			wallet: null,
			isLoading: false,
			isError: true,
		};
	}

	return {
		status: 'success',
		wallet: wallet({
			wallet: walletClient,
			chains,
			connector,
		}),
		isLoading: false,
		isError: false,
	};
};
