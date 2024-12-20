import { CheckmarkIcon, ChevronDownIcon } from '@0xsequence/design-system';
import * as Select from '@radix-ui/react-select';
import React, { ReactNode } from 'react';
import { content, item, itemIndicator, trigger } from './styles.css';

export interface SelectItem {
	value: string;
	content: ReactNode;
	disabled?: boolean;
}

interface CustomSelectProps {
	items: SelectItem[];
	onValueChange?: (value: string) => void;
	defaultValue?: SelectItem;
}

const CustomSelectItem = React.forwardRef<
	HTMLDivElement,
	Select.SelectItemProps & { children: ReactNode }
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
	onValueChange,
	defaultValue,
}) => {
	return (
		<Select.Root
			onValueChange={onValueChange}
			defaultValue={defaultValue?.value}
		>
			<Select.Trigger className={trigger}>
				<Select.Value />
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
								{item.content}
							</CustomSelectItem>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};
