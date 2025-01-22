import { Button } from '@0xsequence/design-system';
import { Order } from '../../../../../packages/sdk/src';

export interface ActionCellProps {
	order: Order;
	getLabel: (
		order: Order,
	) => 'Buy' | 'Sell' | 'Cancel' | 'Cancelling...' | undefined;
	onAction: (order: Order) => void | Promise<void>;
}

export const ActionCell = ({ order, getLabel, onAction }: ActionCellProps) => {
	const label = getLabel(order);

	if (!label) {
		return null;
	}

	return (
		<Button
			size="xs"
			onClick={async () => {
				await onAction(order);
			}}
			label={label}
		/>
	);
};
