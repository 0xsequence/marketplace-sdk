import { Text, WarningIcon } from '@0xsequence/design-system';
import SvgInfoIcon from '../../../../icons/InfoIcon';

type AlertMessageProps = {
	message: string;
	type: 'warning' | 'info';
};

export default function AlertMessage({ message, type }: AlertMessageProps) {
	return (
		<div
			className={`flex items-center justify-between gap-3 p-4 rounded-xl ${
				type === 'warning'
					? 'bg-[hsla(39,71%,40%,0.3)]'
					: 'bg-[hsla(247,100%,75%,0.3)]'
			}`}
		>
			<Text className="text-base font-body" color="white" fontWeight="medium">
				{message}
			</Text>

			{type === 'warning' && <WarningIcon size="sm" color="white" />}
			{type === 'info' && <SvgInfoIcon size="sm" color="white" />}
		</div>
	);
}
