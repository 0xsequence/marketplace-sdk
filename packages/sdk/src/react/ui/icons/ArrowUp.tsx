import type { IconProps } from '@0xsequence/design-system';
import type { SVGProps } from 'react';
import { cn } from '../../../utils';
import { iconVariants } from './iconVariants';

const Svg = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="w-12 h-12"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label="Arrow up"
		{...props}
	>
		<title>Arrow up icon</title>
		<path
			d="M8.65039 6.03638L9.28679 5.39999L5.96859 2.08179L2.65039 5.39999L3.28679 6.03638L5.51859 3.80458V9.91822H6.41859V3.80458L8.65039 6.03638Z"
			fill="#D1D1D1"
		/>
	</svg>
);

const SvgArrowUpIcon = ({ className, size = 'sm', ...props }: IconProps) => (
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

export default SvgArrowUpIcon;
