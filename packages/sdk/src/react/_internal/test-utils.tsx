import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
			},
		},
	});

const config = createConfig({
	chains: [mainnet, sepolia],
	connectors: [
		mock({
			accounts: [
				'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				'0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
				'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
			],
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
	},
});

export function renderWithClient(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	const testQueryClient = createTestQueryClient();

	const { rerender, ...result } = rtlRender(ui, {
		wrapper: ({ children }) => (
			<WagmiProvider config={config}>
				<QueryClientProvider client={testQueryClient}>
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		),
		...options,
	});

	return {
		...result,
		rerender: (rerenderUi: ReactElement) =>
			rerender(
				<WagmiProvider config={config}>
					<QueryClientProvider client={testQueryClient}>
						{rerenderUi}
					</QueryClientProvider>
				</WagmiProvider>,
			),
	};
}

export * from '@testing-library/react';

export { renderWithClient as render };
