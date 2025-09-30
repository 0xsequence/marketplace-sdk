'use client';

import { NumericInput, Text } from '@0xsequence/design-system';
import { isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';

export function TimeSelector({
	selectedDate,
	onTimeChange,
}: {
	selectedDate: Date;
	onTimeChange: (hours: number, minutes: number) => void;
}) {
	const now = new Date();
	const isToday = isSameDay(selectedDate, now);
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();

	const isTimeInPast = (hours: number, minutes: number): boolean => {
		if (!isToday) return false;
		return (
			hours < currentHour || (hours === currentHour && minutes < currentMinute)
		);
	};
	const [hours, setHours] = useState(selectedDate.getHours().toString());
	const [minutes, setMinutes] = useState(
		selectedDate.getMinutes().toString().padStart(2, '0'),
	);

	useEffect(() => {
		setHours(selectedDate.getHours().toString());
		setMinutes(selectedDate.getMinutes().toString().padStart(2, '0'));
	}, [selectedDate]);

	const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value === '') {
			setHours('');
			return;
		}

		const numValue = Number.parseInt(value, 10);

		if (!Number.isNaN(numValue)) {
			const clampedValue = Math.max(0, Math.min(23, numValue));
			const clampedString = clampedValue.toString();
			setHours(clampedString);

			const currentMinutes = Number.parseInt(minutes, 10) || 0;
			onTimeChange(clampedValue, currentMinutes);
		}
	};

	const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value === '') {
			setMinutes('');
			return;
		}

		const numValue = Number.parseInt(value, 10);

		if (!Number.isNaN(numValue)) {
			const clampedValue = Math.max(0, Math.min(59, numValue));
			const clampedString = clampedValue.toString().padStart(2, '0');
			setMinutes(clampedString);

			const currentHours = Number.parseInt(hours, 10) || 0;
			onTimeChange(currentHours, clampedValue);
		}
	};

	const handleHoursBlur = () => {
		let finalHour: number;
		let finalMinutes: number;

		if (hours === '' || Number.isNaN(Number.parseInt(hours, 10))) {
			finalHour = isToday ? currentHour : 0;
			setHours(finalHour.toString());
		} else {
			finalHour = Number.parseInt(hours, 10);
		}

		finalMinutes = Number.parseInt(minutes, 10) || 0;

		if (isToday && isTimeInPast(finalHour, finalMinutes)) {
			finalHour = currentHour;
			setHours(finalHour.toString());

			if (finalMinutes < currentMinute) {
				finalMinutes = currentMinute;
				const currentMinuteString = currentMinute.toString().padStart(2, '0');
				setMinutes(currentMinuteString);
			}
		}

		onTimeChange(finalHour, finalMinutes);
	};

	const handleMinutesBlur = () => {
		let finalHour: number;
		let finalMinutes: number;

		finalHour = Number.parseInt(hours, 10) || 0;

		if (minutes === '' || Number.isNaN(Number.parseInt(minutes, 10))) {
			finalMinutes = isToday && finalHour === currentHour ? currentMinute : 0;
			const defaultMinuteString = finalMinutes.toString().padStart(2, '0');
			setMinutes(defaultMinuteString);
		} else {
			finalMinutes = Number.parseInt(minutes, 10);
		}

		if (isToday && isTimeInPast(finalHour, finalMinutes)) {
			finalMinutes = currentMinute;
			const currentMinuteString = finalMinutes.toString().padStart(2, '0');
			setMinutes(currentMinuteString);
		}

		onTimeChange(finalHour, finalMinutes);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: 'hours' | 'minutes',
	) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (field === 'hours') {
				const minutesInput = document.querySelector(
					'input[name="minutes"]',
				) as HTMLInputElement;
				minutesInput?.focus();
			} else {
				(e.target as HTMLInputElement).blur();
			}
		}
		else if (e.key === 'Escape') {
			e.preventDefault();
			(e.target as HTMLInputElement).blur();
		}
	};

	return (
		<div className="mt-3 flex flex-col gap-2 border-border-base border-t pt-3">
			<div className="flex items-center justify-between gap-2">
				<div className="w-16 [&>label]:w-16">
					<NumericInput
						className="h-9 [&>input]:text-xs"
						name="hours"
						value={hours}
						onChange={handleHoursChange}
						onBlur={handleHoursBlur}
						onKeyDown={(e) => handleKeyDown(e, 'hours')}
						min={0}
						max={23}
						tabIndex={0}
					/>
				</div>

				<Text className="font-medium text-sm text-text-80">:</Text>

				<div className="w-16 [&>label]:w-16">
					<NumericInput
						className="h-9 [&>input]:text-xs"
						name="minutes"
						value={minutes}
						onChange={handleMinutesChange}
						onBlur={handleMinutesBlur}
						onKeyDown={(e) => handleKeyDown(e, 'minutes')}
						min={0}
						max={59}
						tabIndex={0}
					/>
				</div>
			</div>
		</div>
	);
}
