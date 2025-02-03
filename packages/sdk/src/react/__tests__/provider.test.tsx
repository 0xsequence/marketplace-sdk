import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketplaceProvider, MarketplaceSdkContext } from '../provider';
import { useContext } from 'react';
import { InvalidProjectAccessKeyError } from '../../utils/_internal/error/config';
import type { SdkConfig } from '../../types';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Test component to verify context value
function TestComponent() {
	const config = useContext(MarketplaceSdkContext);
	return <div data-testid="config-value">{config.projectAccessKey}</div>;
}

describe('MarketplaceProvider', () => {
	let baseSdkConfig: SdkConfig;

	beforeEach(() => {
		baseSdkConfig = {
			projectAccessKey: 'test-access-key',
			projectId: '1',
		};
	});

	it('should throw error when projectAccessKey is empty', () => {
		const invalidConfig: SdkConfig = {
			...baseSdkConfig,
			projectAccessKey: '',
		};

		expect(() =>
			render(
				<MarketplaceProvider config={invalidConfig}>
					<div>Test</div>
				</MarketplaceProvider>,
			),
		).toThrow(InvalidProjectAccessKeyError);
	});

	it('should render children when config is valid', () => {
		const testMessage = 'Test Content';
		const { getByText } = render(
			<MarketplaceProvider config={baseSdkConfig}>
				<div>{testMessage}</div>
			</MarketplaceProvider>,
		);

		expect(getByText(testMessage)).toBeInTheDocument();
	});

	it('should provide config through context', () => {
		render(
			<MarketplaceProvider config={baseSdkConfig}>
				<TestComponent />
			</MarketplaceProvider>,
		);

		expect(screen.getByTestId('config-value')).toHaveTextContent(
			baseSdkConfig.projectAccessKey,
		);
	});

	it('should render with provider ID', () => {
		const { container } = render(
			<MarketplaceProvider config={baseSdkConfig}>
				<div>Test</div>
			</MarketplaceProvider>,
		);

		const providerElement = container.querySelector('#sdk-provider');
		expect(providerElement).toBeInTheDocument();
	});
});
