import { Box, Text, WarningIcon } from '@0xsequence/design-system';
import SvgInfoIcon from '../../../../icons/InfoIcon';
import { alertMessageBox, alertMessageBoxVariants } from './styles.css';

type AlertMessageProps = {
	message: string;
	type: 'warning' | 'info';
};

export default function AlertMessage({ message, type }: AlertMessageProps) {
	return (
		<Box className={`${alertMessageBox} ${alertMessageBoxVariants[type]}`}>
			<Text
				color="white"
				fontSize="normal"
				fontWeight="medium"
				fontFamily="body"
			>
				{message}
			</Text>

			{type === 'warning' && <WarningIcon size="sm" color="white" />}
			{type === 'info' && <SvgInfoIcon size="sm" color="white" />}
		</Box>
	);
}
