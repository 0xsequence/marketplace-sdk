'use client';

import {
	Button,
	ChevronDownIcon,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	Text,
} from '@0xsequence/design-system';
import { type ReactNode, useState } from 'react';

export interface SelectItem {
	value: string;
	content: ReactNode;
	disabled?: boolean;
}

interface CustomSelectProps {
	items: SelectItem[];
	onValueChange?: (value: string) => void;
	defaultValue?: SelectItem;
	placeholder?: string;
	disabled?: boolean;
	backgroundColor?: string;
	className?: string;
	testId?: string;
}

export const CustomSelect = ({
	items,
	onValueChange,
	defaultValue,
	placeholder = 'Select an option',
	disabled = false,
	className,
	testId = 'custom-select',
}: CustomSelectProps) => {
	const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(
		defaultValue,
	);

	const handleValueChange = (item: SelectItem) => {
		setSelectedItem(item);
		onValueChange?.(item.value);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={disabled}>
				<Button
					size="xs"
					shape="circle"
					className={`py-1.5 pl-3 hover:bg-overlay-light ${className || ''}`}
					data-testid={`${testId}-trigger`}
				>
					<div className="flex items-center justify-center gap-1 truncate pr-3">
						<Text variant="xsmall" color="text100" fontWeight="bold">
							{selectedItem ? selectedItem.content : placeholder}
						</Text>

						<ChevronDownIcon size="xs" />
					</div>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent
					align="end"
					side="bottom"
					sideOffset={8}
					className="z-[1000] overflow-hidden rounded-xl border border-border-base bg-color-overlay-glass shadow-lg backdrop-blur-md"
					data-testid={`${testId}-content`}
				>
					<div className="max-h-[240px] overflow-auto">
						{items.map((item) => (
							<DropdownMenuCheckboxItem
								key={item.value}
								checked={selectedItem?.value === item.value}
								onCheckedChange={() => handleValueChange(item)}
								disabled={item.disabled}
								className="group relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-background-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>span[data-state='checked']]:hidden"
								data-testid={`${testId}-option-${item.value}`}
							>
								<div className="flex w-full items-center justify-between">
									<div className="flex items-center gap-2 truncate">
										{typeof item.content === 'string' ? (
											<Text
												variant="small"
												color={
													selectedItem?.value === item.value
														? 'text100'
														: 'text80'
												}
												className={`truncate ${
													selectedItem?.value === item.value ? 'font-bold' : ''
												}`}
												data-testid={`${testId}-option-text-${item.value}`}
											>
												{item.content}
											</Text>
										) : (
											<div
												className="truncate"
												data-testid={`${testId}-option-content-${item.value}`}
											>
												{item.content}
											</div>
										)}
									</div>
								</div>
							</DropdownMenuCheckboxItem>
						))}
					</div>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};
