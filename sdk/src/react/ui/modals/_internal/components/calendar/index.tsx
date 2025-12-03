'use client';

import { DayPicker, type PropsSingle } from 'react-day-picker';

export type CalendarProps = React.PropsWithChildren<PropsSingle> & {
	selectedDate?: Date;
	setSelectedDate?: (date: Date) => void;
};

function Calendar({ ...props }: CalendarProps) {
	const { selectedDate, setSelectedDate } = props;

	return (
		<DayPicker
			disabled={{
				before: new Date(),
			}}
			selected={selectedDate as unknown as Date}
			onDayClick={setSelectedDate}
			defaultMonth={selectedDate}
			modifiersStyles={{
				selected: {
					color: 'hsl(var(--foreground))',
					background: 'hsl(var(--primary))',
					border: 'none',
				},
			}}
			styles={{
				root: {
					width: 'max-content',
					margin: 0,
					color: 'hsl(var(--foreground))',
					background: 'hsl(var(--background))',
					border: '1px solid hsl(var(--border))',
					borderRadius: 'var(--radius)',
					padding: '0.5rem',
					position: 'relative',
				},
				day: {
					margin: 0,
					width: '1rem',
					height: '1rem',
				},
				day_button: {
					margin: 0,
					width: '1.8rem',
					height: '1.5rem',
					padding: 0,
					border: 'none',
				},
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export default Calendar;
