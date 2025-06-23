import { createContext, type ReactNode, useContext } from 'react';
import type { FrameworkDependencies } from './types';

const DIContext = createContext<FrameworkDependencies | null>(null);

export interface DIProviderProps {
	dependencies: FrameworkDependencies;
	children: ReactNode;
}

export function DIProvider({ dependencies, children }: DIProviderProps) {
	return (
		<DIContext.Provider value={dependencies}>{children}</DIContext.Provider>
	);
}

export function useDI(): FrameworkDependencies {
	const context = useContext(DIContext);
	if (!context) {
		throw new Error('useDI must be used within a DIProvider');
	}
	return context;
}

export function useLink() {
	const { Link } = useDI();
	return Link;
}

export function useFrameworkRouter() {
	const { useRouter } = useDI();
	return useRouter();
}

export function useFrameworkSearchParams() {
	const { useSearchParams } = useDI();
	return useSearchParams();
}

export function useFrameworkPathname() {
	const { usePathname } = useDI();
	return usePathname();
}

export function useFrameworkNavigate() {
	const { navigate } = useDI();
	return navigate;
}

export function useFrameworkImage() {
	const { Image } = useDI();
	return Image;
}
