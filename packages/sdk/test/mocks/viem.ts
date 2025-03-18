import { vi } from 'vitest';
import { testClient } from '../test-utils';

export const mockReadContract = vi.fn();
testClient.readContract = mockReadContract;

vi.mock('wagmi', () => ({
	usePublicClient: () => testClient,
}));
