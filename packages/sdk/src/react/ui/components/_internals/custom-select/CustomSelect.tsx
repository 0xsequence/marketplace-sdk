import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckmarkIcon, ChevronDownIcon } from '@0xsequence/design-system';
import { content, item, itemIndicator, trigger } from './styles.css';

interface CustomSelectProps {
	items: Array<{
		value: string;
		label: string;
		disabled?: boolean;
	}>;
	placeholder?: string;
	onValueChange?: (value: string) => void;
	defaultValue?: string;
}

const CustomSelectItem = React.forwardRef<
	HTMLDivElement,
	Select.SelectItemProps
>(({ children, ...props }, forwardedRef) => {
	return (
		<Select.Item className={item} {...props} ref={forwardedRef}>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className={itemIndicator}>
				<CheckmarkIcon size="xs" />
			</Select.ItemIndicator>
		</Select.Item>
	);
});

export const CustomSelect: React.FC<CustomSelectProps> = ({
	items,
	placeholder = 'Select an item...',
	onValueChange,
	defaultValue,
}) => {
	return (
		<Select.Root onValueChange={onValueChange} defaultValue={defaultValue}>
			<Select.Trigger className={trigger}>
				<Select.Value placeholder={placeholder} />
				<Select.Icon>
					<ChevronDownIcon size="xs" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className={content}>
					<Select.Viewport>
						{items.map((item, index) => (
							<CustomSelectItem
								key={index}
								value={item.value}
								disabled={item.disabled}
							>
								{item.label}
							</CustomSelectItem>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};
