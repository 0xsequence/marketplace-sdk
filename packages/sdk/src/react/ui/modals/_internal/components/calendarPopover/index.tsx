'use client';

import './overrides.css';
import { Button } from '@0xsequence/design-system';
import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import SvgCalendarIcon from '../../../../icons/CalendarIcon';
import Calendar from '../calendar';
import { PRESET_RANGES, type RangeType } from '../expirationDateSelect';

type CalendarPopoverProps = {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
	onSelectPreset: (range: RangeType) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export default function CalendarPopover({
	selectedDate,
	setSelectedDate,
	onSelectPreset,
	isOpen,
	setIsOpen,
}: CalendarPopoverProps) {
	return (
		<Root open={isOpen} onOpenChange={setIsOpen}>
			<Trigger asChild>
				<Button
					leftIcon={SvgCalendarIcon}
					className="h-9 flex-1 rounded-sm p-2 font-medium text-xs"
					variant="base"
					label={format(selectedDate, 'dd/MM/yyyy HH:mm')}
					shape="square"
					onClick={() => setIsOpen(!isOpen)}
				/>
			</Trigger>
			<Portal>
				<Content
					className="pointer-events-auto z-20 rounded-xl border border-border-base bg-surface-neutral p-5"
					sideOffset={5}
				>
					<div className="flex gap-8">
						<div className="flex flex-col gap-2">
							{Object.values(PRESET_RANGES).map((preset) => (
								<Button
									key={preset.value}
									onClick={() => {
										onSelectPreset(preset.value);
										setIsOpen(false);
									}}
									variant="text"
									className="w-full justify-start px-3 py-0.5 font-bold text-gray-400 text-xs transition-colors hover:text-gray-200"
								>
									{preset.label}
								</Button>
							))}
						</div>
						<Calendar
							selectedDate={selectedDate}
							setSelectedDate={(date) => {
								setSelectedDate(date);
								setIsOpen(false);
							}}
							mode="single"
						/>
					</div>
				</Content>
			</Portal>
		</Root>
	);
}
