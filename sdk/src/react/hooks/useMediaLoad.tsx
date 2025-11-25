'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseMediaLoadOptions {
	onLoad?: () => void;
	onError?: () => void;
	src?: string;
	enabled?: boolean;
}

type ImgElementWithDataProp = HTMLImageElement & {
	'data-loaded-src': string | undefined;
};

export function useImageLoad({
	onLoad,
	onError,
	src,
	enabled = true,
}: UseMediaLoadOptions) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const onLoadRef = useRef(onLoad);
	const onErrorRef = useRef(onError);

	// Keep refs up to date
	useEffect(() => {
		onLoadRef.current = onLoad;
	}, [onLoad]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	// Reset states when src changes
	useEffect(() => {
		if (src) {
			setIsLoaded(false);
			setHasError(false);
		}
	}, [src]);

	const handleImageLoad = useCallback(
		(img: ImgElementWithDataProp) => {
			if (!img || !src || !enabled) return;

			// Prevent duplicate handling
			if (img['data-loaded-src'] === src) return;

			img['data-loaded-src'] = src;

			// Use decode() for reliable load detection
			const decodePromise = 'decode' in img ? img.decode() : Promise.resolve();

			decodePromise
				.then(() => {
					// Check if element is still connected to DOM
					if (!img.parentElement || !img.isConnected) {
						return;
					}

					setIsLoaded(true);
					setHasError(false);
					onLoadRef.current?.();
				})
				.catch(() => {
					// Check if element is still connected to DOM
					if (!img.parentElement || !img.isConnected) {
						return;
					}

					setHasError(true);
					setIsLoaded(false);
					onErrorRef.current?.();
				});
		},
		[src, enabled],
	);

	const imgRef = useCallback(
		(img: ImgElementWithDataProp | null) => {
			if (!img || !enabled) return;

			// Handle error state immediately if src is invalid
			if (!src) {
				setHasError(true);
				onErrorRef.current?.();
				return;
			}

			// Force src reassignment after hydration, if an error is triggered before hydration
			// the error is lost. This forces the error to be triggered again after react is hydrated
			if (onError) {
				// biome-ignore lint/correctness/noSelfAssign: See above
				img.src = img.src;
			}

			if (img.complete) {
				handleImageLoad(img);
			}

			// Set up event listeners for future loads
			const handleLoad = () => handleImageLoad(img);
			const handleError = () => {
				setHasError(true);
				setIsLoaded(false);
				onErrorRef.current?.();
			};

			img.addEventListener('load', handleLoad);
			img.addEventListener('error', handleError);

			// Cleanup
			return () => {
				img.removeEventListener('load', handleLoad);
				img.removeEventListener('error', handleError);
			};
		},
		[src, enabled, handleImageLoad, onError],
	);

	return {
		imgRef,
		isLoaded,
		hasError,
	};
}

// Hook for video elements
export function useVideoLoad({
	onLoad,
	onError,
	src,
	enabled = true,
}: UseMediaLoadOptions) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const onLoadRef = useRef(onLoad);
	const onErrorRef = useRef(onError);

	// Keep refs up to date
	useEffect(() => {
		onLoadRef.current = onLoad;
	}, [onLoad]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	// Reset states when src changes
	useEffect(() => {
		if (src) {
			setIsLoaded(false);
			setHasError(false);
		}
	}, [src]);

	const videoRef = useCallback(
		(video: HTMLVideoElement | null) => {
			if (!video || !enabled || !src) return;

			// Check if video is already loaded (readyState >= 3 means HAVE_FUTURE_DATA)
			if (video.readyState >= 3) {
				setIsLoaded(true);
				setHasError(false);
				onLoadRef.current?.();
				return;
			}

			const handleLoadedMetadata = () => {
				setIsLoaded(true);
				setHasError(false);
				onLoadRef.current?.();
			};

			const handleError = () => {
				setHasError(true);
				setIsLoaded(false);
				onErrorRef.current?.();
			};

			video.addEventListener('loadedmetadata', handleLoadedMetadata);
			video.addEventListener('error', handleError);

			return () => {
				video.removeEventListener('loadedmetadata', handleLoadedMetadata);
				video.removeEventListener('error', handleError);
			};
		},
		[src, enabled],
	);

	return {
		videoRef,
		isLoaded,
		hasError,
	};
}

export function useIframeLoad({
	onLoad,
	onError,
	src,
	enabled = true,
}: UseMediaLoadOptions) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const onLoadRef = useRef(onLoad);
	const onErrorRef = useRef(onError);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	// Keep refs up to date
	useEffect(() => {
		onLoadRef.current = onLoad;
	}, [onLoad]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	// Reset states when src changes
	useEffect(() => {
		if (src) {
			setIsLoaded(false);
			setHasError(false);
		}
	}, [src]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const iframeRef = useCallback(
		(iframe: HTMLIFrameElement | null) => {
			if (!iframe || !enabled || !src) return;

			const handleLoad = () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				setIsLoaded(true);
				setHasError(false);
				onLoadRef.current?.();
			};

			const handleError = () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				setHasError(true);
				setIsLoaded(false);
				onErrorRef.current?.();
			};

			iframe.addEventListener('load', handleLoad);
			iframe.addEventListener('error', handleError);

			// Set a timeout as fallback for cross-origin iframes
			timeoutRef.current = setTimeout(() => {
				// Assume loaded if no error after timeout
				if (!hasError) {
					setIsLoaded(true);
					onLoadRef.current?.();
				}
			}, 5000);

			return () => {
				iframe.removeEventListener('load', handleLoad);
				iframe.removeEventListener('error', handleError);
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		},
		[src, enabled, hasError],
	);

	return {
		iframeRef,
		isLoaded,
		hasError,
	};
}
