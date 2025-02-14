import { Button } from '@0xsequence/design-system2';
import type { Order } from '@0xsequence/marketplace-sdk';
import type { ReactNode } from 'react';

export interface ActionCellProps {
	order: Order;
	getLabel: (order: Order) => 'Buy' | 'Sell' | 'Cancel' | ReactNode | undefined;
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
