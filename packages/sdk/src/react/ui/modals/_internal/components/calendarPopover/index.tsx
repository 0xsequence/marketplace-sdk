'use client';

import './overrides.css';
import { Button } from '@0xsequence/design-system';
import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import SvgCalendarIcon from '../../../../icons/CalendarIcon';
import Calendar from '../calendar';

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
					className="h-[36px_!important] flex-[3_!important] rounded-[4px_!important] border-[1px_solid_#4F4F4F_!important] p-[10px_8px_!important] font-[400_!important] text-[12px_!important]"
					variant="ghost"
					label={format(selectedDate, 'dd/MM/yyyy HH:mm')}
					shape="square"
				/>
			</Trigger>
			<Portal>
				<Content
					className="pointer-events-auto z-20 rounded-lg bg-background-raised backdrop-blur-md"
					sideOffset={5}
				>
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
