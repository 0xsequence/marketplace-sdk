import { useAccount, useDisconnect } from 'wagmi';
import { useOpenConnectModal } from '@0xsequence/marketplace-sdk/react';

export function ConnectButton() {
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { openConnectModal } = useOpenConnectModal();

	if (isConnected && address) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-300 font-mono">
					{address.slice(0, 6)}...{address.slice(-4)}
				</span>
				<button
					onClick={() => disconnect()}
					className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
					type="button"
				>
					Disconnect
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={openConnectModal}
			className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
			type="button"
		>
			Connect Wallet
		</button>
	);
}
