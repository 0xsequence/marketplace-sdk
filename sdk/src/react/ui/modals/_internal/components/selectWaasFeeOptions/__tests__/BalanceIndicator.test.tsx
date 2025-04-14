'use client';

import { render, screen } from '@test';
import { describe, expect, it } from 'vitest';
import BalanceIndicator from '../_components/BalanceIndicator';

describe('BalanceIndicator', () => {
	it('should render warning icon and negative text when insufficient balance', () => {
		render(
			<BalanceIndicator
				insufficientBalance={true}
				currencyBalance={{ formatted: '0.5' }}
				selectedFeeOption={{ token: { symbol: 'ETH' } }}
			/>,
		);

		expect(document.querySelector('.text-negative')).toBeInTheDocument();
		expect(screen.getByText('You have 0.5 ETH')).toBeInTheDocument();
		expect(screen.getByText('You have 0.5 ETH').className).toContain(
			'text-negative',
		);
	});

	it('should render checkmark icon and normal text when balance is sufficient', () => {
		render(
			<BalanceIndicator
				insufficientBalance={false}
				currencyBalance={{ formatted: '1.5' }}
				selectedFeeOption={{ token: { symbol: 'ETH' } }}
			/>,
		);

		expect(document.querySelector('.text-positive')).toBeInTheDocument();
		expect(screen.getByText('You have 1.5 ETH')).toBeInTheDocument();
		expect(screen.getByText('You have 1.5 ETH').className).not.toContain(
			'text-negative',
		);
	});

	it('should handle undefined currencyBalance gracefully', () => {
		render(
			<BalanceIndicator
				insufficientBalance={false}
				selectedFeeOption={{ token: { symbol: 'ETH' } }}
			/>,
		);

		expect(screen.getByText('You have 0 ETH')).toBeInTheDocument();
	});
});
