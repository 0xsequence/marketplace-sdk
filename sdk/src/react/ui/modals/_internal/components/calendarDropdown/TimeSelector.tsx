'use client';

import { NumericInput, Text, TimeIcon } from '@0xsequence/design-system';
import { getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import { useRef, useState } from 'react';
import { clamp } from '../../../../../_internal/utils';

interface TimeSelectorProps {
	selectedDate: Date;
	onTimeChange: (hours: number, minutes: number) => void;
}

export function TimeSelector({
	selectedDate,
	onTimeChange,
}: TimeSelectorProps) {
	const minutesRef = useRef<HTMLInputElement>(null);
	const [draft, setDraft] = useState<{ hours: string; minutes: string } | null>(
		null,
	);

	const currentHours = getHours(selectedDate);
	const currentMinutes = getMinutes(selectedDate);

	const commitChange = () => {
		if (!draft) return;

		const now = new Date();
		const parse = (val: string, fallback: number) => {
			const n = Number.parseInt(val, 10);
			return Number.isNaN(n) ? fallback : n;
		};

		let h = clamp(parse(draft.hours, currentHours), 0, 23);
		let m = clamp(parse(draft.minutes, currentMinutes), 0, 59);

		const newDate = setMinutes(setHours(selectedDate, h), m);

		if (newDate < now) {
			h = getHours(now);
			m = getMinutes(now);
		}

		onTimeChange(h, m);
		setDraft(null);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: 'hours' | 'minutes',
	) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (field === 'hours') {
				minutesRef.current?.focus();
			} else {
				commitChange();
			}
		} else if (e.key === 'Escape') {
			e.preventDefault();
			setDraft(null);
			e.currentTarget.blur();
		}
	};

	const hours = draft?.hours ?? currentHours.toString().padStart(2, '0');
	const minutes = draft?.minutes ?? currentMinutes.toString().padStart(2, '0');

	return (
		<div className="mt-3 flex items-center gap-6 border-border-base border-t pt-3">
			<TimeIcon color="white" size="xs" />

			<div className="flex flex-1 items-center justify-between gap-2">
				<div className="w-16 [&>label]:w-16">
					<NumericInput
						className="h-9 [&>input]:text-xs"
						name="hours"
						value={hours}
						onChange={(e) => setDraft({ hours: e.target.value, minutes })}
						onBlur={commitChange}
						onKeyDown={(e) => handleKeyDown(e, 'hours')}
						min={0}
						max={23}
						tabIndex={0}
					/>
				</div>
				<Text className="font-medium text-sm text-text-80">:</Text>
				<div className="w-16 [&>label]:w-16">
					<NumericInput
						ref={minutesRef}
						className="h-9 [&>input]:text-xs"
						name="minutes"
						value={minutes}
						onChange={(e) => setDraft({ hours, minutes: e.target.value })}
						onBlur={commitChange}
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
