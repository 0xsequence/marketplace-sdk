import type { IconProps } from '@0xsequence/design-system';
import type { SVGProps } from 'react';
import { cn } from '../../../utils';
import { iconVariants } from './iconVariants';

const Svg = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="w-16 h-12"
		viewBox="0 0 16 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="diamond-eye-title"
		{...props}
	>
		<title id="diamond-eye-title">Diamond Eye Icon</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.00447 0.108826L0.611084 4.50526L7.99997 11.8911L15.3889 4.50526L10.9955 0.108826H5.00447ZM4.60507 2.90461C6.4718 1.0297 9.52815 1.02968 11.3949 2.90459L12.9925 4.50223L11.3949 6.09983C9.52815 7.97473 6.4718 7.97473 4.60507 6.09985L3.00749 4.50223L4.60507 2.90461ZM5.70321 4.50209C5.70321 5.77095 6.73193 6.79865 7.99974 6.79865C9.2676 6.79865 10.2963 5.77095 10.2963 4.50209C10.2963 3.23322 9.2676 2.20553 7.99974 2.20553C6.73193 2.20553 5.70321 3.23322 5.70321 4.50209ZM7.99974 5.50058C7.44853 5.50058 7.00125 5.05377 7.00125 4.50209C7.00125 3.9504 7.44853 3.50359 7.99974 3.50359C8.55095 3.50359 8.99825 3.9504 8.99825 4.50209C8.99825 5.05377 8.55095 5.50058 7.99974 5.50058Z"
			fill="white"
		/>
	</svg>
);

const SvgDiamondEyeIcon = ({ className, size = 'sm', ...props }: IconProps) => (
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

export default SvgDiamondEyeIcon;
