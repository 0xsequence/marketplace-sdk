import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIframeLoad, useImageLoad, useVideoLoad } from '../useImageLoad';

describe('useImageLoad', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should handle already loaded images (SSR case)', async () => {
		const onLoad = vi.fn();
		const onError = vi.fn();

		// Create a mock image element that's already loaded
		const mockImg = {
			complete: true,
			naturalWidth: 100,
			decode: vi.fn().mockResolvedValue(undefined),
			parentElement: document.createElement('div'),
			isConnected: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			'data-loaded-src': undefined,
		} as any;

		const { result } = renderHook(() =>
			useImageLoad({
				onLoad,
				onError,
				src: 'https://example.com/image.jpg',
			}),
		);

		// Call the ref callback with the mock image
		act(() => {
			result.current.imgRef(mockImg);
		});

		// Should call decode and then onLoad
		expect(mockImg.decode).toHaveBeenCalled();
		expect(result.current.isLoaded).toBe(false); // Will be true after decode resolves

		// Wait for decode promise to resolve
		await act(async () => {
			await vi.runAllTimersAsync();
		});

		// Now check that isLoaded is true after decode resolves
		expect(result.current.isLoaded).toBe(true);
		expect(onLoad).toHaveBeenCalled();
	});

	it('should handle image load errors', async () => {
		const onLoad = vi.fn();
		const onError = vi.fn();

		// Create a mock image element
		const mockImg = {
			complete: false,
			decode: vi.fn().mockRejectedValue(new Error('Failed to decode')),
			parentElement: document.createElement('div'),
			isConnected: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			'data-loaded-src': undefined,
			src: '',
		} as any;

		const { result } = renderHook(() =>
			useImageLoad({
				onLoad,
				onError,
				src: 'https://example.com/image.jpg',
			}),
		);

		// Call the ref callback with the mock image
		act(() => {
			result.current.imgRef(mockImg);
		});

		// Simulate error event
		const errorHandler = mockImg.addEventListener.mock.calls.find(
			(call: any) => call[0] === 'error',
		)?.[1];

		act(() => {
			errorHandler?.();
		});

		// Should set error state
		expect(result.current.hasError).toBe(true);
		expect(onError).toHaveBeenCalled();
	});

	it('should not call handlers when disabled', () => {
		const onLoad = vi.fn();
		const onError = vi.fn();

		const mockImg = {
			complete: true,
			naturalWidth: 100,
			decode: vi.fn().mockResolvedValue(undefined),
			parentElement: document.createElement('div'),
			isConnected: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			'data-loaded-src': undefined,
		} as any;

		const { result } = renderHook(() =>
			useImageLoad({
				onLoad,
				onError,
				src: 'https://example.com/image.jpg',
				enabled: false,
			}),
		);

		// Call the ref callback with the mock image
		act(() => {
			result.current.imgRef(mockImg);
		});

		// Should not call any handlers when disabled
		expect(mockImg.decode).not.toHaveBeenCalled();
		expect(onLoad).not.toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();
	});
});

describe('useVideoLoad', () => {
	it('should handle already loaded videos', () => {
		const onLoad = vi.fn();
		const onError = vi.fn();

		// Create a mock video element that's already loaded
		const mockVideo = {
			readyState: 4, // HAVE_ENOUGH_DATA
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as unknown as HTMLVideoElement;

		const { result } = renderHook(() =>
			useVideoLoad({
				onLoad,
				onError,
				src: 'https://example.com/video.mp4',
			}),
		);

		// Call the ref callback with the mock video
		act(() => {
			result.current.videoRef(mockVideo);
		});

		// Should immediately set loaded state
		expect(result.current.isLoaded).toBe(true);
		expect(onLoad).toHaveBeenCalled();
	});
});

describe('useIframeLoad', () => {
	it('should handle iframe load events', () => {
		const onLoad = vi.fn();
		const onError = vi.fn();

		const mockIframe = {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as unknown as HTMLIFrameElement;

		const { result } = renderHook(() =>
			useIframeLoad({
				onLoad,
				onError,
				src: 'https://example.com/iframe.html',
			}),
		);

		// Call the ref callback with the mock iframe
		act(() => {
			result.current.iframeRef(mockIframe);
		});

		// Should set up event listeners
		expect(mockIframe.addEventListener).toHaveBeenCalledWith(
			'load',
			expect.any(Function),
		);
		expect(mockIframe.addEventListener).toHaveBeenCalledWith(
			'error',
			expect.any(Function),
		);
	});
});
