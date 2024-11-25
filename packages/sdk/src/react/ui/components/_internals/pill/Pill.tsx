import { Box, Text } from '@0xsequence/design-system';

export default function Pill({ text }: { text: string }) {
	return (
		<Box
			background="backgroundRaised"
			display="flex"
			alignItems="center"
			justifyContent="center"
			paddingY="1"
			paddingX="2"
			borderRadius="sm"
			width="max"
		>
			<Text fontSize="small" fontWeight="medium" color="text80">
				{text}
			</Text>
		</Box>
	);
}
