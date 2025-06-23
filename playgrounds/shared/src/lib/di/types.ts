import type { ReactNode } from 'react';

export interface LinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	target?: string;
	rel?: string;
	prefetch?: boolean;
	replace?: boolean;
	scroll?: boolean;
	shallow?: boolean;
	passHref?: boolean;
	legacyBehavior?: boolean;
}

export interface ImageProps {
	src: string;
	alt: string;
	width?: number | string;
	height?: number | string;
	className?: string;
	loading?: 'eager' | 'lazy';
	priority?: boolean;
	quality?: number;
	placeholder?: 'blur' | 'empty';
	blurDataURL?: string;
	onLoad?: () => void;
	onError?: () => void;
	sizes?: string;
	fill?: boolean;
	style?: React.CSSProperties;
}

export interface RouterHook {
	push: (href: string) => void;
	replace: (href: string) => void;
	back: () => void;
	forward: () => void;
	refresh?: () => void;
	prefetch?: (href: string) => void;
}

export interface SearchParamsHook {
	get: (key: string) => string | null;
	getAll: (key: string) => string[];
	has: (key: string) => boolean;
	set: (key: string, value: string) => void;
	delete: (key: string) => void;
	toString: () => string;
}

export interface NavigateOptions {
	replace?: boolean;
	state?: any;
	preventScrollReset?: boolean;
	relative?: 'route' | 'path';
	unstable_flushSync?: boolean;
	unstable_viewTransition?: boolean;
}

export interface FrameworkDependencies {
	Link: React.ComponentType<LinkProps>;
	useRouter: () => RouterHook;
	useSearchParams: () => SearchParamsHook;
	usePathname: () => string;
	navigate?: (to: string, options?: NavigateOptions) => void;
	Image?: React.ComponentType<ImageProps>;
}
