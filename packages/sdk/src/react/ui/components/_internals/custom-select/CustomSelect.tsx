import { CheckmarkIcon, ChevronDownIcon } from '@0xsequence/design-system';
import * as Select from '@radix-ui/react-select';
import React, { type ReactNode } from 'react';

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
		<Select.Item
			className="flex text-sm text-text100 rounded-none items-center h-7 p-2 pl-6 relative select-none cursor-pointer hover:bg-background-muted"
			{...props}
			ref={forwardedRef}
		>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className="inline-flex absolute left-1 items-center justify-center">
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
			<Select.Trigger className="inline-flex items-center justify-center rounded-full px-3 text-sm h-7 gap-2 bg-background-secondary text-text100 cursor-pointer border-none mr-1">
				<Select.Value />
				<Select.Icon>
					<ChevronDownIcon size="xs" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="bg-background-raised border-1  backdrop-blur-md border-solid rounded-xl overflow-hidden z-30">
					<Select.Viewport>
						{items.map((item) => (
							<CustomSelectItem
								key={item.value}
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
