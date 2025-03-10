import type { IconProps } from '@0xsequence/design-system';
import { iconVariants } from './styles.css';

const Svg = () => (
	<svg
		className="w-20 h-20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label="Inventory"
	>
		<title>Inventory icon</title>
		<path
			d="M2 4C2 2.89543 2.85961 2 3.92 2H6.48C7.54039 2 8.4 2.89543 8.4 4V6.66667C8.4 7.77124 7.54039 8.66667 6.48 8.66667H3.92C2.85961 8.66667 2 7.77124 2 6.66667V4Z"
			fill="white"
		/>
		<path
			d="M11.6 4C11.6 2.89543 12.4596 2 13.52 2H16.08C17.1404 2 18 2.89543 18 4V6.66667C18 7.77124 17.1404 8.66667 16.08 8.66667H13.52C12.4596 8.66667 11.6 7.77124 11.6 6.66667V4Z"
			fill="white"
		/>
		<path
			d="M2 13.3333C2 12.2288 2.85961 11.3333 3.92 11.3333H6.48C7.54039 11.3333 8.4 12.2288 8.4 13.3333V16C8.4 17.1046 7.54039 18 6.48 18H3.92C2.85961 18 2 17.1046 2 16V13.3333Z"
			fill="white"
		/>
		<path
			d="M11.6 13.3333C11.6 12.2288 12.4596 11.3333 13.52 11.3333H16.08C17.1404 11.3333 18 12.2288 18 13.3333V16C18 17.1046 17.1404 18 16.08 18H13.52C12.4596 18 11.6 17.1046 11.6 16V13.3333Z"
			fill="white"
		/>
	</svg>
);

const SvgInventoryIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Svg
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgInventoryIcon;
