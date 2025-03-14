import { Box } from '@0xsequence/design-system';

import { useSelector } from '@xstate/store/react';
import type { Order } from '../../../../_internal';
import { ActionModal } from '../../_internal/components/actionModal';
import { buyModalStore } from '../store';
import QuantityInput from './quantityInputNew';
export const ERC1155QuantityModal = ({
	order,
}: {
	order: Order;
}) => {
	const quantity = useSelector(
		buyModalStore,
		(state) => state.context.quantity,
	);

	return (
		<ActionModal
			isOpen={true}
			chainId={order.chainId}
			onClose={() => {}}
			title="Select Quantity"
			ctas={[
				{
					label: 'Buy now',
					onClick: () => {},
				},
			]}
		>
			<Box display="flex" flexDirection="column" gap="4">
				<QuantityInput
					quantity={quantity}
					onQuantityChange={(value) =>
						buyModalStore.trigger.setQuantity({ quantity: value })
					}
					invalidQuantity={false}
					onInvalidQuantityChange={() => {}}
					decimals={order.quantityDecimals}
					maxQuantity={order.quantityRemaining}
				/>
			</Box>
		</ActionModal>
	);
};
