import { Box, type IconProps } from '@0xsequence/design-system';
import { iconVariants } from './styles.css';

const Svg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="positive-circle-title"
	>
		<title id="positive-circle-title">Positive Circle Icon</title>
		<path
			d="M21.6004 11.9999C21.6004 17.3018 17.3023 21.5999 12.0004 21.5999C6.69846 21.5999 2.40039 17.3018 2.40039 11.9999C2.40039 6.69797 6.69846 2.3999 12.0004 2.3999C17.3023 2.3999 21.6004 6.69797 21.6004 11.9999Z"
			fill="#14A554"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M16.5798 7.79868L10.8701 16.7999L7.20039 12.6764L8.03544 11.9332L10.7199 14.9497L15.6359 7.1999L16.5798 7.79868Z"
			fill="white"
		/>
	</svg>
);

const SvgPositiveCircleIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgPositiveCircleIcon;
