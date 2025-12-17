'use client';
import {
	Button,
	CalendarIcon,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from '@0xsequence/design-system';
import {
	differenceInDays,
	endOfDay,
	format,
	isSameDay,
	startOfDay,
} from 'date-fns';
import { cn } from '../../../../../ssr';
import Calendar from '../calendar';
import { PRESET_RANGES, type RangeType } from '../expirationDateSelect';
import { TimeSelector } from './TimeSelector';

type CalendarDropdownProps = {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
	onSelectPreset: (range: RangeType) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

/**
 * Determines if the selected date matches a preset range
 */
function getMatchingPreset(selectedDate: Date): RangeType | null {
	const today = startOfDay(new Date());
	const selectedDay = startOfDay(selectedDate);
	const daysDifference = differenceInDays(selectedDay, today);

	// Check if the date matches any preset
	if (isSameDay(selectedDay, today)) {
		return PRESET_RANGES.TODAY.value;
	}
	if (daysDifference === 1) {
		return PRESET_RANGES.TOMORROW.value;
	}
	if (daysDifference === 3) {
		return PRESET_RANGES.IN_3_DAYS.value;
	}
	if (daysDifference === 7) {
		return PRESET_RANGES.ONE_WEEK.value;
	}
	if (daysDifference === 30) {
		return PRESET_RANGES.ONE_MONTH.value;
	}

	return null;
}

export default function CalendarDropdown({
	selectedDate,
	setSelectedDate,
	onSelectPreset,
	isOpen,
	setIsOpen,
}: CalendarDropdownProps) {
	const matchingPreset = getMatchingPreset(selectedDate);

	const handleTimeChange = (hours: number, minutes: number) => {
		const newDate = new Date(selectedDate);
		newDate.setHours(hours, minutes, 0, 0);
		setSelectedDate(newDate);
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn(
						'h-9 flex-1 rounded-sm border-border-normal p-2 font-medium text-xs',
						isOpen && 'border-border-focus outline-1 outline-border-focus',
					)}
					variant="outline"
					shape="square"
					onClick={() => setIsOpen(!isOpen)}
				>
					<CalendarIcon size="xs" />
					{format(selectedDate, 'yyyy/MM/dd HH:mm')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent
					className="pointer-events-auto z-20 w-full rounded-xl border border-border-base bg-surface-neutral p-3"
					sideOffset={5}
				>
					<div className="flex gap-8">
						<div className="flex flex-col">
							{Object.values(PRESET_RANGES).map((preset) => {
								const isActive = matchingPreset === preset.value;
								return (
									<Button
										key={preset.value}
										onClick={() => {
											onSelectPreset(preset.value);
											setIsOpen(false);
										}}
										variant="text"
										className={`w-full justify-start py-1.5 font-bold text-xs transition-colors ${
											isActive
												? 'text-text-100'
												: 'text-text-50 hover:text-text-80'
										}`}
										tabIndex={0}
									>
										{preset.label}
									</Button>
								);
							})}
						</div>

						<div className="flex flex-col">
							<Calendar
								selectedDate={selectedDate}
								setSelectedDate={(date) => {
									const newDate = new Date(date);
									const today = startOfDay(new Date());
									const selectedDay = startOfDay(newDate);

									// If selecting today, set to end of day. Otherwise preserve current time
									if (isSameDay(selectedDay, today)) {
										setSelectedDate(endOfDay(newDate));
									} else {
										newDate.setHours(
											selectedDate.getHours(),
											selectedDate.getMinutes(),
											0,
											0,
										);
										setSelectedDate(newDate);
									}
								}}
								mode="single"
							/>
							<TimeSelector
								selectedDate={selectedDate}
								onTimeChange={handleTimeChange}
							/>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
