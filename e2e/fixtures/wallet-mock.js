(() => {
	const TEST_ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
	const _TEST_PRIVATE_KEY =
		'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

	let connected = false;
	let currentChainId = '0x1';
	let accounts = [];

	const listeners = new Map();

	function emit(event, data) {
		const eventListeners = listeners.get(event) || [];
		eventListeners.forEach((listener) => {
			try {
				listener(data);
			} catch (e) {
				console.error('Wallet mock event listener error:', e);
			}
		});
	}

	const provider = {
		isMetaMask: true,
		isConnected: () => connected,

		on(event, listener) {
			if (!listeners.has(event)) {
				listeners.set(event, []);
			}
			listeners.get(event).push(listener);
			return this;
		},

		removeListener(event, listener) {
			const eventListeners = listeners.get(event) || [];
			const index = eventListeners.indexOf(listener);
			if (index > -1) {
				eventListeners.splice(index, 1);
			}
			return this;
		},

		off(event, listener) {
			return this.removeListener(event, listener);
		},

		async request({ method, params }) {
			console.log('[WalletMock] request:', method, params);

			switch (method) {
				case 'eth_requestAccounts': {
					connected = true;
					accounts = [TEST_ACCOUNT];
					emit('connect', { chainId: currentChainId });
					emit('accountsChanged', accounts);
					return accounts;
				}

				case 'eth_accounts': {
					return connected ? accounts : [];
				}

				case 'eth_chainId': {
					return currentChainId;
				}

				case 'net_version': {
					return String(Number.parseInt(currentChainId, 16));
				}

				case 'wallet_switchEthereumChain': {
					const newChainId = params[0].chainId;
					currentChainId = newChainId;
					emit('chainChanged', newChainId);
					return null;
				}

				case 'wallet_addEthereumChain': {
					const newChainId = params[0].chainId;
					currentChainId = newChainId;
					emit('chainChanged', newChainId);
					return null;
				}

				case 'wallet_getPermissions': {
					return connected
						? [
								{
									invoker: window.location.origin,
									parentCapability: 'eth_accounts',
									caveats: [
										{
											type: 'restrictReturnedAccounts',
											value: accounts,
										},
									],
								},
							]
						: [];
				}

				case 'wallet_requestPermissions': {
					connected = true;
					accounts = [TEST_ACCOUNT];
					emit('accountsChanged', accounts);
					return [
						{
							invoker: window.location.origin,
							parentCapability: 'eth_accounts',
							caveats: [
								{
									type: 'restrictReturnedAccounts',
									value: accounts,
								},
							],
						},
					];
				}

				case 'personal_sign': {
					const message = params[0];
					console.log('[WalletMock] personal_sign message:', message);
					return `0x${'00'.repeat(65)}`;
				}

				case 'eth_signTypedData':
				case 'eth_signTypedData_v3':
				case 'eth_signTypedData_v4': {
					const typedData =
						typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
					console.log('[WalletMock] signTypedData:', typedData);
					return `0x${'00'.repeat(65)}`;
				}

				case 'eth_sendTransaction': {
					const tx = params[0];
					console.log('[WalletMock] eth_sendTransaction:', tx);
					return (
						'0x' +
						Array(64)
							.fill(0)
							.map(() => Math.floor(Math.random() * 16).toString(16))
							.join('')
					);
				}

				case 'eth_getTransactionReceipt': {
					const txHash = params[0];
					return {
						transactionHash: txHash,
						transactionIndex: '0x0',
						blockHash: `0x${'0'.repeat(64)}`,
						blockNumber: '0x1',
						from: TEST_ACCOUNT,
						to: `0x${'0'.repeat(40)}`,
						cumulativeGasUsed: '0x5208',
						gasUsed: '0x5208',
						contractAddress: null,
						logs: [],
						logsBloom: `0x${'0'.repeat(512)}`,
						status: '0x1',
					};
				}

				case 'eth_estimateGas': {
					return '0x5208'; // 21000
				}

				case 'eth_gasPrice': {
					return '0x3b9aca00'; // 1 gwei
				}

				case 'eth_getBalance': {
					return '0x56bc75e2d63100000'; // 100 ETH
				}

				case 'eth_blockNumber': {
					return '0x1';
				}

				case 'eth_call': {
					return '0x';
				}

				case 'eth_getTransactionCount': {
					return '0x0';
				}

				default: {
					console.warn('[WalletMock] Unhandled method:', method);
					throw new Error(`WalletMock: Method ${method} not implemented`);
				}
			}
		},

		enable() {
			return this.request({ method: 'eth_requestAccounts' });
		},

		send(methodOrPayload, paramsOrCallback) {
			if (typeof methodOrPayload === 'string') {
				return this.request({
					method: methodOrPayload,
					params: paramsOrCallback,
				});
			}
			return this.request({
				method: methodOrPayload.method,
				params: methodOrPayload.params,
			});
		},

		sendAsync(payload, callback) {
			this.request({ method: payload.method, params: payload.params })
				.then((result) =>
					callback(null, { id: payload.id, jsonrpc: '2.0', result }),
				)
				.catch((error) => callback(error, null));
		},
	};

	const walletMock = {
		connect: async () => {
			return provider.request({ method: 'eth_requestAccounts' });
		},

		disconnect: async () => {
			connected = false;
			accounts = [];
			emit('accountsChanged', []);
			emit('disconnect', { code: 4900, message: 'Disconnected' });
		},

		switchChain: async (chainId) => {
			const hexChainId = `0x${chainId.toString(16)}`;
			return provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: hexChainId }],
			});
		},

		getAccounts: async () => {
			return accounts;
		},

		getChainId: async () => {
			return currentChainId;
		},

		isConnected: () => connected,
	};

	window.ethereum = provider;
	window.__walletMock = walletMock;

	window.dispatchEvent(new Event('ethereum#initialized'));

	console.log('[WalletMock] Injected and ready');
})();
