import { Text, WarningIcon } from '@0xsequence/design-system';
import SvgInfoIcon from '../../../../icons/InfoIcon';
import { alertMessageBox, alertMessageBoxVariants } from './styles.css';

type AlertMessageProps = {
	message: string;
	type: 'warning' | 'info';
};

export default function AlertMessage({ message, type }: AlertMessageProps) {
	return (
		<div className={`${alertMessageBox} ${alertMessageBoxVariants[type]}`}>
			<Text className="text-base font-body" color="white" fontWeight="medium">
				{message}
			</Text>
			{type === 'warning' && <WarningIcon className="text-white" size="sm" />}
			{type === 'info' && <SvgInfoIcon className="text-white" size="sm" />}
		</div>
	);
}
