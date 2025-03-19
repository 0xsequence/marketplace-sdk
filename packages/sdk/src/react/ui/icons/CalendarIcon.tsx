'use client';

import { Box, type IconProps } from '@0xsequence/design-system';
import { iconVariants } from './styles.css';

const Svg = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label="Calendar icon"
	>
		<title>Calendar icon</title>
		<path
			d="M4.57634 17.5C3.73146 17.5 3.08946 17.2816 2.65034 16.8449C2.21678 16.4081 2 15.7586 2 14.8965V5.10352C2 4.24135 2.21678 3.59189 2.65034 3.15513C3.08946 2.71838 3.73146 2.5 4.57634 2.5H15.4237C16.2741 2.5 16.9161 2.72121 17.3497 3.16364C17.7832 3.6004 18 4.24702 18 5.10352V14.8965C18 15.753 17.7832 16.3996 17.3497 16.8364C16.9161 17.2788 16.2741 17.5 15.4237 17.5H4.57634ZM4.55133 15.9515H15.4403C15.7738 15.9515 16.0295 15.8636 16.2074 15.6877C16.3908 15.5062 16.4825 15.2396 16.4825 14.888V7.44328C16.4825 7.08593 16.3908 6.81934 16.2074 6.64351C16.0295 6.46767 15.7738 6.37975 15.4403 6.37975H4.55133C4.21782 6.37975 3.96213 6.46767 3.78426 6.64351C3.61195 6.81934 3.52579 7.08593 3.52579 7.44328V14.888C3.52579 15.2396 3.61195 15.5062 3.78426 15.6877C3.96213 15.8636 4.21782 15.9515 4.55133 15.9515ZM8.48671 9.17896C8.34775 9.17896 8.25048 9.15343 8.19489 9.10238C8.13931 9.05133 8.11152 8.95207 8.11152 8.80459V8.33664C8.11152 8.19484 8.13931 8.09841 8.19489 8.04736C8.25048 7.99064 8.34775 7.96228 8.48671 7.96228H8.94528C9.0898 7.96228 9.18708 7.99064 9.2371 8.04736C9.29269 8.09841 9.32048 8.19484 9.32048 8.33664V8.80459C9.32048 8.95207 9.29269 9.05133 9.2371 9.10238C9.18708 9.15343 9.0898 9.17896 8.94528 9.17896H8.48671ZM11.0714 9.17896C10.9269 9.17896 10.8268 9.15343 10.7712 9.10238C10.7212 9.05133 10.6962 8.95207 10.6962 8.80459V8.33664C10.6962 8.19484 10.7212 8.09841 10.7712 8.04736C10.8268 7.99064 10.9269 7.96228 11.0714 7.96228H11.5383C11.6773 7.96228 11.7745 7.99064 11.8301 8.04736C11.8857 8.09841 11.9135 8.19484 11.9135 8.33664V8.80459C11.9135 8.95207 11.8857 9.05133 11.8301 9.10238C11.7745 9.15343 11.6773 9.17896 11.5383 9.17896H11.0714ZM13.6477 9.17896C13.5088 9.17896 13.4115 9.15343 13.3559 9.10238C13.3003 9.05133 13.2725 8.95207 13.2725 8.80459V8.33664C13.2725 8.19484 13.3003 8.09841 13.3559 8.04736C13.4115 7.99064 13.5088 7.96228 13.6477 7.96228H14.1146C14.2592 7.96228 14.3564 7.99064 14.4065 8.04736C14.462 8.09841 14.4898 8.19484 14.4898 8.33664V8.80459C14.4898 8.95207 14.462 9.05133 14.4065 9.10238C14.3564 9.15343 14.2592 9.17896 14.1146 9.17896H13.6477ZM5.90203 11.7825C5.75751 11.7825 5.65746 11.7541 5.60188 11.6974C5.55185 11.6407 5.52684 11.5442 5.52684 11.4081V10.9317C5.52684 10.7842 5.55185 10.6849 5.60188 10.6339C5.65746 10.5828 5.75751 10.5573 5.90203 10.5573H6.36894C6.5079 10.5573 6.60518 10.5828 6.66076 10.6339C6.71635 10.6849 6.74414 10.7842 6.74414 10.9317V11.4081C6.74414 11.5442 6.71635 11.6407 6.66076 11.6974C6.60518 11.7541 6.5079 11.7825 6.36894 11.7825H5.90203ZM8.48671 11.7825C8.34775 11.7825 8.25048 11.7541 8.19489 11.6974C8.13931 11.6407 8.11152 11.5442 8.11152 11.4081V10.9317C8.11152 10.7842 8.13931 10.6849 8.19489 10.6339C8.25048 10.5828 8.34775 10.5573 8.48671 10.5573H8.94528C9.0898 10.5573 9.18708 10.5828 9.2371 10.6339C9.29269 10.6849 9.32048 10.7842 9.32048 10.9317V11.4081C9.32048 11.5442 9.29269 11.6407 9.2371 11.6974C9.18708 11.7541 9.0898 11.7825 8.94528 11.7825H8.48671ZM11.0714 11.7825C10.9269 11.7825 10.8268 11.7541 10.7712 11.6974C10.7212 11.6407 10.6962 11.5442 10.6962 11.4081V10.9317C10.6962 10.7842 10.7212 10.6849 10.7712 10.6339C10.8268 10.5828 10.9269 10.5573 11.0714 10.5573H11.5383C11.6773 10.5573 11.7745 10.5828 11.8301 10.6339C11.8857 10.6849 11.9135 10.7842 11.9135 10.9317V11.4081C11.9135 11.5442 11.8857 11.6407 11.8301 11.6974C11.7745 11.7541 11.6773 11.7825 11.5383 11.7825H11.0714ZM13.6477 11.7825C13.5088 11.7825 13.4115 11.7541 13.3559 11.6974C13.3003 11.6407 13.2725 11.5442 13.2725 11.4081V10.9317C13.2725 10.7842 13.3003 10.6849 13.3559 10.6339C13.4115 10.5828 13.5088 10.5573 13.6477 10.5573H14.1146C14.2592 10.5573 14.3564 10.5828 14.4065 10.6339C14.462 10.6849 14.4898 10.7842 14.4898 10.9317V11.4081C14.4898 11.5442 14.462 11.6407 14.4065 11.6974C14.3564 11.7541 14.2592 11.7825 14.1146 11.7825H13.6477ZM5.90203 14.369C5.75751 14.369 5.65746 14.3434 5.60188 14.2924C5.55185 14.2414 5.52684 14.1421 5.52684 13.9946V13.5267C5.52684 13.3849 5.55185 13.2884 5.60188 13.2374C5.65746 13.1807 5.75751 13.1523 5.90203 13.1523H6.36894C6.5079 13.1523 6.60518 13.1807 6.66076 13.2374C6.71635 13.2884 6.74414 13.3849 6.74414 13.5267V13.9946C6.74414 14.1421 6.71635 14.2414 6.66076 14.2924C6.60518 14.3434 6.5079 14.369 6.36894 14.369H5.90203ZM8.48671 14.369C8.34775 14.369 8.25048 14.3434 8.19489 14.2924C8.13931 14.2414 8.11152 14.1421 8.11152 13.9946V13.5267C8.11152 13.3849 8.13931 13.2884 8.19489 13.2374C8.25048 13.1807 8.34775 13.1523 8.48671 13.1523H8.94528C9.0898 13.1523 9.18708 13.1807 9.2371 13.2374C9.29269 13.2884 9.32048 13.3849 9.32048 13.5267V13.9946C9.32048 14.1421 9.29269 14.2414 9.2371 14.2924C9.18708 14.3434 9.0898 14.369 8.94528 14.369H8.48671ZM11.0714 14.369C10.9269 14.369 10.8268 14.3434 10.7712 14.2924C10.7212 14.2414 10.6962 14.1421 10.6962 13.9946V13.5267C10.6962 13.3849 10.7212 13.2884 10.7712 13.2374C10.8268 13.1807 10.9269 13.1523 11.0714 13.1523H11.5383C11.6773 13.1523 11.7745 13.1807 11.8301 13.2374C11.8857 13.2884 11.9135 13.3849 11.9135 13.5267V13.9946C11.9135 14.1421 11.8857 14.2414 11.8301 14.2924C11.7745 14.3434 11.6773 14.369 11.5383 14.369H11.0714Z"
			fill="white"
		/>
	</svg>
);

const SvgCalendarIcon = ({ size = 'sm', ...props }: IconProps) => (
	<Box
		as={Svg}
		className={iconVariants({
			size,
		})}
		{...props}
	/>
);

export default SvgCalendarIcon;
