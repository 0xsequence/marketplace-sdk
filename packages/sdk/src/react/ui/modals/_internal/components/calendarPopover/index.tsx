'use client';

import './overrides.css';
import { Button } from '@0xsequence/design-system';
import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import SvgCalendarIcon from '../../../../icons/CalendarIcon';
import Calendar from '../calendar';
import { dateSelectButton, dateSelectPopoverContent } from './styles.css';

type CalendarPopoverProps = {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
};

export default function CalendarPopover({
	selectedDate,
	setSelectedDate,
}: CalendarPopoverProps) {
	return (
		<Root>
			<Trigger asChild>
				<Button
					leftIcon={SvgCalendarIcon}
					className={dateSelectButton}
					variant="ghost"
					label={format(selectedDate, 'dd/MM/yyyy HH:mm')}
					shape="square"
				/>
			</Trigger>
			<Portal>
				<Content className={dateSelectPopoverContent} sideOffset={5}>
					<Calendar
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						mode="single"
					/>
				</Content>
			</Portal>
		</Root>
	);
}
