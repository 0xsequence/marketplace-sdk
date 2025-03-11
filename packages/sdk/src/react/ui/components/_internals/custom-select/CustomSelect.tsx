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
			className="relative flex h-7 cursor-pointer select-none items-center rounded-none p-2 pl-6 text-sm text-text100 hover:bg-background-muted"
			{...props}
			ref={forwardedRef}
		>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className="absolute left-1 inline-flex items-center justify-center">
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
			<Select.Trigger className="mr-1 inline-flex h-7 cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-background-secondary px-3 text-sm text-text100">
				<Select.Value />
				<Select.Icon>
					<ChevronDownIcon size="xs" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="z-30 overflow-hidden rounded-xl border-1 border-solid bg-background-raised backdrop-blur-md">
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
