'use client';

import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';

export interface UsePaginatedCollectiblesProps {
	collectibleCards: CollectibleCardProps[];
	isLoading?: boolean;
	pageSize?: number;
}

export interface UsePaginatedCollectiblesReturn {
	collectibleCards: CollectibleCardProps[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	paginatedCards: CollectibleCardProps[];
}

export function usePaginatedCollectibles({
	collectibleCards,
	isLoading = false,
	pageSize = 6,
}: UsePaginatedCollectiblesProps): UsePaginatedCollectiblesReturn {
	const [currentPage, setCurrentPage] = useState(1);

	const paginatedCards = collectibleCards.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const totalPages = Math.ceil(collectibleCards.length / pageSize);

	return {
		collectibleCards,
		isLoading,
		currentPage,
		totalPages,
		setCurrentPage,
		paginatedCards,
	};
}
