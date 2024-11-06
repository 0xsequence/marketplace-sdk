import { Box, type IconProps } from '@0xsequence/design-system';
import { iconVariants } from './styles.css';

const Svg = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M10.75 8.75V13.75H9.25V8.75H10.75Z" fill="white" />
		<path
			d="M9.37508 7.47656C9.55997 7.65885 9.78263 7.75 10.043 7.75C10.2097 7.75 10.3634 7.70833 10.504 7.625C10.6446 7.53906 10.7579 7.42578 10.8438 7.28516C10.9324 7.14193 10.9779 6.98438 10.9805 6.8125C10.9779 6.55729 10.8829 6.33854 10.6954 6.15625C10.5079 5.97396 10.2904 5.88281 10.043 5.88281C9.78263 5.88281 9.55997 5.97396 9.37508 6.15625C9.19279 6.33854 9.10294 6.55729 9.10555 6.8125C9.10294 7.07031 9.19279 7.29167 9.37508 7.47656Z"
			fill="white"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5Z"
			fill="white"
		/>
	</svg>
);

const SvgInfoIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgInfoIcon;
