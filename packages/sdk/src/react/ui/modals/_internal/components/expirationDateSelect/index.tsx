import { useState } from 'react';

import { Box, Skeleton, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { addDays, isSameDay } from 'date-fns';
import { CustomSelect } from '../../../../components/_internals/custom-select/CustomSelect';
import CalendarPopover from '../calendarPopover';

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

export type rangeType =
	(typeof PRESET_RANGES)[keyof typeof PRESET_RANGES]['value'];

type ExpirationDateSelectProps = {
	className?: string;
	$date: Observable<Date>;
};

const ExpirationDateSelect = observer(function ExpirationDateSelect({
	className,
	$date,
}: ExpirationDateSelectProps) {
	const defaultRange = '1_week';
	const [range, setRange] = useState<rangeType>(defaultRange);
	function handleSelectPresetRange(range: rangeType) {
		setRange(range);

		const presetRange = Object.values(PRESET_RANGES).find(
			(preset) => preset.value === range,
		);

		if (!presetRange) {
			return;
		}

		const newDate = addDays(new Date(), presetRange.offset);

		$date.set(newDate);
	}

	function handleDateValueChange(date: Date) {
		const presetRange = Object.values(PRESET_RANGES).find((preset) =>
			isSameDay(new Date(date), addDays(new Date(), preset.offset)),
		);

		if (presetRange) {
			setRange(presetRange.value);
		}

		$date.set(date);
	}

	if (!$date.get()) {
		return <Skeleton borderRadius="lg" width="20" height="7" marginRight="3" />;
	}

	return (
		<Box width="full" position="relative">
			<Text
				fontSize={'small'}
				fontWeight={'medium'}
				textAlign={'left'}
				width={'full'}
				color={'text100'}
				fontFamily="body"
			>
				Set expiry
			</Text>

			<Box
				className={className}
				width={'full'}
				display={'flex'}
				alignItems={'center'}
				gap={'2'}
				marginTop={'0.5'}
			>
				<Box
					position={'absolute'}
					right={'0'}
					onClick={(e) => e.stopPropagation()}
					zIndex="10"
				>
					<CustomSelect
						items={Object.values(PRESET_RANGES).map((preset) => ({
							label: preset.label,
							value: preset.value,
						}))}
						value={range}
						onValueChange={(value) =>
							handleSelectPresetRange(value as rangeType)
						}
						defaultValue={defaultRange}
					/>
				</Box>

				<CalendarPopover
					selectedDate={$date.get()}
					setSelectedDate={(date) => handleDateValueChange(date)}
				/>
			</Box>
		</Box>
	);
});

export default ExpirationDateSelect;
