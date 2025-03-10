import type { IconProps } from '@0xsequence/design-system';
import type { SVGProps } from 'react';
import { cn } from '../../../utils';
import { iconVariants } from './iconVariants';

const Svg = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="w-16 h-16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="minus-title"
		{...props}
	>
		<title id="minus-title">Minus Icon</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.2303 8.60039L3.4375 8.60039L3.4375 7.40039L13.2303 7.40039V8.60039Z"
			fill="white"
		/>
	</svg>
);

const SvgMinusIcon = ({ className, size = 'sm', ...props }: IconProps) => (
	<Svg
		className={cn(
			iconVariants({
				size,
			}),
			className,
		)}
		{...props}
	/>
);

export default SvgMinusIcon;
