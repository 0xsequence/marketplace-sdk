import { Button, Text } from '@0xsequence/design-system';

interface ActionCellProps<T> {
	item: T;
	onAction: (item: T) => void;
	label: string | null;
}

export function ActionCell<T>({ item, onAction, label }: ActionCellProps<T>) {
	if (!label)
		return (
			<Text variant="small" color="text100">
				---
			</Text>
		);
	return <Button size="xs" onClick={() => onAction(item)} label={label} />;
}
