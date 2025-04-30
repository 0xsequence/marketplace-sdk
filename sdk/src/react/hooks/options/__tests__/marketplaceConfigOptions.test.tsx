import type { QueryFunctionContext } from '@tanstack/react-query';
import { renderHook, server, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { marketplaceConfigOptions } from '../../../queries/marketplaceConfig';
import {
	createErrorHandler,
	createStylesErrorHandler,
	mockConfig,
	mockStyles,
} from '../__mocks__/marketplaceConfig.msw';

type MarketplaceConfigQueryKey = ['configs', 'marketplace', string, string];
type MarketplaceConfigContext = QueryFunctionContext<MarketplaceConfigQueryKey>;

describe('marketplaceConfigOptions', () => {
	it('should fetch marketplace config and styles successfully', async () => {
		const { result } = renderHook(() =>
			marketplaceConfigOptions({
				projectId: 'test-project',
			}),
		);

		await waitFor(() => {
			expect(result.current.queryKey).toEqual([
				'configs',
				'marketplace',
				'production',
				'test-project',
			]);
			expect(result.current.queryFn).toBeDefined();
		});

		const data = await result.current.queryFn?.({
			queryKey: ['configs', 'marketplace', 'production', 'test-project'],
		} as MarketplaceConfigContext);
		expect(data).toEqual({
			...mockConfig,
			cssString: mockStyles.replaceAll(/['"]/g, ''),
			manifestUrl: expect.stringContaining('/manifest.json'),
		});
	});

	it('should use custom environment and dev access key when provided', async () => {
		const { result } = renderHook(() =>
			marketplaceConfigOptions({
				projectId: 'test-project',
				_internal: {
					builderEnv: 'development',
					devAccessKey: 'test-dev-access-key',
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.queryKey).toEqual([
				'configs',
				'marketplace',
				'development',
				'test-project',
			]);
			expect(result.current.queryFn).toBeDefined();
		});

		const data = await result.current.queryFn?.({
			queryKey: ['configs', 'marketplace', 'development', 'test-project'],
		} as MarketplaceConfigContext);
		expect(data).toEqual({
			...mockConfig,
			cssString: mockStyles.replaceAll(/['"]/g, ''),
			manifestUrl: expect.stringContaining('/manifest.json'),
		});
	});

	it('should handle error responses', async () => {
		// Override handler to return an error
		server.use(createErrorHandler());

		const { result } = renderHook(() =>
			marketplaceConfigOptions({
				projectId: 'non-existent-project',
			}),
		);

		await waitFor(() => {
			expect(result.current.queryKey).toEqual([
				'configs',
				'marketplace',
				'production',
				'non-existent-project',
			]);
			expect(result.current.queryFn).toBeDefined();
		});

		await expect(
			result.current.queryFn?.({
				queryKey: [
					'configs',
					'marketplace',
					'production',
					'non-existent-project',
				],
			} as MarketplaceConfigContext),
		).rejects.toThrow('Project not found');
	});

	it('should handle network errors when fetching styles', async () => {
		server.use(createStylesErrorHandler());

		const { result } = renderHook(() =>
			marketplaceConfigOptions({
				projectId: 'test-project',
			}),
		);

		await waitFor(() => {
			expect(result.current.queryKey).toEqual([
				'configs',
				'marketplace',
				'production',
				'test-project',
			]);
			expect(result.current.queryFn).toBeDefined();
		});

		const data = await result.current.queryFn?.({
			queryKey: ['configs', 'marketplace', 'production', 'test-project'],
		} as MarketplaceConfigContext);
		expect(data).toEqual({
			...mockConfig,
			cssString: '',
			manifestUrl: expect.stringContaining('/manifest.json'),
		});
	});
});
