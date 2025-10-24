import { InfoIcon, Text, WarningIcon } from '@0xsequence/design-system';

type AlertMessageProps = {
	message: string;
	type: 'warning' | 'info';
};

export default function AlertMessage({ message, type }: AlertMessageProps) {
	return (
		<div
			className={`flex items-center justify-between gap-3 rounded-xl p-4 ${
				type === 'warning'
					? 'bg-[hsla(39,71%,40%,0.3)]'
					: 'bg-[hsla(247,100%,75%,0.3)]'
			}`}
		>
			<Text className="font-body text-sm" color="white" fontWeight="medium">
				{message}
			</Text>

			{type === 'warning' && <WarningIcon size="sm" color="white" />}
			{type === 'info' && <InfoIcon size="sm" color="white" />}
		</div>
	);
}
