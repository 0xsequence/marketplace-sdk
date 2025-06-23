import React from 'react';
import {
	Link as ReactRouterLink,
	useLocation,
	useNavigate,
	useSearchParams as useReactRouterSearchParams,
} from 'react-router';
import type {
	FrameworkDependencies,
	LinkProps,
	NavigateOptions,
	RouterHook,
	SearchParamsHook,
} from '../di/types';

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	(
		{
			href,
			children,
			className,
			onClick,
			target,
			rel,
			prefetch,
			replace,
			...props
		},
		ref,
	) => {
		return (
			<ReactRouterLink
				ref={ref}
				to={href}
				className={className}
				onClick={onClick}
				target={target}
				rel={rel}
				replace={replace}
				preventScrollReset={false}
				{...props}
			>
				{children}
			</ReactRouterLink>
		);
	},
);
Link.displayName = 'ReactRouterLinkAdapter';

function useRouter(): RouterHook {
	const navigate = useNavigate();

	return {
		push: (href: string) => navigate(href),
		replace: (href: string) => navigate(href, { replace: true }),
		back: () => navigate(-1),
		forward: () => navigate(1),
	};
}

function useSearchParams(): SearchParamsHook {
	const [searchParams, setSearchParams] = useReactRouterSearchParams();

	return {
		get: (key: string) => searchParams.get(key),
		getAll: (key: string) => searchParams.getAll(key),
		has: (key: string) => searchParams.has(key),
		set: (key: string, value: string) => {
			setSearchParams((prev: URLSearchParams) => {
				const params = new URLSearchParams(prev);
				params.set(key, value);
				return params;
			});
		},
		delete: (key: string) => {
			setSearchParams((prev: URLSearchParams) => {
				const params = new URLSearchParams(prev);
				params.delete(key);
				return params;
			});
		},
		toString: () => searchParams.toString(),
	};
}

function usePathname(): string {
	const location = useLocation();
	return location.pathname;
}

function navigate(to: string, options?: NavigateOptions): void {
	const nav = useNavigate();
	nav(to, options);
}

export const reactRouterDependencies: FrameworkDependencies = {
	Link,
	useRouter,
	useSearchParams,
	usePathname,
	navigate,
};
