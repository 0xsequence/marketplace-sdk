import { useConnect, useAccount } from 'wagmi';
import { useEffect } from 'react';

interface ConnectDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ConnectDialog({ isOpen, onClose }: ConnectDialogProps) {
	const { connectors, connect, isPending } = useConnect();
	const { isConnected } = useAccount();

	useEffect(() => {
		if (isConnected && isOpen) {
			onClose();
		}
	}, [isConnected, isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={onClose}
				onKeyDown={(e) => e.key === 'Escape' && onClose()}
			/>

			<div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white text-xl"
						type="button"
					>
						×
					</button>
				</div>

				<div className="space-y-2">
					{connectors.map((connector) => (
						<button
							key={connector.uid}
							onClick={() => connect({ connector })}
							disabled={isPending}
							className="w-full px-4 py-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 flex items-center gap-3"
							type="button"
						>
							{connector.icon && (
								<img src={connector.icon} alt="" className="w-6 h-6" />
							)}
							<span>{connector.name}</span>
							{isPending && (
								<span className="ml-auto text-sm">Connecting...</span>
							)}
						</button>
					))}
				</div>

				{connectors.length === 0 && (
					<p className="text-gray-400 text-center py-4">
						No wallet detected. Please install MetaMask or another Web3 wallet.
					</p>
				)}
			</div>
		</div>
	);
}
