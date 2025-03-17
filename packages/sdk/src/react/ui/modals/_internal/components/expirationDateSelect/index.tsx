import { Skeleton, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { addDays } from 'date-fns';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import CalendarDropdown from '../calendarDropdown';

const setToEndOfDay = (date: Date): Date => {
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);
	return endOfDay;
};

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
	$date: Observable<Date>;
};

const ExpirationDateSelect: ({
	className,
	$date,
}: ExpirationDateSelectProps) => JSX.Element = observer(
	function ExpirationDateSelect({
		className,
		$date,
	}: ExpirationDateSelectProps): JSX.Element {
		const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);

		function handleSelectPresetRange(range: RangeType) {
			const presetRange = Object.values(PRESET_RANGES).find(
				(preset) => preset.value === range,
			);

			if (!presetRange) {
				return;
			}

			const baseDate = new Date();
			const newDate =
				presetRange.value === 'today'
					? setToEndOfDay(baseDate)
					: addDays(baseDate, presetRange.offset);

			$date.set(newDate);
		}

		function handleDateValueChange(date: Date) {
			$date.set(date);
		}

		if (!$date.get()) {
			return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
		}

		return (
			<div className="relative w-full">
				<Text
					className="w-full text-left font-body font-medium text-xs"
					fontWeight={'medium'}
					color={'text100'}
				>
					Set expiry
				</Text>
				<div
					className={`${className} mt-0.5 flex w-full items-center gap-2 rounded-sm border border-border-base`}
				>
					<CalendarDropdown
						selectedDate={$date.get()}
						setSelectedDate={handleDateValueChange}
						onSelectPreset={handleSelectPresetRange}
						isOpen={calendarDropdownOpen}
						setIsOpen={setCalendarDropdownOpen}
					/>
				</div>
			</div>
		);
	},
);

export default ExpirationDateSelect;
