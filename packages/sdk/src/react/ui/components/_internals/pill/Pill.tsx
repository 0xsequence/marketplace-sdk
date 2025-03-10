import { Text } from '@0xsequence/design-system';

export default function Pill({ text }: { text: string }) {
	return (
		<div className="flex bg-background-raised items-center justify-center py-1 px-2 rounded-lg w-max">
			<Text className="text-sm" fontWeight="medium" color="text80">
				{text}
			</Text>
		</div>
	);
}
