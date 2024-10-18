import { Box, type IconProps } from '@0xsequence/design-system';
import { iconVariants } from './styles.css';

const Svg = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M8.65529 7.45725V2.40039H7.45529V7.45724H2.39844V8.65725H7.45529V13.7141H8.65529V8.65725H13.7121V7.45725H8.65529Z"
			fill="white"
		/>
	</svg>
);

const SvgPlusIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgPlusIcon;
