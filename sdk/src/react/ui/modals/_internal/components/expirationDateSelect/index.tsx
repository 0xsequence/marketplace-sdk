'use client';

import { Skeleton, Text } from '@0xsequence/design-system';
import { addDays, endOfDay } from 'date-fns';
import { useState } from 'react';
import { cn } from '../../../../../../utils';
import CalendarDropdown from '../calendarDropdown';

export const PRESET_RANGES = {
	TODAY: {
		label: 'Today',
		value: 'today',
		offset: 0,
	},
	TOMORROW: {
		label: 'Tomorrow',
		value: 'tomorrow',
		offset: 1,
	},
	IN_3_DAYS: {
		label: 'In 3 days',
		value: '3_days',
		offset: 3,
	},
	ONE_WEEK: {
		label: '1 week',
		value: '1_week',
		offset: 7,
	},
	ONE_MONTH: {
		label: '1 month',
		value: '1_month',
		offset: 30,
	},
} as const;

export type RangeType =
	(typeof PRESET_RANGES)[keyof typeof PRESET_RANGES]['value'];

type ExpirationDateSelectProps = {
	className?: string;
	date: Date;
	onDateChange: (date: Date) => void;
	disabled?: boolean;
};

const ExpirationDateSelect = function ExpirationDateSelect({
	className,
	date,
	onDateChange,
	disabled,
}: ExpirationDateSelectProps) {
	const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);

	function handleSelectPresetRange(range: RangeType) {
		const presetRange = Object.values(PRESET_RANGES).find(
			(preset) => preset.value === range,
		);

		if (!presetRange) {
			return;
		}

		const baseDate = new Date();
		const targetDate =
			presetRange.value === 'today'
				? baseDate
				: addDays(baseDate, presetRange.offset);

		// For "today", set to end of day. For other presets, preserve current time
		const newDate =
			presetRange.value === 'today'
				? endOfDay(targetDate)
				: (() => {
						const preservedTimeDate = new Date(targetDate);
						preservedTimeDate.setHours(
							date.getHours(),
							date.getMinutes(),
							date.getSeconds(),
							date.getMilliseconds(),
						);
						return preservedTimeDate;
					})();

		onDateChange(newDate);
	}

	function handleDateValueChange(date: Date) {
		onDateChange(date);
	}

	if (!date) {
		return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
	}

	return (
		<div
			className={cn(
				'relative w-full',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<Text
				className="w-full text-left font-body font-medium text-xs"
				fontWeight={'medium'}
				color={'text100'}
			>
				Set expiry
			</Text>
			<div
				className={`${className} flex w-full items-center gap-2 rounded-sm bg-zinc-950`}
			>
				<CalendarDropdown
					selectedDate={date}
					setSelectedDate={handleDateValueChange}
					onSelectPreset={handleSelectPresetRange}
					isOpen={calendarDropdownOpen}
					setIsOpen={setCalendarDropdownOpen}
				/>
			</div>
		</div>
	);
};

export default ExpirationDateSelect;
