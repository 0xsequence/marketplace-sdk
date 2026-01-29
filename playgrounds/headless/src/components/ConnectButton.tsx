import { useOpenConnectModal } from '@0xsequence/marketplace-sdk/react';
import { useAccount, useDisconnect } from 'wagmi';

export function ConnectButton() {
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { openConnectModal } = useOpenConnectModal();

	if (isConnected && address) {
		return (
			<div className="flex items-center gap-2">
				<span className="font-mono text-gray-300 text-sm">
					{address.slice(0, 6)}...{address.slice(-4)}
				</span>
				<button
					onClick={() => disconnect()}
					className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
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
			className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
			type="button"
		>
			Connect Wallet
		</button>
	);
}
