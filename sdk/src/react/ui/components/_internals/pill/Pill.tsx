import { Text } from '@0xsequence/design-system';

export default function Pill({ text }: { text: string }) {
	return (
		<div className="flex w-max items-center justify-center rounded-lg bg-background-raised px-2 py-1">
			<Text className="text-sm" fontWeight="medium" color="text80">
				{text}
			</Text>
		</div>
	);
}
