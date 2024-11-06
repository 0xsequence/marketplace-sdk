import { iconVariants } from './styles.css';
import { Box, type IconProps } from '@0xsequence/design-system';

const Svg = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M8.65039 6.03638L9.28679 5.39999L5.96859 2.08179L2.65039 5.39999L3.28679 6.03638L5.51859 3.80458V9.91822H6.41859V3.80458L8.65039 6.03638Z"
			fill="#D1D1D1"
		/>
	</svg>
);

const SvgArrowUpIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgArrowUpIcon;
