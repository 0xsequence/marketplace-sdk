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
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M13.2303 8.60039L3.4375 8.60039L3.4375 7.40039L13.2303 7.40039V8.60039Z"
			fill="white"
		/>
	</svg>
);

const SvgMinusIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgMinusIcon;
