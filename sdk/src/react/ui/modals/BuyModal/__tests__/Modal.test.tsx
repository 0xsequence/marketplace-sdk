import { WebSdkWrapper, cleanup, render, screen } from '@test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { server } from '@test';
import type { Address } from 'viem';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { BuyModal } from '../Modal';
import { buyModalStore } from '../store';

describe('BuyModal', () => {
	beforeEach(() => {
		buyModalStore.send({ type: 'close' });
	});

	afterEach(() => {
		cleanup();
		// Reset server handlers
		server.resetHandlers();
	});

	// Currently this is the only test we can run without the provider
	it.skip('should not render when isOpen is false', () => {
		render(<BuyModal />);

		expect(screen.queryByText('Loading Sequence Pay')).not.toBeInTheDocument();
		expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
		expect(screen.queryByText('Select Quantity')).not.toBeInTheDocument();
	});

	it.skip('should render error modal when there is an error', async () => {
		// server.use(
		//   http.post(mockMetadataEndpoint("GetContractInfo"), () => {
		//     return new HttpResponse(null, {
		//       status: 404,
		//     })
		//   }),
		// );
		// buyModalStore.send({
		//   type: 'open',
		//   props: {
		//     orderId: mockOrder.orderId,
		//     chainId: mockOrder.chainId,
		//     collectionAddress: mockOrder.collectionContractAddress as Address,
		//     collectibleId: "1",
		//     marketplace: mockOrder.marketplace,
		//   },
		// });
		// render(
		// <WebSdkWrapper>
		//   <BuyModal />
		// </WebSdkWrapper>
		// );
		// // Should show error modal
		// await waitFor(() => {
		//   expect(screen.getByText("Error")).toBeInTheDocument();
		// }, { timeout: 1000 });
	});

	it.skip('should render ERC1155QuantityModal when contract type is ERC1155', async () => {
		// // Create an ERC1155 mock collection
		// const erc1155Collection = {
		//   ...mockCollection,
		//   contractType: ContractType.ERC1155,
		// };
		// const erc1155Order = {
		//   ...testOrder,
		//   quantityRemaining: "10",
		//   quantityRemainingFormatted: "10",
		// };
		// buyModalStore.send({
		//   type: 'open',
		//   props: {
		//     orderId: erc1155Order.orderId,
		//     chainId: erc1155Order.chainId,
		//     collectionAddress: erc1155Order.collectionContractAddress,
		//     collectibleId: erc1155Order.tokenId,
		//     marketplace: erc1155Order.marketplace,
		//   },
		// });
		// render(<BuyModal />);
		// // First should show loading
		// expect(screen.getByText("Loading Sequence Pay")).toBeInTheDocument();
		// // Then should show quantity modal for ERC1155
		// await waitFor(() => {
		//   expect(screen.getByText("Select Quantity")).toBeInTheDocument();
		// }, { timeout: 5000 });
	});

	it('should show loading modal', async () => {
		buyModalStore.send({
			type: 'open',
			props: {
				orderId: mockOrder.orderId,
				chainId: mockOrder.chainId,
				collectionAddress: mockOrder.collectionContractAddress as Address,
				collectibleId: '1',
				marketplace: mockOrder.marketplace,
			},
		});

		render(
			<WebSdkWrapper>
				<BuyModal />
			</WebSdkWrapper>,
		);

		// Should show loading modal
		expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
	});
});
